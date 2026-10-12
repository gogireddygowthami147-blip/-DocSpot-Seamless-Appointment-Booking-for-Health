const userModel = require('../models/userModel');
const doctorModel = require('../models/doctorModel');
const appointmentModel = require('../models/appointmentModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register
const registerController = async (req, res) => {
    try {
        const existingUser = await userModel.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(200).send({ message: 'User Already Exists', success: false });
        }
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        req.body.password = hashedPassword;
        const newUser = new userModel(req.body);
        await newUser.save();
        res.status(201).send({ message: 'Registered Successfully', success: true });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: `Register Controller ${error.message}` });
    }
};

// Login
const loginController = async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.body.email });
        if (!user) {
            return res.status(200).send({ message: 'User not found', success: false });
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(200).send({ message: 'Invalid Email or Password', success: false });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(200).send({ message: 'Login Success', success: true, token });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: `Error in Login CTRL ${error.message}` });
    }
};

// ===============================================
// AUTH CONTROLLER - REFINED LOGIC
// ===============================================
const authController = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.body.userId });
        if (!user) {
            return res.status(200).send({
                message: "User not found",
                success: false,
            });
        } else {
            // It's good practice to not send the password back, even if it's hashed
            user.password = undefined;
            res.status(200).send({
                success: true,
                data: user,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: 'Auth Error',
            success: false,
            error,
        });
    }
};

// Apply Doctor
const applyDoctorController = async (req, res) => {
    try {
        const newDoctor = await doctorModel({ ...req.body, status: 'pending' });
        await newDoctor.save();
        const adminUser = await userModel.findOne({ isAdmin: true });
        // Handle case where no admin user is found
        if (!adminUser) {
            return res.status(201).send({ success: true, message: 'Doctor Account Applied Successfully (No admin to notify)' });
        }
        const notification = adminUser.notification;
        notification.push({
            type: 'apply-doctor-request',
            message: `${newDoctor.firstName} ${newDoctor.lastName} has applied for a doctor account`,
            data: {
                doctorId: newDoctor._id,
                name: newDoctor.firstName + " " + newDoctor.lastName,
                onClickPath: '/admin/doctors'
            }
        });
        await userModel.findByIdAndUpdate(adminUser._id, { notification });
        res.status(201).send({ success: true, message: 'Doctor Account Applied Successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, error, message: 'Error while applying for doctor' });
    }
};

// Get All Approved Doctors (for user homepage)
const getAllDoctorsController = async (req, res) => {
    try {
        const doctors = await doctorModel.find({ status: 'approved' });
        res.status(200).send({
            success: true,
            message: "Doctors list fetched successfully",
            data: doctors,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error while fetching doctors list"
        });
    }
};

// Get single doctor by ID
const getDoctorByIdController = async (req, res) => {
    try {
        const doctor = await doctorModel.findOne({ _id: req.body.doctorId });
        if (!doctor) {
            return res.status(404).send({ success: false, message: 'Doctor not found' });
        }
        res.status(200).send({
            success: true,
            message: 'Doctor info fetched successfully',
            data: doctor,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error fetching doctor info',
        });
    }
};

// Check booking availability
const checkBookingAvailabilityController = async (req, res) => {
    try {
        const { doctorId, date, time } = req.body;
        // Check if there is an existing appointment for this doctor on this date and time
        const existingAppointment = await appointmentModel.findOne({
            doctorId,
            date,
            time,
            status: { $ne: 'rejected' },
        });

        if (existingAppointment) {
            return res.status(200).send({
                message: 'Appointment slot is not available at this time',
                success: true,
                isAvailable: false,
            });
        } else {
            return res.status(200).send({
                success: true,
                isAvailable: true,
                message: 'Appointment slot is available',
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error while checking appointment availability',
        });
    }
};

// Book Appointment
const bookAppointmentController = async (req, res) => {
    try {
        const newAppointment = new appointmentModel({
            ...req.body,
            status: 'pending',
        });
        await newAppointment.save();

        // Notify Doctor
        const doctor = await doctorModel.findOne({ _id: req.body.doctorId });
        if (doctor) {
            const doctorUser = await userModel.findOne({ _id: doctor.userId });
            if (doctorUser) {
                doctorUser.notification = doctorUser.notification || [];
                const patientName = req.body.userInfo?.name || req.body.userInfo || 'A patient';
                doctorUser.notification.push({
                    type: 'New-appointment-request',
                    message: `New appointment requested by ${patientName} on ${req.body.date} at ${req.body.time}`,
                    onClickPath: '/doctor-appointments',
                });
                await doctorUser.save();
            }
        }

        // Notify User
        const user = await userModel.findOne({ _id: req.body.userId });
        if (user) {
            user.notification = user.notification || [];
            const docName = doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : 'the doctor';
            user.notification.push({
                type: 'Appointment-booked',
                message: `Your appointment with ${docName} on ${req.body.date} at ${req.body.time} has been requested`,
                onClickPath: '/appointments',
            });
            await user.save();
        }

        res.status(200).send({
            success: true,
            message: 'Appointment booked successfully and is pending confirmation',
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error while booking appointment',
        });
    }
};

// User Appointments List
const userAppointmentsController = async (req, res) => {
    try {
        const appointments = await appointmentModel.find({
            userId: req.body.userId,
        }).sort({ createdAt: -1 });

        res.status(200).send({
            success: true,
            message: 'User appointments fetched successfully',
            data: appointments,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error while fetching user appointments',
        });
    }
};

// Notifications: Mark all as read
const getAllNotificationController = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.body.userId });
        if (!user) {
            return res.status(404).send({ success: false, message: 'User not found' });
        }
        user.seennotification = user.seennotification || [];
        user.notification = user.notification || [];
        user.seennotification.push(...user.notification);
        user.notification = [];
        const updatedUser = await user.save();
        updatedUser.password = undefined;
        res.status(200).send({
            success: true,
            message: 'All notifications marked as read',
            data: updatedUser,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: 'Error in marking notifications',
            success: false,
            error,
        });
    }
};

// Notifications: Delete all read notifications
const deleteAllNotificationController = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.body.userId });
        if (!user) {
            return res.status(404).send({ success: false, message: 'User not found' });
        }
        user.seennotification = [];
        const updatedUser = await user.save();
        updatedUser.password = undefined;
        res.status(200).send({
            success: true,
            message: 'Notifications deleted successfully',
            data: updatedUser,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Unable to delete notifications',
            error,
        });
    }
};

module.exports = { 
    loginController, 
    registerController, 
    authController, 
    applyDoctorController, 
    getAllDoctorsController,
    getDoctorByIdController,
    checkBookingAvailabilityController,
    bookAppointmentController,
    userAppointmentsController,
    getAllNotificationController,
    deleteAllNotificationController,
};
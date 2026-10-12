const doctorModel = require('../models/doctorModel');
const appointmentModel = require('../models/appointmentModel');
const userModel = require('../models/userModel');

// Get Doctor Info by userId
const getDoctorInfoController = async (req, res) => {
    try {
        const doctor = await doctorModel.findOne({ userId: req.body.userId });
        res.status(200).send({
            success: true,
            message: 'Doctor data fetch success',
            data: doctor,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error in fetching doctor details',
        });
    }
};

// Update Doctor Profile
const updateProfileController = async (req, res) => {
    try {
        const doctor = await doctorModel.findOneAndUpdate(
            { userId: req.body.userId },
            req.body,
            { new: true }
        );
        res.status(200).send({
            success: true,
            message: 'Doctor Profile Updated Successfully',
            data: doctor,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Doctor profile update issue',
        });
    }
};

// Get Doctor Appointments
const getDoctorAppointmentsController = async (req, res) => {
    try {
        const doctor = await doctorModel.findOne({ userId: req.body.userId });
        if (!doctor) {
            return res.status(200).send({
                success: true,
                message: 'Doctor profile not found',
                data: [],
            });
        }
        const appointments = await appointmentModel.find({
            doctorId: doctor._id.toString(),
        }).sort({ createdAt: -1 });

        res.status(200).send({
            success: true,
            message: 'Doctor appointments fetched successfully',
            data: appointments,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error in fetching doctor appointments',
        });
    }
};

// Update Appointment Status (Approve/Reject)
const updateAppointmentStatusController = async (req, res) => {
    try {
        const { appointmentId, status } = req.body;
        const appointment = await appointmentModel.findByIdAndUpdate(
            appointmentId,
            { status },
            { new: true }
        );
        if (!appointment) {
            return res.status(404).send({ success: false, message: 'Appointment not found' });
        }

        const user = await userModel.findOne({ _id: appointment.userId });
        if (user) {
            user.notification = user.notification || [];
            user.notification.push({
                type: 'status-updated',
                message: `Your appointment on ${appointment.date} at ${appointment.time} has been ${status}`,
                onClickPath: '/appointments',
            });
            await user.save();
        }

        res.status(200).send({
            success: true,
            message: `Appointment status updated to ${status}`,
            data: appointment,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error in updating appointment status',
        });
    }
};

module.exports = {
    getDoctorInfoController,
    updateProfileController,
    getDoctorAppointmentsController,
    updateAppointmentStatusController,
};

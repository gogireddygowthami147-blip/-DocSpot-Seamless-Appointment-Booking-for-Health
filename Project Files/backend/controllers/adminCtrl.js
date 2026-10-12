const doctorModel = require("../models/doctorModel");
const userModel = require("../models/userModel");
const appointmentModel = require("../models/appointmentModel");

const getAllUsersController = async (req, res) => {
  try {
    const users = await userModel.find({});
    res.status(200).send({
      success: true,
      message: "Users data list",
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while fetching users",
      error,
    });
  }
};

const getAllDoctorsController = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    res.status(200).send({
      success: true,
      message: "Doctors data list",
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while fetching doctors",
      error,
    });
  }
};

// Doctor account status controller
const changeAccountStatusController = async (req, res) => {
  try {
    const { doctorId, status } = req.body;
    const doctor = await doctorModel.findByIdAndUpdate(doctorId, { status }, { new: true });
    if (!doctor) {
      return res.status(404).send({ success: false, message: "Doctor not found" });
    }
    const user = await userModel.findOne({ _id: doctor.userId });
    if (user) {
      user.notification = user.notification || [];
      user.notification.push({
        type: "doctor-account-request-updated",
        message: `Your Doctor Account Request has been ${status}`,
        onClickPath: "/notification",
      });
      user.isDoctor = status === "approved";
      await user.save();
    }
    res.status(200).send({
      success: true,
      message: "Account Status Updated",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Account Status",
      error,
    });
  }
};

// Add this controller function for appointment list
const getAllAppointmentsController = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({}).sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      message: "Appointments List Fetched Successfully",
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while fetching appointments",
      error,
    });
  }
};

// Admin delete/block user
const deleteUserController = async (req, res) => {
  try {
    const { userId } = req.body;
    await userModel.findByIdAndDelete(userId);
    res.status(200).send({
      success: true,
      message: "User removed successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while removing user",
      error,
    });
  }
};

module.exports = {
  getAllDoctorsController,
  getAllUsersController,
  changeAccountStatusController,
  getAllAppointmentsController,
  deleteUserController,
};
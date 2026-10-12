const express = require("express");
const {
  getAllUsersController,
  getAllDoctorsController,
  changeAccountStatusController,
  getAllAppointmentsController,
  deleteUserController,
} = require("../controllers/adminCtrl");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// GET Method || USERS
router.get("/getAllUsers", authMiddleware, getAllUsersController);

// GET Method || DOCTORS
router.get("/getAllDoctors", authMiddleware, getAllDoctorsController);

// GET Method || APPOINTMENTS
router.get("/getAllAppointments", authMiddleware, getAllAppointmentsController);

// POST Method || ACCOUNT STATUS
router.post(
  "/changeAccountStatus",
  authMiddleware,
  changeAccountStatusController
);

// POST Method || DELETE/BLOCK USER
router.post("/deleteUser", authMiddleware, deleteUserController);

module.exports = router;
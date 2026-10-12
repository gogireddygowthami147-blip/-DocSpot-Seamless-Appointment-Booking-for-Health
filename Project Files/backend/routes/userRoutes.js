const express = require('express');
const { 
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
} = require('../controllers/userCtrl');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Public Routes
router.post('/login', loginController);
router.post('/register', registerController);

// Protected Routes
router.post('/getUserData', authMiddleware, authController);
router.post('/apply-doctor', authMiddleware, applyDoctorController);
router.get('/getAllDoctors', authMiddleware, getAllDoctorsController);

// Doctor Info for booking
router.post('/getDoctorById', authMiddleware, getDoctorByIdController);

// Appointment Booking
router.post('/check-booking-availbility', authMiddleware, checkBookingAvailabilityController);
router.post('/book-appointment', authMiddleware, bookAppointmentController);
router.get('/user-appointments', authMiddleware, userAppointmentsController);

// Notifications
router.post('/get-all-notification', authMiddleware, getAllNotificationController);
router.post('/delete-all-notification', authMiddleware, deleteAllNotificationController);

module.exports = router;
const express = require('express');
const {
    getDoctorInfoController,
    updateProfileController,
    getDoctorAppointmentsController,
    updateAppointmentStatusController,
} = require('../controllers/doctorCtrl');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// POST || GET SINGLE DOCTOR INFO
router.post('/getDoctorInfo', authMiddleware, getDoctorInfoController);

// POST || UPDATE DOCTOR PROFILE
router.post('/updateProfile', authMiddleware, updateProfileController);

// GET || DOCTOR APPOINTMENTS
router.get('/doctor-appointments', authMiddleware, getDoctorAppointmentsController);

// POST || UPDATE APPOINTMENT STATUS
router.post('/update-status', authMiddleware, updateAppointmentStatusController);

module.exports = router;

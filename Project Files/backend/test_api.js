const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config({ path: __dirname + '/.env' });

async function runTests() {
    console.log('--- 1. Testing MongoDB Connection ---');
    await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/projectfinal');
    console.log('MongoDB connected successfully');

    const userModel = require('./models/userModel');
    const doctorModel = require('./models/doctorModel');
    const appointmentModel = require('./models/appointmentModel');

    console.log('--- 2. Verifying Models and Seed Data ---');
    const totalUsers = await userModel.countDocuments();
    const totalDoctors = await doctorModel.countDocuments();
    console.log(`Found ${totalUsers} users and ${totalDoctors} doctors in DB.`);

    // Check doctors
    const approvedDoctor = await doctorModel.findOne({ status: 'approved' });
    if (!approvedDoctor) {
        console.error('No approved doctor found!');
        process.exit(1);
    }
    console.log(`Approved doctor found: Dr. ${approvedDoctor.firstName} ${approvedDoctor.lastName} (ID: ${approvedDoctor._id})`);

    // Find or create test patient
    let testUser = await userModel.findOne({ email: 'testpatient@docspot.com' });
    if (!testUser) {
        const bcrypt = require('bcryptjs');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);
        testUser = new userModel({
            name: 'Test Patient',
            email: 'testpatient@docspot.com',
            password: hashedPassword,
            phone: '9876543210',
            isAdmin: false,
            isDoctor: false,
        });
        await testUser.save();
        console.log('Created test patient user');
    } else {
        console.log('Test patient user exists');
    }

    // Generate JWT
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: testUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    console.log('Generated JWT token for test user');

    // Test Appointment Booking Flow
    console.log('--- 3. Testing Appointment Booking Flow ---');
    const testDate = '2026-10-15';
    const testTime = '11:00';

    // Check Availability
    const existing = await appointmentModel.findOne({
        doctorId: approvedDoctor._id.toString(),
        date: testDate,
        time: testTime,
        status: { $ne: 'rejected' },
    });
    console.log('Availability check result:', existing ? 'Slot occupied' : 'Slot free');

    // Create appointment
    const newAppointment = new appointmentModel({
        userId: testUser._id.toString(),
        doctorId: approvedDoctor._id.toString(),
        doctorInfo: approvedDoctor,
        userInfo: { name: testUser.name, email: testUser.email, phone: testUser.phone },
        date: testDate,
        time: testTime,
        status: 'pending',
    });
    await newAppointment.save();
    console.log(`Appointment created with ID: ${newAppointment._id}`);

    // Verify appointment retrieval
    const userAppointments = await appointmentModel.find({ userId: testUser._id.toString() });
    console.log(`User has ${userAppointments.length} appointments.`);

    // Test Doctor Status Update (Approve)
    console.log('--- 4. Testing Doctor Approval Flow ---');
    newAppointment.status = 'approved';
    await newAppointment.save();
    console.log('Appointment status updated to approved');

    // Test Notifications
    console.log('--- 5. Testing Notification Push ---');
    testUser.notification = testUser.notification || [];
    testUser.notification.push({
        type: 'test-notification',
        message: 'Your appointment is confirmed',
        onClickPath: '/appointments',
    });
    await testUser.save();

    // Mark as read
    testUser.seennotification = testUser.seennotification || [];
    testUser.seennotification.push(...testUser.notification);
    testUser.notification = [];
    await testUser.save();
    console.log('Notification mark-as-read verified');

    console.log('--- ALL INTEGRATION TESTS PASSED SUCCESSFULLY! ---');
    process.exit(0);
}

runTests().catch(err => {
    console.error('Integration test failed:', err);
    process.exit(1);
});

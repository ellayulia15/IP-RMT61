const express = require('express');
const router = express.Router();
const userRoutes = require('./user');
const tutorRoutes = require('./tutor');
const scheduleRoutes = require('./schedule');
const bookingRoutes = require('./booking');

router.use('/', userRoutes);
router.use('/', tutorRoutes);
router.use('/', scheduleRoutes);
router.use('/', bookingRoutes);

module.exports = router;

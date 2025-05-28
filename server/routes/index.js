const express = require('express');
const router = express.Router();
const userRoutes = require('./user');
const tutorRoutes = require('./tutor');
const scheduleRoutes = require('./schedule');

router.use('/', userRoutes);
router.use('/', tutorRoutes);
router.use('/', scheduleRoutes);

module.exports = router;

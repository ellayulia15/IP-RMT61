const express = require('express');
const router = express.Router();
const ScheduleController = require('../controllers/scheduleController');
const authentication = require('../middlewares/authentication');

// Protected routes - require authentication
router.post('/schedules', authentication, ScheduleController.createSchedule);

module.exports = router;

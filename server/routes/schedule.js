const express = require('express');
const router = express.Router();
const ScheduleController = require('../controllers/scheduleController');
const authentication = require('../middlewares/authentication');

// Protected routes - require authentication
router.post('/schedules', authentication, ScheduleController.createSchedule);
router.get('/schedules', authentication, ScheduleController.getAllSchedules);
router.put('/schedules/:id', authentication, ScheduleController.updateSchedule);
router.delete('/schedules/:id', authentication, ScheduleController.deleteSchedule);

module.exports = router;

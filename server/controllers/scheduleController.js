const { Schedule, Tutor } = require('../models');

class ScheduleController {
    static async createSchedule(req, res, next) {
        try {
            // Check if user is tutor
            if (req.user.role !== 'Tutor') {
                throw { name: 'Forbidden', message: 'Only tutors can create schedules' };
            }

            // Get tutor profile
            const tutorProfile = await Tutor.findOne({
                where: { UserId: req.user.id }
            });

            if (!tutorProfile) {
                throw { name: 'NotFound', message: 'Tutor profile not found' };
            }

            const { date, time, fee } = req.body;

            // Validate date format
            const scheduleDate = new Date(date);
            if (isNaN(scheduleDate.getTime())) {
                throw { name: 'BadRequest', message: 'Invalid date format' };
            }

            // Create schedule
            const schedule = await Schedule.create({
                TutorId: tutorProfile.id,
                date: scheduleDate,
                time,
                fee
            });

            res.status(201).json({
                message: 'Schedule created successfully',
                data: schedule
            });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = ScheduleController;

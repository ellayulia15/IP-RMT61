const { Schedule, Tutor, User } = require('../models');
const { Op } = require('sequelize');

class ScheduleController {
    static async getAllSchedules(req, res, next) {
        try {
            // If user is logged in and is a tutor, only show their schedules
            if (req.user && req.user.role === 'Tutor') {
                const tutorProfile = await Tutor.findOne({
                    where: { UserId: req.user.id }
                });

                if (!tutorProfile) {
                    throw { name: 'NotFound', message: 'Tutor profile not found' };
                }

                const schedules = await Schedule.findAll({
                    where: { TutorId: tutorProfile.id }
                });

                return res.json({
                    message: 'Schedules retrieved successfully',
                    data: schedules
                });
            }
        } catch (err) {
            next(err);
        }
    }

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

    static async updateSchedule(req, res, next) {
        try {
            // Check if user is tutor
            if (req.user.role !== 'Tutor') {
                throw { name: 'Forbidden', message: 'Only tutors can update schedules' };
            }

            const { date, time, fee } = req.body;

            // Find schedule and check ownership
            const schedule = await Schedule.findByPk(req.params.id);

            if (!schedule) {
                throw { name: 'NotFound', message: 'Schedule not found' };
            }

            // Validate date format if provided
            let scheduleDate = schedule.date;
            if (date) {
                scheduleDate = new Date(date);
                if (isNaN(scheduleDate.getTime())) {
                    throw { name: 'BadRequest', message: 'Invalid date format' };
                }
            }

            // Update schedule
            const updatedSchedule = await schedule.update({
                date: scheduleDate,
                time: time || schedule.time,
                fee: fee || schedule.fee
            });

            res.json({
                message: 'Schedule updated successfully',
                data: updatedSchedule
            });
        } catch (err) {
            next(err);
        }
    }

    static async deleteSchedule(req, res, next) {
        try {
            // Check if user is tutor
            if (req.user.role !== 'Tutor') {
                throw { name: 'Forbidden', message: 'Only tutors can delete schedules' };
            }

            // Find schedule and check ownership
            const schedule = await Schedule.findByPk(req.params.id, {
                include: [{
                    model: Tutor,
                    where: { UserId: req.user.id } // Ensures tutor owns this schedule
                }]
            });

            if (!schedule) {
                throw { name: 'NotFound', message: 'Schedule not found' };
            }

            await schedule.destroy();

            res.json({
                message: 'Schedule deleted successfully'
            });
        } catch (err) {
            next(err);
        }
    }

    static async getScheduleById(req, res, next) {
        try {
            const schedule = await Schedule.findByPk(req.params.id);

            if (!schedule) {
                throw { name: 'NotFound', message: 'Schedule not found' };
            }

            // If user is tutor, verify ownership
            if (req.user.role === 'Tutor') {
                const tutorProfile = await Tutor.findOne({
                    where: { UserId: req.user.id }
                });

                if (!tutorProfile || schedule.TutorId !== tutorProfile.id) {
                    throw { name: 'Forbidden', message: 'You can only view your own schedules' };
                }
            }

            res.json({
                message: 'Schedule retrieved successfully',
                data: schedule
            });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = ScheduleController;

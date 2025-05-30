const { Tutor, User, Schedule } = require('../models');
const { Op } = require('sequelize');

class TutorController {
    static async getAllTutors(req, res, next) {
        try {
            const tutors = await Tutor.findAll({
                include: [
                    {
                        model: User,
                        attributes: ['fullName'] // Only include safe user data
                    }
                ]
            });

            res.json({
                message: 'Tutors retrieved successfully',
                data: tutors
            });
        } catch (err) {
            next(err);
        }
    }
    
    static async getTutorById(req, res, next) {
        try {
            const tutor = await Tutor.findByPk(req.params.id, {
                include: [
                    {
                        model: User,
                        attributes: ['fullName', 'email']
                    },
                    {
                        model: Schedule,
                        where: {
                            date: {
                                [Op.gte]: new Date() // Only include future schedules
                            }
                        },
                        required: false // LEFT JOIN to show tutor even without schedules
                    }
                ]
            });

            if (!tutor) {
                throw { name: 'NotFound', message: 'Tutor not found' };
            }

            res.json({
                message: 'Tutor retrieved successfully',
                data: tutor
            });
        } catch (err) {
            next(err);
        }
    }
    static async createTutorProfile(req, res, next) {
        try {
            const { photoUrl, subjects, style } = req.body;

            // Check if user is tutor and doesn't have a profile yet
            if (req.user.role !== 'Tutor') {
                throw { status: 403, message: 'Only tutors can create a profile' };
            }

            const tutor = await Tutor.create({
                UserId: req.user.id,
                photoUrl,
                subjects,
                style
            });

            res.status(201).json({
                message: 'Tutor profile created successfully',
                data: tutor
            });
        } catch (err) {
            next(err);
        }
    } static async getMyProfile(req, res, next) {
        try {            // Check if user is tutor
            if (req.user.role !== 'Tutor') {
                throw { name: 'Forbidden', message: 'Only tutors can access this endpoint' };
            }

            // Get tutor profile with associated data
            const tutorProfile = await Tutor.findOne({
                where: { UserId: req.user.id }
            });

            // If no profile exists yet, return empty data
            if (!tutorProfile) {
                return res.json({
                    message: 'No tutor profile found',
                    data: null
                });
            }

            // Get schedules separately to avoid any join issues
            res.json({
                message: 'Tutor profile retrieved successfully',
                data: {
                    id: tutorProfile.id,
                    photoUrl: tutorProfile.photoUrl,
                    subjects: tutorProfile.subjects,
                    style: tutorProfile.style
                }
            });
        } catch (err) {
            next(err);
        }
    }

    static async updateTutorProfile(req, res, next) {
        try {
            const { photoUrl, subjects, style } = req.body;

            // Check if user is tutor
            if (req.user.role !== 'Tutor') {
                throw { name: 'Forbidden', message: 'Only users with Tutor role can update a profile' };
            }

            // Find tutor profile
            const tutorProfile = await Tutor.findOne({
                where: { UserId: req.user.id }
            });

            if (!tutorProfile) {
                throw { name: 'NotFound', message: 'Tutor profile not found' };
            }

            // Update tutor profile
            const updatedTutor = await tutorProfile.update({
                photoUrl,
                subjects,
                style
            });

            res.json({
                message: 'Tutor profile updated successfully',
                data: {
                    id: updatedTutor.id,
                    photoUrl: updatedTutor.photoUrl,
                    subjects: updatedTutor.subjects,
                    style: updatedTutor.style,
                    UserId: updatedTutor.UserId
                }
            });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = TutorController;

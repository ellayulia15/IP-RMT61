const { Tutor } = require('../models');

class TutorController {
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
    }
}

module.exports = TutorController;

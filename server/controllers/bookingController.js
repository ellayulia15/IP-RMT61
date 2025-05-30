const { Booking, Schedule, Tutor, User } = require('../models');

class BookingController {
    static async getAllBookings(req, res, next) {
        try {
            console.log('GET /bookings', {
                user: req.user,
                headers: req.headers
            });

            let whereClause = {};
            let includeOptions = [
                {
                    model: Schedule,
                    include: [{
                        model: Tutor,
                        include: [{
                            model: User,
                            attributes: ['fullName']
                        }]
                    }]
                }
            ];

            // If user is student, show only their bookings
            if (req.user.role === 'Student') {
                whereClause.studentId = req.user.id;
            }            // If user is tutor, show bookings for their schedules
            else if (req.user.role === 'Tutor') {
                const tutorProfile = await Tutor.findOne({
                    where: { UserId: req.user.id }
                });
                if (!tutorProfile) {
                    // If no profile exists yet, return empty bookings
                    return res.json({
                        message: 'No tutor profile found',
                        data: []
                    });
                }
                includeOptions = [
                    {
                        model: Schedule,
                        where: { TutorId: tutorProfile.id },
                        include: [{
                            model: Tutor,
                            include: [{
                                model: User,
                                attributes: ['fullName']
                            }]
                        }]
                    }
                ];
            } const bookings = await Booking.findAll({
                where: whereClause,
                include: includeOptions,
                order: [['createdAt', 'DESC']]
            });

            res.json({
                message: bookings.length ? 'Bookings retrieved successfully' : 'No bookings found',
                data: bookings // Will be empty array if no bookings
            });
        } catch (err) {
            next(err);
        }
    } static async createBooking(req, res, next) {
        try {            // Only students can create bookings
            if (req.user.role !== 'Student') {
                return res.status(403).json({
                    message: 'Only students can create bookings'
                });
            }

            const { ScheduleId } = req.body;
            if (!ScheduleId) {
                return res.status(400).json({
                    message: 'ScheduleId is required'
                });
            }

            // Check if schedule exists and is available
            const schedule = await Schedule.findByPk(ScheduleId);
            if (!schedule) {
                return res.status(404).json({
                    message: 'Schedule not found'
                });
            }

            // Check if student already has a booking for this schedule
            const existingBooking = await Booking.findOne({
                where: {
                    ScheduleId,
                    studentId: req.user.id
                }
            });

            if (existingBooking) {
                return res.status(400).json({
                    message: 'You already have a booking for this schedule'
                });
            }            // Create booking
            const booking = await Booking.create({
                studentId: req.user.id,
                ScheduleId,
                bookingStatus: 'Pending',
                paymentStatus: 'Pending'
            });

            return res.status(201).json({
                message: 'Booking created successfully',
                data: booking
            });
        } catch (err) {
            next(err);
        }
    } static async updateBookingStatus(req, res, next) {
        try {
            // Only tutors can update booking status
            if (req.user.role !== 'Tutor') {
                return res.status(403).json({
                    message: 'Only tutors can update booking status'
                });
            }

            const { status } = req.body;
            if (!['Approved', 'Rejected'].includes(status)) {
                return res.status(400).json({
                    message: 'Invalid status. Must be approved or rejected'
                });
            }

            // Get tutor profile
            const tutorProfile = await Tutor.findOne({
                where: { UserId: req.user.id }
            });

            if (!tutorProfile) {
                throw { name: 'NotFound', message: 'Tutor profile not found' };
            }

            // Find booking and verify ownership through schedule
            const booking = await Booking.findByPk(req.params.id, {
                include: [{
                    model: Schedule,
                    where: { TutorId: tutorProfile.id }
                }]
            });

            if (!booking) {
                throw { name: 'NotFound', message: 'Booking not found' };
            }

            if (booking.bookingStatus !== 'Pending') {
                throw { name: 'BadRequest', message: 'Can only update pending bookings' };
            }

            // Update booking status and payment status if rejected
            const updates = {
                bookingStatus: status
            };

            // If booking is rejected, also cancel the payment
            if (status === 'Rejected') {
                updates.paymentStatus = 'cancelled';
            }

            const updatedBooking = await booking.update(updates);

            res.json({
                message: 'Booking status updated successfully',
                data: updatedBooking
            });
        } catch (err) {
            next(err);
        }
    } static async deleteBooking(req, res, next) {
        try {
            // Only students can delete their bookings
            if (req.user.role !== 'Student') {
                return res.status(403).json({
                    message: 'Only students can delete bookings'
                });
            }

            // Find booking and verify ownership
            const booking = await Booking.findOne({
                where: {
                    id: req.params.id,
                    studentId: req.user.id
                }
            });

            if (!booking) {
                return res.status(404).json({
                    message: 'Booking not found'
                });
            }

            if (booking.bookingStatus !== 'Pending') {
                return res.status(400).json({
                    message: 'Can only delete pending bookings'
                });
            }

            await booking.destroy();

            return res.status(200).json({
                message: 'Booking deleted successfully'
            });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = BookingController;

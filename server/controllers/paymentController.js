const snap = require('../config/midtrans');
const { Booking, Schedule, User, Tutor } = require('../models');

class PaymentController {
    static async createPayment(req, res, next) {
        try {
            const booking = await Booking.findByPk(req.params.bookingId, {
                include: [
                    {
                        model: Schedule,
                        include: [{
                            model: Tutor,
                            include: [{
                                model: User
                            }]
                        }]
                    },
                    {
                        model: User,
                        as: 'Student'
                    }
                ]
            });

            if (!booking) throw { name: 'NotFound' };

            const parameter = {
                transaction_details: {
                    order_id: `BOOKING-${booking.id}-${Date.now()}`,
                    gross_amount: booking.Schedule.fee
                },
                customer_details: {
                    first_name: booking.Student.fullName,
                    email: booking.Student.email
                },
                item_details: [{
                    id: booking.Schedule.id,
                    price: booking.Schedule.fee,
                    quantity: 1,
                    name: `Tutoring Session with ${booking.Schedule.Tutor.User.fullName}`
                }]
            };

            const token = await snap.createTransaction(parameter);

            // Update booking dengan token
            await booking.update({
                paymentToken: token.token,
                paymentUrl: token.redirect_url
            });

            res.json({
                paymentToken: token.token,
                paymentUrl: token.redirect_url
            });
        } catch (err) {
            console.log(err, '<<< error in createPayment');

            next(err);
        }
    }

    static async handleNotification(req, res, next) {
        try {
            const notification = await snap.transaction.notification(req.body);
            const orderId = notification.order_id;
            const bookingId = orderId.split('-')[1];

            let paymentStatus;
            if (notification.transaction_status === 'capture' ||
                notification.transaction_status === 'settlement') {
                paymentStatus = 'paid';
            } else if (notification.transaction_status === 'deny' ||
                notification.transaction_status === 'cancel' ||
                notification.transaction_status === 'expire') {
                paymentStatus = 'failed';
            } else {
                paymentStatus = 'Pending';
            }

            await Booking.update(
                { paymentStatus },
                { where: { id: bookingId } }
            );

            res.json({ message: 'OK' });
        } catch (err) {
            console.log(err, '<<< error in handleNotification');

            next(err);
        }
    }
}

module.exports = PaymentController;
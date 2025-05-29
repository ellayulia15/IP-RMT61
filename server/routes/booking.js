const express = require('express');
const router = express.Router();
const BookingController = require('../controllers/bookingController');
const authentication = require('../middlewares/authentication');

// Protected routes - all require authentication
router.get('/bookings', authentication, BookingController.getAllBookings);
router.post('/bookings', authentication, BookingController.createBooking);
router.patch('/bookings/:id/status', authentication, BookingController.updateBookingStatus);
router.delete('/bookings/:id', authentication, BookingController.deleteBooking);

module.exports = router;

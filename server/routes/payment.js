const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/paymentController');
const authentication = require('../middlewares/authentication');

// Specific routes should come before dynamic routes
router.post('/payments/notification', PaymentController.handleNotification);
router.post('/payments/:bookingId', authentication, PaymentController.createPayment);

module.exports = router;
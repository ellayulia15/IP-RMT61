const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/paymentController');
const authentication = require('../middlewares/authentication');

router.post('/payments/:bookingId', authentication, PaymentController.createPayment);
router.post('/payments/notification', PaymentController.handleNotification);

module.exports = router;
const express = require('express');
const router = express.Router();
const TutorController = require('../controllers/tutorController');
const authentication = require('../middlewares/authentication');

// Protected routes - require authentication
router.post('/tutors', authentication, TutorController.createTutorProfile);
router.put('/tutors', authentication, TutorController.updateTutorProfile);

module.exports = router;

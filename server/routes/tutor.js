const express = require('express');
const router = express.Router();
const TutorController = require('../controllers/tutorController');
const authentication = require('../middlewares/authentication');

// Public routes
router.get('/pub/tutors', TutorController.getAllTutors);
router.get('/pub/tutors/:id', TutorController.getTutorById);

// Protected routes - require authentication
router.post('/tutors', authentication, TutorController.createTutorProfile);
router.put('/tutors', authentication, TutorController.updateTutorProfile);
router.get('/tutors', authentication, TutorController.getMyProfile);

module.exports = router;

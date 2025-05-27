const express = require('express');
const router = express.Router();
const TutorController = require('../controllers/tutorController');
const authentication = require('../middlewares/authentication');

// Public routes
router.get('/tutors', TutorController.getAllTutors);
router.get('/tutors/:id', TutorController.getTutorById);

// Protected routes - require authentication
router.post('/tutors', authentication, TutorController.createTutorProfile);
router.put('/tutors', authentication, TutorController.updateTutorProfile);

module.exports = router;

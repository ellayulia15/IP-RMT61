const express = require('express');
const router = express.Router();
const userRoutes = require('./user');
const tutorRoutes = require('./tutor');

router.use('/', userRoutes);
router.use('/', tutorRoutes);

module.exports = router;

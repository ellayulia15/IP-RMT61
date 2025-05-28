const express = require('express');
const router = express.Router();
const AIController = require('../controllers/aiController');

router.post('/ai/chat', AIController.chatRecommendation);

module.exports = router;
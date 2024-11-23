const express = require('express');
const router = express.Router();
const liveController = require('../controllers/liveController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/title', authMiddleware, liveController.setStreamTitle);

router.get('/user/:userId', liveController.getLive);

router.get('/check-active', authMiddleware, liveController.checkActiveStream);

router.get('/active', liveController.getAllActiveLives);

router.get('/', liveController.getAllLives);


module.exports = router;

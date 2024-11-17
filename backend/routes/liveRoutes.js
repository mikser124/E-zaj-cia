const express = require('express');
const router = express.Router();
const liveController = require('../controllers/liveController');
const authMiddleware = require('../middleware/authMiddleware');

// Endpoint do ustawiania tytułu transmisji
router.post('/title', authMiddleware, liveController.setStreamTitle);

// Endpoint do pobierania szczegółów transmisji
router.get('/user/:userId', liveController.getLive);

router.get('/check-active', authMiddleware, liveController.checkActiveStream);
// Endpoint do pobierania listy transmisji
router.get('/', liveController.getAllLives);

// Endpoint do usuwania transmisji
router.delete('/:id', authMiddleware, liveController.deleteLive);

module.exports = router;

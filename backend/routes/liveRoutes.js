const express = require('express');
const router = express.Router();
const liveController = require('../controllers/liveController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/',  authMiddleware, liveController.createLive);

router.get('/:id', liveController.getLive);

router.get('/', liveController.getAllLives);

router.delete('/:id', authMiddleware, liveController.deleteLive);

module.exports = router;

// routes/recordRoutes.js
const express = require('express');
const router = express.Router();
const recordController = require('../controllers/recordController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/:id', authMiddleware, recordController.getRecordingById);


router.delete('/:id', authMiddleware, recordController.deleteRecording);


module.exports = router;

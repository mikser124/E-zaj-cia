const express = require('express');
const router = express.Router();
const { sendMessage, getMessages, markAsRead, deleteMessage } = require('../controllers/messageController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/send', authMiddleware, sendMessage);

router.get('/:userId', authMiddleware, getMessages);

router.patch('/:messageId/read', authMiddleware, markAsRead);

router.delete('/:messageId', authMiddleware, deleteMessage);

module.exports = router;

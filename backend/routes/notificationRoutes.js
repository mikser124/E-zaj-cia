const express = require('express');
const { getNotifications, markNotificationsAsRead, deleteNotification } = require('../controllers/notificationController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getNotifications);

router.post('/mark-as-read', authMiddleware, markNotificationsAsRead);

router.delete('/:notificationId', authMiddleware, deleteNotification);

module.exports = router;

const { Notification } = require('../models');
const { Message } = require('../models');

exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.id; 
    const notifications = await Notification.findAll({
      where: { user_id: userId, read: false },
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json(notifications);
  } catch (error) {
    console.error('Błąd podczas pobierania powiadomień:', error);
    res.status(500).send('Błąd serwera');
  }
};

exports.markNotificationsAsRead = async (req, res) => {
  try {
    const { notificationIds } = req.body;

    if (!notificationIds || !Array.isArray(notificationIds)) {
      return res.status(400).send('Nieprawidłowe dane wejściowe.');
    }

    await Notification.update(
      { read: true },
      { where: { id: notificationIds } }
    );

    res.status(200).send('Powiadomienia oznaczone jako przeczytane.');
  } catch (error) {
    console.error('Błąd podczas oznaczania powiadomień:', error);
    res.status(500).send('Błąd serwera');
  }
};


exports.deleteNotification = async (req, res) => {
    try {
      const { notificationId } = req.params;
      const userId = req.user.id; 
  
      const notification = await Notification.findOne({
        where: { id: notificationId, user_id: userId },
        include: [
          {
            model: Message,
            as: 'message', 
          },
        ],
      });
  
      if (!notification) {
        return res.status(404).send('Powiadomienie nie znaleziono');
      }
  
      await notification.destroy();
  
      const senderId = notification.message.from_id;
      return res.status(200).json({ message: 'Powiadomienie usunięte', senderId: senderId});
  
    } catch (error) {
      console.error('Błąd przy usuwaniu powiadomienia:', error);
      res.status(500).send('Błąd serwera');
    }
  };
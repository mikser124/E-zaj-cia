const { Op } = require('sequelize');
const { Message } = require('../models');
const { User } = require('../models');

const sendMessage = async (req, res) => {
  const { to_id, content } = req.body;
  const from_id = req.user.id; 

  try {
    const message = await Message.create({
      from_id,
      to_id,
      content,
    });
    
    const sender = await User.findByPk( from_id, {
      attributes: ['id', 'imie', 'nazwisko']
    })

    res.status(201).json({ message: 'Wiadomość wysłana', data: {message, sender} });
  } catch (error) {
    console.error('Błąd przy wysyłaniu wiadomości:', error);
    res.status(500).json({ error: 'Nie udało się wysłać wiadomości' });
  }
};

const getMessages = async (req, res) => {
  const { userId } = req.params;  

  try {
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { from_id: userId, to_id: req.user.id },
          { from_id: req.user.id, to_id: userId },
        ],
      },
      include: [
        { model: User, as: 'sender', attributes: ['imie', 'nazwisko', 'photo'] },
        { model: User, as: 'receiver', attributes: ['imie', 'nazwisko', 'photo'] },
      ],
      order: [['createdAt', 'ASC']],
    });

    res.status(200).json({ messages });
  } catch (error) {
    console.error('Błąd przy pobieraniu wiadomości:', error);
    res.status(500).json({ error: 'Nie udało się pobrać wiadomości' });
  }
};

const markAsRead = async (req, res) => {
  const { messageId } = req.params;

  try {
    const message = await Message.findByPk(messageId);

    if (!message) {
      return res.status(404).json({ error: 'Wiadomość nie została znaleziona' });
    }

    if (message.to_id !== req.user.id) {
      return res.status(403).json({ error: 'Brak uprawnień do oznaczenia tej wiadomości jako przeczytanej' });
    }

    message.read = true;
    await message.save();

    res.status(200).json({ message: 'Wiadomość oznaczona jako przeczytana' });
  } catch (error) {
    console.error('Błąd przy oznaczaniu wiadomości jako przeczytanej:', error);
    res.status(500).json({ error: 'Nie udało się oznaczyć wiadomości' });
  }
};

const deleteMessage = async (req, res) => {
  const { messageId } = req.params;

  try {
    const message = await Message.findByPk(messageId);

    if (!message) {
      return res.status(404).json({ error: 'Wiadomość nie została znaleziona' });
    }

    if (message.from_id !== req.user.id && message.to_id !== req.user.id) {
      return res.status(403).json({ error: 'Brak uprawnień do usunięcia tej wiadomości' });
    }

    await message.destroy();

    res.status(200).json({ message: 'Wiadomość usunięta' });
  } catch (error) {
    console.error('Błąd przy usuwaniu wiadomości:', error);
    res.status(500).json({ error: 'Nie udało się usunąć wiadomości' });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  markAsRead,
  deleteMessage,
};

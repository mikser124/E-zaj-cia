const { Op } = require('sequelize');
const { Message } = require('../models');
const { User } = require('../models');

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
        { model: User, as: 'sender', attributes: ['imie', 'nazwisko'] },
        { model: User, as: 'receiver', attributes: ['imie', 'nazwisko'] },
      ],
      order: [['createdAt', 'ASC']],
    });

    res.status(200).json({ messages });
  } catch (error) {
    console.error('Błąd przy pobieraniu wiadomości:', error);
    res.status(500).json({ error: 'Nie udało się pobrać wiadomości' });
  }
};

module.exports = {
  getMessages, 
};

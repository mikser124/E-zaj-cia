const { Message } = require('../models');
const { User } = require('../models');

const socketPrivateMessages = (io) => {
    const connectedUsers = {};
  
    io.on('connection', (socket) => {
      socket.on('register', (userId) => {
        connectedUsers[userId] = socket.id;
      });
  
      socket.on('send_private_message', async (data) => {
        const { from_id, to_id, content } = data;
      
        try {
          // Zapisz wiadomość w bazie danych
          const message = await Message.create({ from_id, to_id, content });
      
          // Pobierz pełne dane wiadomości, w tym informacje o nadawcy
          const fullMessage = await Message.findByPk(message.id, {
            include: [{ model: User, as: 'sender', attributes: ['id', 'imie'] }],
          });
      
          // Powiadom odbiorcę
          const recipientSocketId = connectedUsers[to_id];
          if (recipientSocketId) {
            io.to(recipientSocketId).emit('receive_private_message', { message: fullMessage });
          }
      
          // Powiadom nadawcę o sukcesie
          io.to(connectedUsers[from_id]).emit('message_sent', { message: fullMessage });
      
        } catch (error) {
          console.error('Błąd przy wysyłaniu wiadomości:', error);
        }
      });
      
      
  
      socket.on('disconnect', () => {
        for (let userId in connectedUsers) {
          if (connectedUsers[userId] === socket.id) {
            delete connectedUsers[userId];
            break;
          }
        }
      });
    });
  };
  
  module.exports = socketPrivateMessages;
  

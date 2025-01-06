const { Message } = require('../models');
const { User } = require('../models');
const { Notification } = require('../models');

const socketPrivateMessages = (io) => {
  const connectedUsers = {};
  const activeTabs = {}; 

  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);
    socket.on('register', (userId) => {
        connectedUsers[userId] = socket.id;
    });
    socket.on('chat_opened', ({ from_id, chatWith }) => {
      if (!activeTabs[from_id]) {
        activeTabs[from_id] = [];
      }
      if (!activeTabs[from_id].includes(chatWith)) {
        activeTabs[from_id].push(chatWith);
      }
      Message.findAll({
        where: { from_id: chatWith, to_id: from_id, read: false },
      })
        .then(async (messages) => {
          for (let message of messages) {
            const notification = await Notification.findOne({
              where: { message_id: message.id, user_id: from_id },
            });
            if (notification && !notification.read) {
              notification.read = true;
              await notification.save();
            }
          }
        });
      Message.update({ read: true }, {
        where: { from_id: chatWith, to_id: from_id, read: false },
      })
        .then(() => {
          if (connectedUsers[chatWith]) {
            io.to(connectedUsers[chatWith]).emit('all_messages_read', { chatWith: from_id });
          }
        })
        .catch((error) => {
          console.error('Błąd przy oznaczaniu wiadomości jako przeczytane:', error);
        });
    });
    socket.on('chat_closed', ({ from_id, chatWith }) => {
      if (activeTabs[from_id]) {
        activeTabs[from_id] = activeTabs[from_id].filter(id => id !== chatWith);
        if (activeTabs[from_id].length === 0) {
          delete activeTabs[from_id];
        }
      }
      console.log(`Użytkownik ${from_id} zamknął kartę czatu z ${chatWith}`);
    });

    socket.on('send_private_message', async (data) => {
      const { from_id, to_id, content } = data;
      try {
        const message = await Message.create({ from_id, to_id, content });
        const fullMessage = await Message.findByPk(message.id, {
          include: [
            { model: User, as: 'sender', attributes: ['id', 'imie'] },
            { model: User, as: 'receiver', attributes: ['id', 'imie'] },
          ],
        });

        if (!fullMessage.read) {
          await Notification.create({
            user_id: to_id,
            message_id: message.id,
            content: `Masz nową wiadomość od ${fullMessage.sender.imie}`,
            read: false,
          });
          console.log(`Powiadomienie utworzone dla użytkownika ${to_id}`);
        }
        const recipientSocketId = connectedUsers[to_id];
        if (recipientSocketId) {
          io.to(recipientSocketId).emit('receive_private_message', { message: fullMessage });
        }
        const senderSocketId = connectedUsers[from_id];
        if (senderSocketId) {
          io.to(senderSocketId).emit('message_sent', { message: fullMessage });
        }
      } catch (error) {
        console.error('Błąd przy wysyłaniu wiadomości:', error);
      }
    });
    

    socket.on('message_read', async (data) => {
      const { messageId, readerId } = data;
      try {
        const message = await Message.findByPk(messageId);
    
        if (!message) {
          console.error(`Wiadomość o ID ${messageId} nie istnieje`);
          return;
        }
        if (message.to_id !== readerId) {
          console.error(`Użytkownik ${readerId} nie jest odbiorcą wiadomości ${messageId}`);
          return;
        }
        message.read = true;
        await message.save();
        const notification = await Notification.findOne({
          where: { user_id: readerId, message_id: messageId }
        });
        if (notification) {
          notification.read = true;
          await notification.save();
        }
        const senderSocketId = connectedUsers[message.from_id];
        if (senderSocketId) {
          io.to(senderSocketId).emit('message_read', { message });
        }
      } catch (error) {
        console.error('Błąd przy oznaczaniu wiadomości jako przeczytanej:', error);
      }
    });
    
    socket.on('disconnect', () => {
      for (let userId in connectedUsers) {
        if (connectedUsers[userId] === socket.id) {
          delete connectedUsers[userId];

          delete activeTabs[userId];
          console.log(`Użytkownik ${userId} rozłączony`);
          break;
        }
      }
    });
  });
};

module.exports = socketPrivateMessages;

const { Message } = require('../models');
const { User } = require('../models');

const socketPrivateMessages = (io) => {
  const connectedUsers = {};
  const activeTabs = {}; 

  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    socket.on('register', (userId) => {
      connectedUsers[userId] = socket.id;
      console.log(`Użytkownik ${userId} połączony z socketem ${socket.id}`);
    });

    socket.on('chat_opened', ({ from_id, chatWith }) => {
      if (!activeTabs[from_id]) {
        activeTabs[from_id] = [];
      }
      if (!activeTabs[from_id].includes(chatWith)) {
        activeTabs[from_id].push(chatWith);
      }

      console.log(`Użytkownik ${from_id} otworzył kartę czatu z ${chatWith}`);

      Message.update({ read: true }, {
        where: {
          from_id: chatWith,
          to_id: from_id,
          read: false,
        },
      })
        .then(() => {
          console.log(`Wiadomości od ${chatWith} do ${from_id} oznaczone jako przeczytane`);
          if (connectedUsers[chatWith]) {
            io.to(connectedUsers[chatWith]).emit('all_messages_read', { chatWith: from_id });
            console.log("ZDARZENIE ALL_MESSAGES_READ EMITOWANE DO NADAWCY", chatWith);
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
    
        const recipientSocketId = connectedUsers[to_id];
        if (recipientSocketId) {
          io.to(recipientSocketId).emit('receive_private_message', { message: fullMessage });
          console.log("EMITOWANIE RECEIVE DO ODBIORCY");
        }

        const senderSocketId = connectedUsers[from_id];
        if (senderSocketId) {
          io.to(senderSocketId).emit('message_sent', { message: fullMessage });
          console.log("EMITOWANIE MESSAGE SENT DO NADAWCY");
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
    
        console.log(`Wiadomość ${messageId} została oznaczona jako przeczytana`);
    
        const senderSocketId = connectedUsers[message.from_id];
        if (senderSocketId) {
          io.to(senderSocketId).emit('message_read', { message });
          console.log("EMITOWANIE READ DO NADAWCY");
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

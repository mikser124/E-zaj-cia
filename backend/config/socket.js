const socketIo = require('socket.io');
const { nms } = require('../media_server');

module.exports = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: "http://localhost:3001",
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true,
    },
  });

  let activeUsers = new Map(); // Mapowanie socket.id na userId

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Obsługa userId
    socket.on('userConnected', (userId) => {
      if (![...activeUsers.values()].includes(userId)) {
        activeUsers.set(socket.id, userId); // Przypisujemy socket.id do userId
      }

      // Wyślij bieżącą liczbę uczestników tylko do nowego użytkownika
      socket.emit('updateUserCount', activeUsers.size);

      // Emituj do wszystkich, jeśli to nowe połączenie zwiększa liczbę
      io.emit('updateUserCount', activeUsers.size);
    });

    // Obsługa wiadomości
    socket.on('sendMessage', (message) => {
      io.emit('chatMessage', message);
    });

    // Obsługa rozłączenia użytkownika
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);

      if (activeUsers.has(socket.id)) {
        activeUsers.delete(socket.id); // Usuń użytkownika z aktywnych
        io.emit('updateUserCount', activeUsers.size); // Wyślij nową liczbę uczestników
      }
    });
  });

  return io;
};

const socketIo = require('socket.io');

module.exports = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: "http://localhost:3001",
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true,
    },
  });

  const activeUsers = new Map(); // Przechowywanie aktywnych użytkowników

  // Ogólne zdarzenia WebSocket
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Zdarzenie dla nowego użytkownika
    socket.on('userConnected', (userId) => {
      if (![...activeUsers.values()].includes(userId)) {
        activeUsers.set(socket.id, userId);
      }

      // Aktualizacja liczby użytkowników
      const userCount = activeUsers.size;
      socket.emit('updateUserCount', userCount);
      io.emit('updateUserCount', userCount);
    });

    // Ogólne wiadomości na czacie
    socket.on('sendMessage', (message) => {
      io.emit('chatMessage', message); // Emituj wiadomość do wszystkich
    });

    // Obsługa rozłączenia użytkownika
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);

      if (activeUsers.has(socket.id)) {
        activeUsers.delete(socket.id); // Usuń użytkownika z aktywnych
        io.emit('updateUserCount', activeUsers.size); // Aktualizuj liczbę użytkowników
      }
    });
  });

  return io;
};

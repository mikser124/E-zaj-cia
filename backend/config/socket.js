const socketIo = require('socket.io');

module.exports = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: "http://localhost:3001",
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true
    }
  });

  // Zmienna przechowująca ID aktywnych użytkowników
  let activeUsers = new Set();  // Set, który będzie przechowywał unikalne identyfikatory użytkowników

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Sprawdzamy, czy użytkownik już istnieje
    if (!activeUsers.has(socket.id)) {
      activeUsers.add(socket.id);  // Dodajemy nowe połączenie
      io.emit('updateUserCount', activeUsers.size);  // Przekazujemy liczbę aktywnych użytkowników
    }

    socket.on('sendMessage', (message) => {
      io.emit('chatMessage', message);  // Rozsyłamy wiadomości do wszystkich
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);

      if (activeUsers.has(socket.id)) {
        activeUsers.delete(socket.id);  // Usuwamy użytkownika z aktywnych połączeń
        io.emit('updateUserCount', activeUsers.size);  // Przekazujemy liczbę aktywnych użytkowników
      }
    });
  });

  return io;
};

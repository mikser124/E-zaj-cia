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

  const activeUsers = new Map(); 

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('userConnected', (userId) => {
      if (![...activeUsers.values()].includes(userId)) {
        activeUsers.set(socket.id, userId);
      }

      const userCount = activeUsers.size;
      socket.emit('updateUserCount', userCount);
      io.emit('updateUserCount', userCount);
    });

    socket.on('sendMessage', (message) => {
      io.emit('chatMessage', message); 
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);

      if (activeUsers.has(socket.id)) {
        activeUsers.delete(socket.id); 
        io.emit('updateUserCount', activeUsers.size); 
      }
    });
  });

  return io;
};

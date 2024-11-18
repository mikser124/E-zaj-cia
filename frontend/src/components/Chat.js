import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import '../styles/Chat.css';

const Chat = ({ userId, userName, setParticipantCount }) => {  // Dodano setParticipantCount
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const chatBoxRef = useRef(null);

  useEffect(() => {
    const socketInstance = io('http://localhost:3000');
    setSocket(socketInstance);

    // Nasłuchiwanie wiadomości
    const handleNewMessage = (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    // Nasłuchiwanie zmiany liczby użytkowników
    const handleUserCountUpdate = (count) => {
      setParticipantCount(count);  // Zaktualizowanie liczby uczestników
    };

    socketInstance.on('chatMessage', handleNewMessage);
    socketInstance.on('updateUserCount', handleUserCountUpdate);

    return () => {
      socketInstance.off('chatMessage', handleNewMessage);
      socketInstance.off('updateUserCount', handleUserCountUpdate);
      socketInstance.disconnect();
    };
  }, [setParticipantCount]);

  // Obsługa wysyłania wiadomości
  const handleSendMessage = () => {
    if (newMessage.trim() && socket) {
      const message = {
        user: userName || 'Gość',
        text: newMessage,
        timestamp: new Date().toLocaleTimeString(),
      };

      socket.emit('sendMessage', message);
      setNewMessage('');
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-box" ref={chatBoxRef}>
        {messages.length === 0 && <p className="chat-empty">Brak wiadomości</p>}
        {messages.map((msg, index) => (
          <div key={index} className="chat-message">
            <strong>{msg.user}</strong> <span>{msg.timestamp}</span>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Napisz wiadomość..."
        />
        <button onClick={handleSendMessage}>Wyślij</button>
      </div>
    </div>
  );
};

export default Chat;

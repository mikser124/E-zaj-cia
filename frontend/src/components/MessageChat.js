import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useAuth } from '../AuthContext'; 
import io from 'socket.io-client';

const MessageChat = () => {
  const { userId } = useParams(); 
  const { token, user } = useAuth(); 
  const [messages, setMessages] = useState([]); 
  const [content, setContent] = useState('');
  const [socket, setSocket] = useState(null); 

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/messages/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setMessages(response.data.messages);
      } catch (error) {
        console.error('Błąd przy pobieraniu wiadomości:', error);
      }
    };

    fetchMessages(); 

    const newSocket = io('http://localhost:3000', {
      query: { token },
      transports: ['websocket'],
    });

    newSocket.on('connect', () => {
      console.log('Połączono z WebSocketem');
      newSocket.emit('register', user.id);
    });

    newSocket.on('receive_private_message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data.message]); 
    });

    setSocket(newSocket); 

    return () => {
      newSocket.disconnect(); 
    };
  }, [userId, token, user.id]);

  const handleSendMessage = async () => {
    if (!content.trim()) return;
  
    // Wyślij wiadomość przez WebSocket
    socket.emit('send_private_message', {
      from_id: user.id,
      to_id: userId,
      content,
    });
  
    // Dodaj wysłaną wiadomość do stanu
    setMessages((prevMessages) => [
      ...prevMessages,
      { id: Date.now(), from_id: user.id, content, sender: { imie: 'Ty' } },
    ]);
    setContent('');
  };
  
  return (
    <div>
      <h2>Rozmowa z użytkownikiem {userId}</h2>
      <div
        style={{
          maxHeight: '400px',
          overflowY: 'scroll',
          border: '1px solid #ccc',
          padding: '10px',
        }}
      >
        {messages.map((msg) => (
          <div key={msg.id} style={{ marginBottom: '10px' }}>
            <p>
              <strong>{msg.from_id === user.id ? 'Ty' : msg.sender?.imie || 'Nieznany użytkownik'}:</strong>{' '}
              {msg.content}
            </p>
          </div>
        ))}
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Wpisz wiadomość..."
        style={{ width: '100%', height: '80px', marginTop: '10px' }}
      />
      <button onClick={handleSendMessage} style={{ marginTop: '10px' }}>
        Wyślij
      </button>
    </div>
  );
};

export default MessageChat;

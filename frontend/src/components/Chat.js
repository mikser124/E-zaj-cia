import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import '../styles/Chat.css';
import { useAuth } from '../AuthContext'; 
import axios from 'axios';

const Chat = ({ userName, setParticipantCount, prowadzacyId }) => {
  const { user, token } = useAuth(); 
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [points, setPoints] = useState(1);
  const [userRole, setUserRole] = useState('');
  const chatBoxRef = useRef(null);

  useEffect(() => {
    if (!user) return;  

    const fetchUserRole = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/user/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`  
          }
        });
        setUserRole(response.data.rola); 
      } catch (error) {
        console.error("Błąd podczas pobierania roli:", error);
      }
    };

    fetchUserRole();
  }, [user, token]);


  useEffect(() => {
    if (!user) return; 

    const socketInstance = io('http://localhost:3000');
    setSocket(socketInstance);

    socketInstance.emit('userConnected', user.id);

    const handleNewMessage = (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    const handleUserCountUpdate = (count) => {
      setParticipantCount(count);
    };

    socketInstance.on('chatMessage', handleNewMessage);
    socketInstance.on('updateUserCount', handleUserCountUpdate);

    return () => {
      socketInstance.off('chatMessage', handleNewMessage);
      socketInstance.off('updateUserCount', handleUserCountUpdate);
      socketInstance.disconnect();
    };
  }, [user, setParticipantCount]); 

  const handleSendMessage = () => {
    if (newMessage.trim() && socket) {
      const message = {
        user: userName,
        userId: user.id,  
        text: newMessage,
        timestamp: new Date().toLocaleTimeString(),
        role: userRole,
      };

      socket.emit('sendMessage', message);
      setNewMessage('');
    }
  };

  const handleGivePoints = async () => {
    if (selectedUser.id === prowadzacyId) {
      alert("Nie możesz przyznać punktów samemu sobie!");
      return;
    }

    try {
      if (!selectedUser || !points) return;
      
      await axios.post(`http://localhost:3000/api/points/${prowadzacyId}`, {
        uzytkownik_id: selectedUser.id,
        prowadzacy_id: prowadzacyId,
        liczba_punktow: points,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`  
        }
      });
      
      alert(`Przyznano ${points} punktów użytkownikowi ${selectedUser.userName}`);
    } catch (error) {
      console.error(error);
      alert('Błąd podczas przyznawania punktów.');
    }
  };

  const handleUserClick = (studentId, userName) => {
    
    const user = messages.find(msg => msg.user === userName);
    if (user) {
      setSelectedUser({ userName, id: user.userId });  
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-box" ref={chatBoxRef}>
        {messages.length === 0 && <p className="chat-empty">Brak wiadomości</p>}
        {messages.map((msg, index) => (
          <div key={index} className="chat-message">
            <div className="message-content">
              <strong onClick={() => handleUserClick(msg.userId, msg.user)}>
                {msg.user}
              </strong> 
              <span>{msg.timestamp}</span>
              <span className="user-role">({msg.role})</span> 
              <p>{msg.text}</p>
            </div>
            <div className="message-options">
              <button className="three-dots-btn">...</button>
            </div>
          </div>
        ))}
      </div>

      {selectedUser && user.id === prowadzacyId && (
        <div className="points-give-container">
          <p>Wybrano użytkownika: {selectedUser.userName}</p>
          <label>
            Wybierz liczbę punktów:
            <input
              type="number"
              value={points}
              min="1"
              max="5"
              onChange={(e) => setPoints(e.target.value)}
            />
          </label>
          <button onClick={handleGivePoints}>Nadawaj Punkty</button>
        </div>
      )}

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

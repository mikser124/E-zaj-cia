import React, { useState, useEffect } from 'react';
import '../styles/Notification.css';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  const { token } = useAuth();
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
    setHasUnread(false);
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/notifications/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Pobrane dane: ', response.data);
        setNotifications(response.data);
        if(response.data.length > 0){
          setHasUnread(true);
        }
        else{
          setHasUnread(false);
        }
      } catch (error) {
        console.error('Błąd przy pobieraniu powiadomień:', error);
      }
    };
    fetchNotifications();

    const intervalId = setInterval(() => {
      fetchNotifications();
    }, 10000); 

    return () => clearInterval(intervalId);
  }, [token]);  

  const handleNotificationClick = async (notificationId) => {
    try {
      const response = await axios.delete(`http://localhost:3000/api/notifications/${notificationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log(response.data.message);

      navigate(`messages/${response.data.senderId}`);
    } catch (error) {
      console.error('Błąd przy usuwaniu powiadomienia:', error);
    }

    setShowDropdown(false);
  };

  return (
    <div className="navbar-notifications">
      <i
        className="navbar-notifications-icon fa-solid fa-bell"
        onClick={toggleDropdown}
        style={{ cursor: 'pointer' }}
      >
        {hasUnread && (
          <div className="notification-badge"></div>
        )}
      </i>

      {showDropdown && (
        <div className="notifications-dropdown">
          <h3>Powiadomienia</h3>
          {notifications.length > 0 ? (
            <ul>
              {notifications.map((notification) => (
                <li
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <p>{notification.content}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>Brak nowych powiadomień.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Notification;

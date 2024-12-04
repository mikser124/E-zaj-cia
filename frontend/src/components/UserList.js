import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../AuthContext'

const UserList = () => {
  const [users, setUsers] = useState([]); 
  const [searchTerm, setSearchTerm] = useState(''); 
  const navigate = useNavigate();
  const { token }= useAuth();

  useEffect(() => {
    axios.get('/user/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        setUsers(response.data.users);
      })
      .catch((error) => {
        console.error('Błąd przy pobieraniu użytkowników:', error);
      });
  }, [token]);

  const filteredUsers = users.filter((user) =>
    `${user.imie} ${user.nazwisko}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const goToChat = (userId) => {
    navigate(`/messages/${userId}`);
  };

  return (
    <div>
      <h2>Lista użytkowników</h2>
      <input
        type="text"
        placeholder="Szukaj użytkownika..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} 
      />
      <ul>
        {filteredUsers.map((user) => (
          <li key={user.id} onClick={() => goToChat(user.id)}>
            {user.imie} {user.nazwisko}
          </li>
        ))}
      </ul>
      {filteredUsers.length === 0 && <p>Nie znaleziono użytkowników.</p>}
    </div>
  );
};

export default UserList;

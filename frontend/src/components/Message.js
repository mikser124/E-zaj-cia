import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Message.css';  // Importujemy plik CSS

const UserList = () => {
  const [users, setUsers] = useState([]);  // Przechowujemy listę użytkowników
  const [loading, setLoading] = useState(true);  // Stan ładowania

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:3000/user/users');  // Pobieramy wszystkich użytkowników
        setUsers(response.data.users);  // Zaktualizuj listę użytkowników
      } catch (error) {
        console.error('Błąd przy pobieraniu użytkowników:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();  // Wywołanie funkcji po załadowaniu komponentu
  }, []);  // Pusta tablica oznacza, że efekt wykona się tylko raz, przy załadowaniu komponentu

  return (
    <div className="message-page-search-container">
      {loading ? (
        <p>Ładowanie użytkowników...</p>
      ) : (
        <div className="search-results">
          {users.length === 0 ? (
            <p>Brak użytkowników do wyświetlenia.</p>
          ) : (
            users.map((user) => (
              <div key={user.id} className="search-result-item">
                {user.imie} {user.nazwisko}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default UserList;

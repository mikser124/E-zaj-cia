import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

function Home() {
  const { isAuthenticated, logout, user } = useAuth();
  const handleLogout = () => {
    logout();
    alert('Wylogowano!');
  };

  return (
<div>
      <h1>Witamy na stronie głównej</h1>
      {isAuthenticated ? (
        <div>
          <h2>Witaj, {user.imie}!</h2>
          <button onClick={handleLogout}>Wyloguj się</button>
        </div>
      ) : (
        <div>
          <Link to="/register">Zarejestruj się</Link>
          <br />
          <Link to="/login">Zaloguj się</Link>
        </div>
      )}
    </div>
  );
}

export default Home;

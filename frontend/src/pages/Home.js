import React from 'react';
//import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import '../styles/Home.css'


function Home() {
  const { isAuthenticated, user } = useAuth();
  console.log(user);
  return (
    <div className="home-container">
      <h1>Witamy na stronie głównej</h1>
      {isAuthenticated ? (
        <div>
          <h2>Witaj, {user.imie}!</h2>
          {user.typ_uzytkownika === 'student' && (
            <p>Jesteś zalogowany jako student. Możesz przeglądać dostępne zajęcia.</p>
          )}
          {user.typ_uzytkownika === 'prowadzacy' && (
            <p>Jesteś zalogowany jako prowadzący. Możesz zarządzać swoimi zajęciami.</p>
          )}
          {user.typ_uzytkownika === 'administrator' && (
            <p>Jesteś zalogowany jako administrator. Możesz zarządzać użytkownikami i zawartością platformy.</p>
          )}
        </div>
      ) : (
        <p>Witamy! Zaloguj się lub zarejestruj, aby uzyskać pełny dostęp do platformy.</p>
      )}
    </div>
  );
}

export default Home;
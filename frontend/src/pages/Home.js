import React from 'react';
import { useAuth } from '../AuthContext';
import '../styles/Home.css'
import RecordList from '../components/RecordList';

function Home() {
  const { isAuthenticated, user } = useAuth();
  console.log(user);
  return (
    <div className="home-container">
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
        <RecordList />  
    </div>
  );
}

export default Home;
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import '../styles/Navbar.css';

function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate(); 

  const handleLogout = () => {
    logout();
    navigate('/'); 
  };
  
  return (
    <nav className="navbar">
      <div className="navbar-logo">E-zajęcia</div>
      <div className="navbar-links">
        {isAuthenticated ? (
          <>
            <Link to="/messages">
              <i className="navbar-message-icon fa-solid fa-message"></i>
            </Link>
            <Link to="/" className="navbar-link">Strona główna</Link>

            <Link to={`/profile/${user ? user.id : ''}`} className="navbar-link">Mój profil</Link> 
            
            <span onClick={handleLogout} className="navbar-link">Wyloguj się</span>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-link">Zaloguj się</Link>
            <Link to="/register" className="navbar-link">Zarejestruj się</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import '../styles/Navbar.css';

function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  
  return (
    <nav className="navbar">
      <div className="navbar-logo">E-zajęcia</div>
      <div className="navbar-links">
        {isAuthenticated ? (
          <>
            <span onClick={logout} className="navbar-link">Wyloguj się</span>
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

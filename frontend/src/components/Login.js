import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import '../styles/Auth.css';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    haslo: ''
  });

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    if (response.ok) {
      alert('Logowanie udane!');
      login({ id: data.id, imie: data.imie, typ_uzytkownika: data.typ_uzytkownika }, data.token);
      navigate('/'); 
    } else {
      alert('Błąd: ' + data.message);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2 className="form-title">Logowanie</h2>
        <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input name="haslo" type="password" placeholder="Hasło" value={formData.haslo} onChange={handleChange} required />
        
        <div className="form-footer">
          <Link to="/register" className="link">Nie masz jeszcze konta?</Link>
          <button type="submit">Zaloguj się</button>
        </div>
      </form>
    </div>
  );
}

export default Login;

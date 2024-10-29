import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

function Register() {
  const [formData, setFormData] = useState({
    imie: '',
    nazwisko: '',
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

    const emailRegex = /^[a-zA-Z0-9._%+-]+@(pollub\.edu\.pl|pollub\.pl)$/;
    if (!emailRegex.test(formData.email)) {
      alert('Adres e-mail musi mieć domenę pollub.edu.pl lub pollub.pl');
      return;
    }
    
    const response = await fetch('http://localhost:3000/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    console.log('Response from server:', data);
    if (response.ok) {
      alert('Rejestracja udana!');
      login();
      navigate('/login');
    } else {
      alert('Błąd: ' + data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="imie" placeholder="Imię" value={formData.imie} onChange={handleChange} />
      <input name="nazwisko" placeholder="Nazwisko" value={formData.nazwisko} onChange={handleChange} />
      <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} />
      <input name="haslo" type="password" placeholder="Hasło" value={formData.haslo} onChange={handleChange} />
      <button type="submit">Zarejestruj się</button>
    </form>
  );
}

export default Register;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

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
      login({ imie: data.imie });
      navigate('/');
    } else {
      alert('Błąd: ' + data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} />
      <input name="haslo" type="password" placeholder="Hasło" value={formData.haslo} onChange={handleChange} />
      <button type="submit">Zaloguj się</button>
    </form>
  );
}

export default Login;

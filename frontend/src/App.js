//import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Home from './pages/Home';
import { AuthProvider } from './AuthContext';
import Navbar from './components/Navbar';
import Profile from './components/Profile/Profile.js';

function App() {
  return (
    <AuthProvider>
      <Router>
      <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile/:id" element={<Profile />} />
          </Routes>
      </Router>
    </AuthProvider>
  );
}


export default App;

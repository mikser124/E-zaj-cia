import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Home from './pages/Home';
import { AuthProvider } from './AuthContext';
import Navbar from './components/Navbar';
import ProfilePage from './pages/ProfilePage';
import Record from './components/Record'; 
import StartLive from './components/StartLive'; 
import LivePage from './pages/LivePage';
import AddRecordingPage from './pages/AddRecordingPage';

function App() {
  return (
    <AuthProvider>
      <Router>
      <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
            <Route path="/record/:id" element={<Record />} />
            <Route path="/start-live" element={<StartLive />} />
            <Route path="/live/:userId" element={<LivePage />} />
            <Route path="/add-recording/:userId" element={<AddRecordingPage/>} />
          </Routes>
      </Router>
    </AuthProvider>
  );
}


export default App;

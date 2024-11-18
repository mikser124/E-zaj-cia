import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser)); 
      setToken(storedToken);  
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {  
    setIsAuthenticated(true);
    setUser(userData);
    setToken(token);  
    localStorage.setItem('user', JSON.stringify(userData)); 
    localStorage.setItem('token', token); 
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);  
    localStorage.removeItem('user'); 
    localStorage.removeItem('token'); 
  };

  if (loading) {
    return <div>Ładowanie...</div>; 
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

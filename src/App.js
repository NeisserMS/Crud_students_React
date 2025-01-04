import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import Auth from './components/auth';
import Students from './components/students';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  const handleLogin = (response) => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} />;
  }

  return <Students onLogout={handleLogout} />;
};

export default App;
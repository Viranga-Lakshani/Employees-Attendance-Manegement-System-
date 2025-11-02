// frontend/src/App.js
// Minimal single-file app to demonstrate login, listing employees, punch in/out and viewing simple report.

import React, { useState, useEffect } from 'react';
import api from './api';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null);

  // keep token in localStorage so refresh keeps session
  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  if (!token || !user) {
    return <Login onLogin={(t,u) => { setToken(t); setUser(u); }} />;
  }

  return <Dashboard token={token} user={user} onLogout={() => { setToken(null); setUser(null); }} />;
}

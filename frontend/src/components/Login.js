// frontend/src/components/Login.js
// Simple login form. Calls /api/auth/login and passes token+user to parent via onLogin.

import React, { useState } from 'react';
import api from '../api';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      const data = await api.post('/auth/login', { username, password });
      onLogin(data.token, data.user);
    } catch (err) {
      setError(err.body?.error || 'Login failed');
    }
  }

  return (
    <div className="login-container">
      <h2>Attendance System — Login</h2>
      <form onSubmit={handleSubmit}>
        <label>Username<input value={username} onChange={e => setUsername(e.target.value)} /></label>
        <label>Password<input type="password" value={password} onChange={e => setPassword(e.target.value)} /></label>
        <button type="submit">Login</button>
      </form>
      {error && <div className="error">Error: {String(error)}</div>}
      <div className="note">Demo accounts: admin/adminpass, alice/alicepass, bob/bobpass</div>
    </div>
  );
}

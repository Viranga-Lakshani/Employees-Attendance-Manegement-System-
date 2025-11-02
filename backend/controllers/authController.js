// backend/src/controllers/authController.js
// Handles registration and login. Uses JWT for token issuance.

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Employee } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret';
const JWT_EXPIRES_IN = '8h';

// Register a new employee (demo: returns created user without password hash)
async function register(req, res) {
  try {
    const { username, fullName, password, role } = req.body;
    if (!username || !fullName || !password) {
      return res.status(400).json({ error: 'username, fullName and password are required' });
    }

    const existing = await Employee.findOne({ where: { username } });
    if (existing) {
      return res.status(409).json({ error: 'username already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const created = await Employee.create({ username, fullName, passwordHash, role: role || 'employee' });

    // Return basic info (no password)
    res.status(201).json({ id: created.id, username: created.username, fullName: created.fullName, role: created.role });
  } catch (err) {
    console.error('Register error', err);
    res.status(500).json({ error: 'internal_server_error' });
  }
}

// Login: verifies credentials and returns JWT token
async function login(req, res) {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'username and password required' });

    const user = await Employee.findOne({ where: { username } });
    if (!user) return res.status(401).json({ error: 'invalid credentials' });

    const valid = await user.verifyPassword(password);
    if (!valid) return res.status(401).json({ error: 'invalid credentials' });

    const payload = { id: user.id, username: user.username, role: user.role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.json({ token, user: { id: user.id, username: user.username, fullName: user.fullName, role: user.role } });
  } catch (err) {
    console.error('Login error', err);
    res.status(500).json({ error: 'internal_server_error' });
  }
}

module.exports = { register, login };

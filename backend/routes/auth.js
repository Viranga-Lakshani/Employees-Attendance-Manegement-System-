// backend/src/routes/auth.js
// Authentication routes: login and register (register used for initial admin/seeded users in demo).

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/register  (for demo use — can be disabled in production)
router.post('/register', authController.register);

// POST /api/auth/login
router.post('/login', authController.login);

module.exports = router;

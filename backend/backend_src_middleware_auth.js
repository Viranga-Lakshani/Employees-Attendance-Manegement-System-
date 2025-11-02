// backend/src/middleware/auth.js
// JWT authentication middleware to protect routes.

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret';

// Attaches req.user if token is valid, otherwise returns 401
function authenticateJwt(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) return res.status(401).json({ error: 'token_required' });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // contains id, username, role
    next();
  } catch (err) {
    return res.status(401).json({ error: 'invalid_token' });
  }
}

// Simple role guard: allow only if req.user.role is one of allowedRoles
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'authentication_required' });
    if (!allowedRoles.includes(req.user.role)) return res.status(403).json({ error: 'forbidden' });
    next();
  };
}

module.exports = { authenticateJwt, authorizeRoles };
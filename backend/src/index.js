// backend/src/index.js
// Entry point for the Express API. Configures middleware, routes, and starts the server.

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employee');
const attendanceRoutes = require('./routes/attendance');

const app = express();
const PORT = process.env.PORT || 4000;

// Basic middleware
app.use(cors()); // Allow local frontend access
app.use(express.json()); // Parse JSON payloads

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/attendance', attendanceRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server after ensuring DB is connected
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');
    // Make sure tables are created
    await sequelize.sync();
    app.listen(PORT, () => {
      console.log(`API server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Unable to start server:', err);
    process.exit(1);
  }
}

startServer();

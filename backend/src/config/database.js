// backend/src/config/database.js
// Sequelize configuration for SQLite (development). Swap dialect and config for production DBs.

const { Sequelize } = require('sequelize');
const path = require('path');

const storagePath = process.env.SQLITE_FILE || path.join(__dirname, '..', '..', 'data', 'attendance.sqlite');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: storagePath,
  logging: false // disable verbose SQL logging to keep output readable
});

module.exports = { sequelize };

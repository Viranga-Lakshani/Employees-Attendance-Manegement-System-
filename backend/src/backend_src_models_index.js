// backend/src/models/index.js
// Central model loader for Sequelize models.

const { sequelize } = require('../config/database');
const Employee = require('./employee');
const Attendance = require('./attendance');

// Initialize models with sequelize instance
const models = {
  Employee: Employee(sequelize),
  Attendance: Attendance(sequelize)
};

// Define associations
models.Employee.hasMany(models.Attendance, { foreignKey: 'employeeId', as: 'attendances' });
models.Attendance.belongsTo(models.Employee, { foreignKey: 'employeeId', as: 'employee' });

module.exports = { sequelize, ...models };
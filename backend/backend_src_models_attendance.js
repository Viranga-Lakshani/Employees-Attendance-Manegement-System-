// backend/src/models/attendance.js
// Attendance record model: records punch-in and punch-out times for employees.

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Attendance = sequelize.define('Attendance', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    employeeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'employee_id'
    },
    // when the employee punched in
    checkInAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'check_in_at'
    },
    // when the employee punched out (nullable until they check out)
    checkOutAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'check_out_at'
    },
    // optional note (e.g., reason for late)
    note: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'attendances',
    timestamps: true
  });

  return Attendance;
};
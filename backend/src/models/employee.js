// backend/src/models/employee.js
// Employee model. Represents an employee/user that can log attendance.

const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
  const Employee = sequelize.define('Employee', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    // username used for login
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    // human-friendly full name
    fullName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // hashed password
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'password_hash'
    },
    // optional role for future expansion (admin / employee)
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'employee'
    }
  }, {
    tableName: 'employees',
    timestamps: true
  });

  // instance method to check password
  Employee.prototype.verifyPassword = async function (plainPassword) {
    return bcrypt.compare(plainPassword, this.passwordHash);
  };

  return Employee;
};

// backend/src/controllers/employeeController.js
// Employee CRUD logic. For safety, password changes are handled separately here (simple demo).

const bcrypt = require('bcrypt');
const { Employee, Attendance } = require('../models');

// List employees - returns minimal fields
async function listEmployees(req, res) {
  try {
    const employees = await Employee.findAll({ attributes: ['id', 'username', 'fullName', 'role', 'createdAt'] });
    res.json(employees);
  } catch (err) {
    console.error('List employees error', err);
    res.status(500).json({ error: 'internal_server_error' });
  }
}

async function getEmployee(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const employee = await Employee.findByPk(id, {
      attributes: ['id', 'username', 'fullName', 'role', 'createdAt'],
      include: [{ model: Attendance, as: 'attendances' }]
    });
    if (!employee) return res.status(404).json({ error: 'not_found' });
    res.json(employee);
  } catch (err) {
    console.error('Get employee error', err);
    res.status(500).json({ error: 'internal_server_error' });
  }
}

// Create a new employee (admin only)
async function createEmployee(req, res) {
  try {
    const { username, fullName, password, role } = req.body;
    if (!username || !fullName || !password) return res.status(400).json({ error: 'username, fullName and password required' });

    const existing = await Employee.findOne({ where: { username } });
    if (existing) return res.status(409).json({ error: 'username_exists' });

    const passwordHash = await bcrypt.hash(password, 10);
    const created = await Employee.create({ username, fullName, passwordHash, role: role || 'employee' });
    res.status(201).json({ id: created.id, username: created.username, fullName: created.fullName, role: created.role });
  } catch (err) {
    console.error('Create employee error', err);
    res.status(500).json({ error: 'internal_server_error' });
  }
}

// Update employee (admin only) — allows changing full name and role. Password update omitted for clarity.
async function updateEmployee(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const { fullName, role } = req.body;
    const employee = await Employee.findByPk(id);
    if (!employee) return res.status(404).json({ error: 'not_found' });

    if (fullName) employee.fullName = fullName;
    if (role) employee.role = role;

    await employee.save();
    res.json({ id: employee.id, username: employee.username, fullName: employee.fullName, role: employee.role });
  } catch (err) {
    console.error('Update employee error', err);
    res.status(500).json({ error: 'internal_server_error' });
  }
}

// Delete employee (admin only)
async function deleteEmployee(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const employee = await Employee.findByPk(id);
    if (!employee) return res.status(404).json({ error: 'not_found' });

    await employee.destroy();
    res.status(204).send();
  } catch (err) {
    console.error('Delete employee error', err);
    res.status(500).json({ error: 'internal_server_error' });
  }
}

module.exports = { listEmployees, getEmployee, createEmployee, updateEmployee, deleteEmployee };

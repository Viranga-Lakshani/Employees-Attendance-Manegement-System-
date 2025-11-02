// backend/src/routes/employee.js
// Employee management endpoints: list, view, create, update, delete
// Admin-protected operations for create/update/delete in this demo.

const express = require('express');
const router = express.Router();
const { authenticateJwt, authorizeRoles } = require('../middleware/auth');
const employeeController = require('../controllers/employeeController');

// public: list employees (for demo)
router.get('/', authenticateJwt, employeeController.listEmployees);

// public: get a single employee by id
router.get('/:id', authenticateJwt, employeeController.getEmployee);

// admin-only: create employee
router.post('/', authenticateJwt, authorizeRoles('admin'), employeeController.createEmployee);

// admin-only: update employee
router.put('/:id', authenticateJwt, authorizeRoles('admin'), employeeController.updateEmployee);

// admin-only: delete employee
router.delete('/:id', authenticateJwt, authorizeRoles('admin'), employeeController.deleteEmployee);

module.exports = router;

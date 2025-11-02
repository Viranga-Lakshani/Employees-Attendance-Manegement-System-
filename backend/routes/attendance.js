// backend/src/routes/attendance.js
// Attendance endpoints: punch in, punch out, list records, and simple reporting.

const express = require('express');
const router = express.Router();
const { authenticateJwt } = require('../middleware/auth');
const attendanceController = require('../controllers/attendanceController');

// Employee punches in (authenticated)
router.post('/checkin', authenticateJwt, attendanceController.punchIn);

// Employee punches out (authenticated)
router.post('/checkout', authenticateJwt, attendanceController.punchOut);

// List my attendance records or all (admin)
router.get('/', authenticateJwt, attendanceController.listAttendances);

// Get attendance summary for date range (admin)
router.get('/report', authenticateJwt, attendanceController.report);

module.exports = router;

// backend/src/controllers/attendanceController.js
// Handles creating attendance records and generating simple reports.

const { Attendance, Employee } = require('../models');
const { Op } = require('sequelize');

// Punch in: creates a new attendance record for today with checkInAt.
// For simplicity, allows multiple check-ins per day but typically you'd allow only one active session.
async function punchIn(req, res) {
  try {
    const userId = req.user.id;
    const now = new Date();

    // Create attendance row with checkInAt = now
    const attendance = await Attendance.create({ employeeId: userId, checkInAt: now });
    res.status(201).json(attendance);
  } catch (err) {
    console.error('Punch in error', err);
    res.status(500).json({ error: 'internal_server_error' });
  }
}

// Punch out: finds the most recent attendance record for user without checkOutAt and sets checkOutAt.
async function punchOut(req, res) {
  try {
    const userId = req.user.id;
    const now = new Date();

    // Find latest attendance with null checkOutAt
    const record = await Attendance.findOne({
      where: { employeeId: userId, checkOutAt: null },
      order: [['checkInAt', 'DESC']]
    });

    if (!record) {
      return res.status(404).json({ error: 'no_active_session_found' });
    }

    record.checkOutAt = now;
    if (req.body.note) record.note = req.body.note;
    await record.save();

    res.json(record);
  } catch (err) {
    console.error('Punch out error', err);
    res.status(500).json({ error: 'internal_server_error' });
  }
}

// List attendance records. By default, returns current user's records. Admin can pass ?employeeId= to fetch another's.
async function listAttendances(req, res) {
  try {
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';
    const queryEmployeeId = req.query.employeeId ? parseInt(req.query.employeeId, 10) : null;

    const where = {};
    if (isAdmin && queryEmployeeId) {
      where.employeeId = queryEmployeeId;
    } else {
      where.employeeId = userId;
    }

    // Optional date filters
    if (req.query.from || req.query.to) {
      where.checkInAt = {};
      if (req.query.from) where.checkInAt[Op.gte] = new Date(req.query.from);
      if (req.query.to) where.checkInAt[Op.lte] = new Date(req.query.to);
    }

    const rows = await Attendance.findAll({
      where,
      include: [{ model: Employee, as: 'employee', attributes: ['id', 'username', 'fullName'] }],
      order: [['checkInAt', 'DESC']]
    });

    res.json(rows);
  } catch (err) {
    console.error('List attendance error', err);
    res.status(500).json({ error: 'internal_server_error' });
  }
}

// Simple report: for date range, returns total hours per employee (admin only).
async function report(req, res) {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'forbidden' });

    const from = req.query.from ? new Date(req.query.from) : null;
    const to = req.query.to ? new Date(req.query.to) : null;

    const where = {};
    if (from || to) {
      where.checkInAt = {};
      if (from) where.checkInAt[Op.gte] = from;
      if (to) where.checkInAt[Op.lte] = to;
    }

    // Fetch records with both checkInAt and checkOutAt set
    where.checkOutAt = { [Op.ne]: null };

    const rows = await Attendance.findAll({
      where,
      include: [{ model: Employee, as: 'employee', attributes: ['id', 'username', 'fullName'] }],
      order: [['employeeId', 'ASC'], ['checkInAt', 'ASC']]
    });

    // Aggregate by employee
    const summaryByEmployee = {};
    for (const r of rows) {
      const empId = r.employeeId;
      const durationMs = new Date(r.checkOutAt) - new Date(r.checkInAt);
      const durationHours = durationMs / (1000 * 60 * 60);

      if (!summaryByEmployee[empId]) {
        summaryByEmployee[empId] = {
          employee: r.employee,
          totalHours: 0,
          sessions: 0
        };
      }
      summaryByEmployee[empId].totalHours += durationHours;
      summaryByEmployee[empId].sessions += 1;
    }

    // Convert to list
    const reportList = Object.values(summaryByEmployee).map(item => ({
      employee: item.employee,
      totalHours: Number(item.totalHours.toFixed(2)),
      sessions: item.sessions
    }));

    res.json({ from: from ? from.toISOString() : null, to: to ? to.toISOString() : null, report: reportList });
  } catch (err) {
    console.error('Report error', err);
    res.status(500).json({ error: 'internal_server_error' });
  }
}

module.exports = { punchIn, punchOut, listAttendances, report };
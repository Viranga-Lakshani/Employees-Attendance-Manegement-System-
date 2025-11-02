// frontend/src/components/AttendancePanel.js
// Allows the logged in user to punch in and out and view recent sessions.

import React, { useState, useEffect } from 'react';
import api from '../api';

export default function AttendancePanel({ token, onMessage }) {
  const [records, setRecords] = useState([]);

  async function fetchMyRecords() {
    try {
      const rows = await api.get('/attendance', token);
      setRecords(rows);
    } catch (err) {
      onMessage('Failed to load attendance records');
    }
  }

  useEffect(() => {
    fetchMyRecords();
    // eslint-disable-next-line
  }, []);

  async function doCheckIn() {
    try {
      await api.post('/attendance/checkin', {}, token);
      onMessage('Checked in successfully');
      fetchMyRecords();
    } catch (err) {
      onMessage('Check-in failed');
    }
  }

  async function doCheckOut() {
    try {
      await api.post('/attendance/checkout', {}, token);
      onMessage('Checked out successfully');
      fetchMyRecords();
    } catch (err) {
      onMessage('Check-out failed');
    }
  }

  return (
    <div className="attendance-panel">
      <div className="actions">
        <button onClick={doCheckIn}>Punch In</button>
        <button onClick={doCheckOut}>Punch Out</button>
      </div>

      <h3>Recent Sessions</h3>
      <table className="attendance-table">
        <thead><tr><th>Check In</th><th>Check Out</th><th>Duration (h)</th><th>Note</th></tr></thead>
        <tbody>
          {records.length === 0 && <tr><td colSpan="4">No records yet.</td></tr>}
          {records.map(r => (
            <tr key={r.id}>
              <td>{new Date(r.checkInAt).toLocaleString()}</td>
              <td>{r.checkOutAt ? new Date(r.checkOutAt).toLocaleString() : '—'}</td>
              <td>{r.checkOutAt ? ((new Date(r.checkOutAt) - new Date(r.checkInAt)) / 3600000).toFixed(2) : '—'}</td>
              <td>{r.note || ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

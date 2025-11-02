// frontend/src/components/Dashboard.js
// Main dashboard: shows employee list (if admin), attendance actions, and simple report view.

import React, { useState, useEffect } from 'react';
import api from '../api';
import EmployeeList from './EmployeeList';
import AttendancePanel from './AttendancePanel';

export default function Dashboard({ token, user, onLogout }) {
  const [employees, setEmployees] = useState([]);
  const [message, setMessage] = useState('');

  async function fetchEmployees() {
    try {
      const list = await api.get('/employees', token);
      setEmployees(list);
    } catch (err) {
      console.error('Failed to fetch employees', err);
      setMessage('Failed to load employees');
    }
  }

  useEffect(() => {
    fetchEmployees();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="dashboard">
      <header>
        <h1>Welcome, {user.fullName} ({user.role})</h1>
        <div>
          <button onClick={() => onLogout()}>Logout</button>
        </div>
      </header>

      <main>
        <section>
          <h2>Attendance Actions</h2>
          <AttendancePanel token={token} onMessage={setMessage} />
        </section>

        <section>
          <h2>Employees</h2>
          <EmployeeList employees={employees} />
        </section>

        {user.role === 'admin' && (
          <section>
            <h2>Reports (admin)</h2>
            <SimpleReport token={token} />
          </section>
        )}

        {message && <div className="message">{message}</div>}
      </main>
    </div>
  );
}

// SimpleReport component included inline for brevity
function SimpleReport({ token }) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [report, setReport] = useState(null);

  async function loadReport() {
    try {
      const params = new URLSearchParams();
      if (from) params.append('from', from);
      if (to) params.append('to', to);
      const data = await api.get('/attendance/report?' + params.toString(), token);
      setReport(data);
    } catch (err) {
      setReport({ error: err.body?.error || 'Failed to load report' });
    }
  }

  return (
    <div className="report">
      <label>From<input type="date" value={from} onChange={e => setFrom(e.target.value)} /></label>
      <label>To<input type="date" value={to} onChange={e => setTo(e.target.value)} /></label>
      <button onClick={loadReport}>Load</button>

      {report && report.report ? (
        <table>
          <thead><tr><th>Employee</th><th>Sessions</th><th>Total Hours</th></tr></thead>
          <tbody>
            {report.report.map((r, i) => (
              <tr key={i}>
                <td>{r.employee.fullName} ({r.employee.username})</td>
                <td>{r.sessions}</td>
                <td>{r.totalHours}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : report && report.error ? <div className="error">{report.error}</div> : null}
    </div>
  );
}
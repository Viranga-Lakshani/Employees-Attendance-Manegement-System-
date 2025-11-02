// frontend/src/components/EmployeeList.js
// Simple employee list display.

import React from 'react';

export default function EmployeeList({ employees }) {
  if (!employees || employees.length === 0) return <div>No employees found.</div>;

  return (
    <table className="employees-table">
      <thead>
        <tr><th>ID</th><th>Username</th><th>Full Name</th><th>Role</th><th>Created</th></tr>
      </thead>
      <tbody>
        {employees.map(emp => (
          <tr key={emp.id}>
            <td>{emp.id}</td>
            <td>{emp.username}</td>
            <td>{emp.fullName}</td>
            <td>{emp.role}</td>
            <td>{new Date(emp.createdAt).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

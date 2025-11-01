# Employees Attendance Management System

This repository is a complete, human-readable example of an Employees Attendance Management System. It includes a backend (Node.js + Express + Sequelize with SQLite) and a minimal frontend (React) to demonstrate login, employee CRUD, and simple attendance punch in/out and reporting.

Everything in the code is deliberately written to be clear and "humanized": descriptive variable and function names, and extensive comments explaining what each part does.

Quick contents:
- backend/ — Express + Sequelize API
- frontend/ — Minimal React single-page app
- README contains quick setup and usage instructions

Important notes:
- This example uses SQLite for simplicity. For production use, switch to PostgreSQL/MySQL and secure configuration values.
- Authentication is JWT-based with password hashing (bcrypt).
- This is a learning/demo repo and not production-hardened.

If you want I can:
- Add Docker configuration
- Add tests
- Expand role-based access control
- Add CSV/Excel export for attendance

Setup (development)
1. Start the backend:
   - cd backend
   - npm install
   - npm run init-db   # seeds demo data
   - npm start

2. Start the frontend:
   - cd frontend
   - npm install
   - npm start

API is available at http://localhost:4000
Frontend runs at http://localhost:3000

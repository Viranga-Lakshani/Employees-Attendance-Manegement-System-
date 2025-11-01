# 👩‍💼 Employee Attendance Management System

A **complete, human-friendly project** built with **Node.js (Express)** + **React** + **SQLite**.  
It helps companies manage employee attendance easily — including registration, login, and clock-in/out features.

---

## 🏗️ Project Structure

```
attendance-system/
│
├── backend/        # Node.js + Express + SQLite API
├── frontend/       # React app
└── README.md       # Project overview
```

---

## ✨ Features

✅ Employee registration and login (JWT authentication)  
✅ Password hashing using bcrypt  
✅ Clock In / Clock Out actions  
✅ View attendance history  
✅ Admin seeding option (create first admin account)  
✅ Human-readable, clean code with inline comments  
✅ Lightweight setup — no external databases needed (uses SQLite)

---

## ⚙️ Backend (Node.js + Express + SQLite)

**Location:** `backend/`

**Main files:**
- `server.js` — main server file (routes, JWT auth, logic)
- `db.js` — handles SQLite database connection and schema creation
- `package.json` — dependencies list
- `README.md` — backend setup guide

### ▶️ How to Run Backend

```bash
cd backend
npm install
npm start
```

This starts the backend at: **http://localhost:4000**

#### 📡 API Endpoints

| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/api/register` | Register new employee |
| POST | `/api/login` | Login existing employee |
| POST | `/api/attendance` | Clock in/out (requires token) |
| GET | `/api/attendance` | View attendance records |
| POST | `/api/seed-admin` | Create first admin user |

Example login response:
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "employee"
  }
}
```

---

## 💻 Frontend (React)

**Location:** `frontend/`

**Main files:**
- `src/App.js` — handles authentication and dashboard
- `src/components/Login.js` — login/register screen
- `src/components/Dashboard.js` — attendance page
- `src/api.js` — Axios wrapper for API calls

### ▶️ How to Run Frontend

```bash
cd frontend
npm install
npm start
```

Then open: **http://localhost:3000**

---

## 🔐 Authentication Flow

1. User registers or logs in → gets a JWT token.  
2. Token is saved to `localStorage` and attached to all API requests.  
3. Protected routes (like attendance) require a valid token.

---

## 🧱 Database Schema (SQLite)

**employees**
| id | name | email | password_hash | role | created_at |

**attendance**
| id | employee_id | type | timestamp | note |

---

## 📘 Example Workflow

1. Register new employee  
2. Login → receive JWT  
3. Use dashboard to Clock In / Clock Out  
4. Attendance records appear instantly

---

## 🛠️ Tech Stack

| Area | Technologies |
|------|---------------|
| Frontend | React, Axios |
| Backend | Node.js, Express |
| Database | SQLite (better-sqlite3) |
| Auth | JWT + bcrypt |
| Hosting | (Optional) Render / Vercel / Railway |

---

## 🧩 Next Steps & Customization

You can extend this system easily:
- Add **admin dashboard** for employee management
- Include **CSV export** of attendance
- Integrate **biometric** or **QR-based** check-ins
- Use **MySQL/PostgreSQL** in production

---

## 🧠 Tips

- Keep your `.env` secret keys safe!  
- In production, use HTTPS and secure JWT storage.  
- Regularly back up your SQLite database file (`attendance.db`).

---

## 👨‍💻 Author

Created by **viranga-Lakshani**  
A passionate full-stack engineer with experience in:  
HTML5, CSS, JavaScript, React, Angular, Java, PHP, C#, Python, Spring Boot, Laravel, .NET, Django, SQL, MySQL, PostgreSQL, MongoDB, AWS, Azure, React Native, Flutter, Docker, Kubernetes, WordPress.

---

## 📄 License

This sample project is open for educational and commercial use.  
You can freely modify and deploy it.

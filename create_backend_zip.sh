#!/usr/bin/env bash
set -euo pipefail

# create_backend_zip.sh
# Creates a ZIP containing only the backend portion of the Attendance Management System.
# Output: attendance-backend.zip containing folder attendance-backend/
#
# Usage:
#   chmod +x create_backend_zip.sh
#   ./create_backend_zip.sh
#
# On Android (Termux) you can then run:
#   mv attendance-backend.zip /sdcard/
#
OUT_DIR="attendance-backend"
ZIP_NAME="attendance-backend.zip"

echo "Creating backend package in ./${OUT_DIR} ..."

# Remove previous output if present
if [ -d "$OUT_DIR" ]; then
  echo "Removing existing directory $OUT_DIR ..."
  rm -rf "$OUT_DIR"
fi
rm -f "$ZIP_NAME"

# Create directories
mkdir -p "$OUT_DIR/src/config" "$OUT_DIR/src/models" "$OUT_DIR/src/routes" "$OUT_DIR/src/controllers" "$OUT_DIR/src/middleware" "$OUT_DIR/src/utils"

# Root README (small)
cat > "$OUT_DIR/README.md" <<'EOF'
# Attendance Management — Backend

This archive contains the backend portion of the Attendance Management System:
- package.json
- src/index.js (API entry)
- src/config/database.js (SQLite config)
- src/models (employee + attendance + index)
- src/routes & src/controllers for auth + minimal endpoints
- src/utils/seed.js to create demo users

Run:
1. cd attendance-backend
2. npm install
3. npm run init-db
4. npm start

Demo credentials created by seed: admin/adminpass, alice/alicepass, bob/bobpass
EOF

# .gitignore
cat > "$OUT_DIR/.gitignore" <<'EOF'
node_modules
*.sqlite
.env
EOF

# package.json
cat > "$OUT_DIR/package.json" <<'EOF'
{
  "name": "attendance-backend",
  "version": "1.0.0",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "init-db": "node src/utils/seed.js"
  },
  "dependencies": {
    "bcrypt": "^5.1.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "express": "^4.18.2",
    "jsonwebtoken": "^9.0.0",
    "sequelize": "^6.32.1",
    "sqlite3": "^5.1.6"
  }
}
EOF

# src/index.js
cat > "$OUT_DIR/src/index.js" <<'EOF'
// Minimal backend entry (start with `npm start`)
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
  } catch (e) {
    console.error('Startup failed', e);
    process.exit(1);
  }
}
start();
EOF

# src/config/database.js
cat > "$OUT_DIR/src/config/database.js" <<'EOF'
// Minimal Sequelize (SQLite) configuration
const { Sequelize } = require('sequelize');
const path = require('path');

const storage = process.env.SQLITE_FILE || path.join(__dirname, '..', '..', 'data', 'attendance-backend.sqlite');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage,
  logging: false
});

module.exports = { sequelize };
EOF

# src/models/employee.js
cat > "$OUT_DIR/src/models/employee.js" <<'EOF'
// Employee model (minimal)
const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
  const Employee = sequelize.define('Employee', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING, unique: true, allowNull: false },
    fullName: { type: DataTypes.STRING, allowNull: false },
    passwordHash: { type: DataTypes.STRING, allowNull: false, field: 'password_hash' },
    role: { type: DataTypes.STRING, allowNull: false, defaultValue: 'employee' }
  }, { tableName: 'employees', timestamps: true });

  Employee.prototype.verifyPassword = function (plain) {
    return bcrypt.compare(plain, this.passwordHash);
  };

  return Employee;
};
EOF

# src/models/attendance.js
cat > "$OUT_DIR/src/models/attendance.js" <<'EOF'
// Attendance model (minimal)
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Attendance = sequelize.define('Attendance', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    employeeId: { type: DataTypes.INTEGER, allowNull: false, field: 'employee_id' },
    checkInAt: { type: DataTypes.DATE, allowNull: false, field: 'check_in_at' },
    checkOutAt: { type: DataTypes.DATE, allowNull: true, field: 'check_out_at' },
    note: { type: DataTypes.TEXT, allowNull: true }
  }, { tableName: 'attendances', timestamps: true });

  return Attendance;
};
EOF

# src/models/index.js
cat > "$OUT_DIR/src/models/index.js" <<'EOF'
const { sequelize } = require('../config/database');
const Employee = require('./employee')(sequelize);
const Attendance = require('./attendance')(sequelize);

Employee.hasMany(Attendance, { foreignKey: 'employeeId', as: 'attendances' });
Attendance.belongsTo(Employee, { foreignKey: 'employeeId', as: 'employee' });

module.exports = { sequelize, Employee, Attendance };
EOF

# src/routes/auth.js
cat > "$OUT_DIR/src/routes/auth.js" <<'EOF'
// Minimal auth routes
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register); // demo only
router.post('/login', authController.login);

module.exports = router;
EOF

# src/controllers/authController.js
cat > "$OUT_DIR/src/controllers/authController.js" <<'EOF'
// Minimal auth controller: register + login
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Employee } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret';

async function register(req, res) {
  try {
    const { username, fullName, password } = req.body;
    if (!username || !fullName || !password) return res.status(400).json({ error: 'username, fullName and password required' });

    const existing = await Employee.findOne({ where: { username } });
    if (existing) return res.status(409).json({ error: 'username_exists' });

    const passwordHash = await bcrypt.hash(password, 10);
    const created = await Employee.create({ username, fullName, passwordHash, role: 'employee' });
    res.status(201).json({ id: created.id, username: created.username, fullName: created.fullName });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'internal' });
  }
}

async function login(req, res) {
  try {
    const { username, password } = req.body;
    const user = await Employee.findOne({ where: { username } });
    if (!user) return res.status(401).json({ error: 'invalid' });

    const ok = await user.verifyPassword(password);
    if (!ok) return res.status(401).json({ error: 'invalid' });

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, user: { id: user.id, username: user.username, fullName: user.fullName, role: user.role } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'internal' });
  }
}

module.exports = { register, login };
EOF

# src/utils/seed.js
cat > "$OUT_DIR/src/utils/seed.js" <<'EOF'
// Minimal seed: creates admin, alice, bob
const bcrypt = require('bcrypt');
const { sequelize, Employee } = require('../models');

async function seed() {
  await sequelize.sync({ force: true });

  const adminHash = await bcrypt.hash('adminpass', 10);
  const aliceHash = await bcrypt.hash('alicepass', 10);
  const bobHash = await bcrypt.hash('bobpass', 10);

  await Employee.create({ username: 'admin', fullName: 'Admin User', passwordHash: adminHash, role: 'admin' });
  await Employee.create({ username: 'alice', fullName: 'Alice Johnson', passwordHash: aliceHash, role: 'employee' });
  await Employee.create({ username: 'bob', fullName: 'Bob Lee', passwordHash: bobHash, role: 'employee' });

  console.log('Seed done: admin/adminpass, alice/alicepass, bob/bobpass');
}

seed().catch(err => { console.error(err); process.exit(1); });
EOF

# Create ZIP
cd ..

if ! command -v zip >/dev/null 2>&1; then
  echo ""
  echo "zip command not found. Please install zip and re-run the script."
  echo "On Termux: pkg update && pkg install zip"
  echo "On Debian/Ubuntu: sudo apt install zip"
  echo ""
  echo "Or create manually: zip -r $ZIP_NAME $OUT_DIR"
  exit 1
fi

echo "Creating ZIP ${ZIP_NAME} ..."
zip -r "$ZIP_NAME" "$OUT_DIR" >/dev/null

echo ""
echo "Created: $(pwd)/$ZIP_NAME"
echo "Backend folder inside zip: $OUT_DIR/"
echo ""
echo "On Termux you may move it to shared storage:"
echo "  mv $ZIP_NAME /sdcard/"
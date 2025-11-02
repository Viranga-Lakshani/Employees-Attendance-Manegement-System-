// backend/src/utils/seed.js
// Simple seeding script to create an admin and some demo employees. Run with `npm run init-db`.

require('dotenv').config();
const bcrypt = require('bcrypt');
const { sequelize, Employee, Attendance } = require('../models');

async function seed() {
  try {
    await sequelize.sync({ force: true }); // WARNING: deletes existing data in this demo mode

    const adminPassHash = await bcrypt.hash('adminpass', 10);
    const alicePassHash = await bcrypt.hash('alicepass', 10);
    const bobPassHash = await bcrypt.hash('bobpass', 10);

    const admin = await Employee.create({ username: 'admin', fullName: 'Admin User', passwordHash: adminPassHash, role: 'admin' });
    const alice = await Employee.create({ username: 'alice', fullName: 'Alice Johnson', passwordHash: alicePassHash, role: 'employee' });
    const bob = await Employee.create({ username: 'bob', fullName: 'Bob Lee', passwordHash: bobPassHash, role: 'employee' });

    console.log('Seeded employees:', { admin: admin.username, alice: alice.username, bob: bob.username });

    // Create a couple of attendance sessions for demo
    const now = new Date();
    const yesterday = new Date(Date.now() - 24 * 3600 * 1000);
    await Attendance.create({ employeeId: alice.id, checkInAt: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 9, 0), checkOutAt: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 17, 0) });
    await Attendance.create({ employeeId: bob.id, checkInAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 30), checkOutAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 15) });

    console.log('Sample attendance records created.');
    console.log('Admin credentials: username=admin password=adminpass');
    console.log('Employee credentials: username=alice password=alicepass');
    console.log('Employee credentials: username=bob password=bobpass');

    process.exit(0);
  } catch (err) {
    console.error('Seeding failed', err);
    process.exit(1);
  }
}

seed();
// One-off script to create (or promote) an admin user.
// Usage:
//   node src/scripts/createAdmin.js <email> <password> [name]
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');

async function run() {
  const [, , email, password, name] = process.argv;
  if (!email || !password) {
    console.error('Usage: node src/scripts/createAdmin.js <email> <password> [name]');
    process.exit(1);
  }

  await connectDB();

  let user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (user) {
    user.role = 'admin';
    user.password = password; // re-hashed by the pre-save hook
    if (name) user.name = name;
    await user.save();
    console.log(`Updated existing user ${email} -> admin`);
  } else {
    user = await User.create({
      email,
      password,
      name: name || 'Administrator',
      role: 'admin',
    });
    console.log(`Created admin user ${email}`);
  }

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error('Failed to create admin:', err.message);
  process.exit(1);
});

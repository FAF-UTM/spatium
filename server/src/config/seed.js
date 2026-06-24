// Bootstrap data: ensure a default admin exists so the dashboard is usable on
// a fresh database. Runs once on startup after the DB connects.
const User = require('../models/User');

const DEFAULT_ADMIN = {
  name: 'Administrator',
  username: 'admin',
  email: 'admin@spatium.md',
  password: 'Password1234567.',
  role: 'admin',
};

/**
 * Create the default admin if no admin user exists yet.
 * Idempotent: does nothing once any admin is present.
 */
async function seedDefaultAdmin() {
  const adminExists = await User.exists({ role: 'admin' });
  if (adminExists) return;

  await User.create(DEFAULT_ADMIN);
  console.log(
    `[seed] Created default admin -> username: "${DEFAULT_ADMIN.username}" / email: "${DEFAULT_ADMIN.email}". Change this password after first login.`
  );
}

module.exports = { seedDefaultAdmin, DEFAULT_ADMIN };

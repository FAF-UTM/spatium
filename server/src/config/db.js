// MongoDB connection helper using Mongoose.
const mongoose = require('mongoose');
const config = require('./env');

// Fail loudly on malformed queries rather than silently dropping unknown fields.
mongoose.set('strictQuery', true);

/**
 * Establish the MongoDB connection. Resolves once connected, rejects on failure
 * so the caller (server bootstrap) can decide whether to exit the process.
 * @returns {Promise<typeof mongoose>}
 */
async function connectDB() {
  mongoose.connection.on('connected', () => {
    console.log('[db] MongoDB connected');
  });
  mongoose.connection.on('error', (err) => {
    console.error('[db] MongoDB connection error:', err.message);
  });
  mongoose.connection.on('disconnected', () => {
    console.warn('[db] MongoDB disconnected');
  });

  await mongoose.connect(config.mongoUri, {
    serverSelectionTimeoutMS: 10000,
  });

  return mongoose;
}

module.exports = connectDB;

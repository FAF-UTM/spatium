// Centralised environment configuration.
// Loads .env once and validates that required variables are present so the
// process fails fast with a clear message instead of crashing later at runtime.
const path = require('path');
const dotenv = require('dotenv');

// Load the .env that lives at the server root (one level above /src).
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

/**
 * Read a required env var or throw if it is missing/empty.
 * @param {string} key
 * @returns {string}
 */
function required(key) {
  const value = process.env[key];
  if (!value || value.trim() === '') {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

/**
 * Read an optional env var with a fallback default.
 * @param {string} key
 * @param {string} [fallback]
 * @returns {string|undefined}
 */
function optional(key, fallback) {
  const value = process.env[key];
  return value && value.trim() !== '' ? value : fallback;
}

const config = {
  nodeEnv: optional('NODE_ENV', 'development'),
  port: parseInt(optional('PORT', '3000'), 10),

  mongoUri: required('MONGODB_URI'),

  jwt: {
    secret: required('JWT_SECRET'),
    expiresIn: optional('JWT_EXPIRES_IN', '7d'),
  },

  sessionSecret: required('SESSION_SECRET'),

  cloudinary: {
    cloudName: required('CLOUDINARY_CLOUD_NAME'),
    apiKey: required('CLOUDINARY_API_KEY'),
    apiSecret: required('CLOUDINARY_API_SECRET'),
  },

  // Comma-separated list of allowed origins is supported; falls back to a sane
  // local dev origin when CLIENT_URL is not set.
  clientUrl: optional('CLIENT_URL', 'http://localhost:5173'),
};

config.isProduction = config.nodeEnv === 'production';

module.exports = config;

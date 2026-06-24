// Central error handling: a small typed error class plus the Express error
// middleware and a 404 fallthrough.
const config = require('../config/env');

/**
 * Operational error with an HTTP status code.
 */
class ApiError extends Error {
  constructor(statusCode, message, details) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 404 handler — reached when no route matched.
 */
function notFound(req, _res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

/* eslint-disable no-unused-vars */
/**
 * Express error middleware. Normalises Mongoose/JWT/Multer errors into a clean
 * JSON shape and hides internals in production.
 */
function errorHandler(err, _req, res, _next) {
  // body-parser / http-errors set `status`; honour it alongside statusCode.
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || 'Internal Server Error';
  let details = err.details;

  // Malformed JSON body or oversized payload from express.json().
  if (err.type === 'entity.parse.failed') {
    statusCode = 400;
    message = 'Invalid JSON in request body';
  }
  if (err.type === 'entity.too.large') {
    statusCode = 413;
    message = 'Request body is too large';
  }

  // Mongoose validation error -> 400 with field messages.
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    details = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
  }

  // Mongoose duplicate key (e.g. email already registered).
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `A record with that ${field} already exists`;
  }

  // Invalid ObjectId etc.
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid value for ${err.path}`;
  }

  // Multer upload errors.
  if (err.name === 'MulterError') {
    statusCode = 400;
    message = err.code === 'LIMIT_FILE_SIZE' ? 'File is too large' : err.message;
  }

  if (statusCode >= 500) {
    console.error('[error]', err);
  }

  const body = { success: false, message };
  if (details) body.details = details;
  if (!config.isProduction && statusCode >= 500) body.stack = err.stack;

  res.status(statusCode).json(body);
}

module.exports = { ApiError, notFound, errorHandler };

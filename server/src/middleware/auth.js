// Authentication & authorization middleware.
const jwt = require('jsonwebtoken');
const config = require('../config/env');
const User = require('../models/User');
const { ApiError } = require('./errorHandler');

/**
 * Sign a JWT for a given user.
 * @param {{ _id: any, role: string }} user
 * @returns {string}
 */
function signToken(user) {
  return jwt.sign({ sub: user._id.toString(), role: user.role }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
}

/**
 * Extract a bearer token from the Authorization header, falling back to the
 * express-session (so cookie-based auth works too).
 * @param {import('express').Request} req
 * @returns {string|null}
 */
function extractToken(req) {
  const header = req.headers.authorization || '';
  if (header.startsWith('Bearer ')) {
    return header.slice(7).trim();
  }
  if (req.session && req.session.token) {
    return req.session.token;
  }
  return null;
}

/**
 * Require a valid, authenticated user. Populates req.user.
 */
async function protect(req, _res, next) {
  try {
    const token = extractToken(req);
    if (!token) {
      throw new ApiError(401, 'Authentication required');
    }

    let payload;
    try {
      payload = jwt.verify(token, config.jwt.secret);
    } catch (err) {
      throw new ApiError(401, 'Invalid or expired token');
    }

    const user = await User.findById(payload.sub);
    if (!user) {
      throw new ApiError(401, 'User no longer exists');
    }

    req.user = user;
    return next();
  } catch (err) {
    return next(err);
  }
}

/**
 * Soft authentication: if a valid token is present, populate req.user;
 * otherwise continue as an anonymous request. Never throws on missing/invalid
 * tokens — used by public endpoints that expose extra data to admins.
 */
async function attachUserIfPresent(req, _res, next) {
  try {
    const token = extractToken(req);
    if (!token) return next();
    const payload = jwt.verify(token, config.jwt.secret);
    const user = await User.findById(payload.sub);
    if (user) req.user = user;
  } catch {
    // ignore — treat as anonymous
  }
  return next();
}

/**
 * Restrict a route to one or more roles. Must run after `protect`.
 * @param {...string} roles
 */
function authorize(...roles) {
  return (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(403, 'You do not have permission to perform this action'));
    }
    return next();
  };
}

module.exports = { signToken, protect, authorize, attachUserIfPresent };

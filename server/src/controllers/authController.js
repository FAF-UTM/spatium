const User = require('../models/User');
const { signToken } = require('../middleware/auth');
const { ApiError } = require('../middleware/errorHandler');
const asyncHandler = require('../utils/asyncHandler');

/**
 * POST /auth/login
 * Accepts { identifier (username or email), password } — also tolerates an
 * `email` or `username` field directly. Returns a JWT and starts a session.
 */
const login = asyncHandler(async (req, res) => {
  const identifier = (req.body.identifier || req.body.email || req.body.username || '')
    .trim()
    .toLowerCase();
  const { password } = req.body;

  if (!identifier || !password) {
    throw new ApiError(400, 'Username/email and password are required');
  }

  const user = await User.findOne({
    $or: [{ email: identifier }, { username: identifier }],
  }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const token = signToken(user);
  req.session.token = token;
  req.session.userId = user._id.toString();

  res.json({ success: true, token, user: user.toJSON() });
});

/**
 * POST /auth/logout
 */
const logout = asyncHandler(async (req, res) => {
  if (req.session) {
    await new Promise((resolve, reject) => {
      req.session.destroy((err) => (err ? reject(err) : resolve()));
    });
  }
  res.clearCookie('spatium.sid');
  res.json({ success: true, message: 'Logged out' });
});

/**
 * GET /auth/me — current authenticated user.
 */
const me = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user.toJSON() });
});

/**
 * PUT /auth/change-password — change own password (requires current password).
 */
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');
  if (!user || !(await user.comparePassword(currentPassword))) {
    throw new ApiError(401, 'Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();
  res.json({ success: true, message: 'Password changed' });
});

module.exports = { login, logout, me, changePassword };

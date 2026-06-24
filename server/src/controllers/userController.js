const User = require('../models/User');
const { ApiError } = require('../middleware/errorHandler');
const asyncHandler = require('../utils/asyncHandler');

/** GET /users — list all users (admin only). */
const list = asyncHandler(async (_req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json({ success: true, data: users });
});

/** POST /users — create a user (admin only). */
const create = asyncHandler(async (req, res) => {
  const { name, username, email, password, role } = req.body;

  const user = await User.create({
    name,
    username: username || undefined,
    email,
    password,
    role: role === 'admin' ? 'admin' : 'user',
  });

  res.status(201).json({ success: true, data: user.toJSON() });
});

/** PUT /users/:id — update profile fields / role (admin only). */
const update = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');

  const { name, username, email, role } = req.body;
  if (name !== undefined) user.name = name;
  if (username !== undefined) user.username = username || undefined;
  if (email !== undefined) user.email = email;

  if (role !== undefined && role !== user.role) {
    // Don't allow removing the last admin.
    if (user.role === 'admin' && role !== 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        throw new ApiError(400, 'Cannot demote the last remaining admin');
      }
    }
    user.role = role === 'admin' ? 'admin' : 'user';
  }

  await user.save();
  res.json({ success: true, data: user.toJSON() });
});

/** PUT /users/:id/password — set another user's password (admin only). */
const setPassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('+password');
  if (!user) throw new ApiError(404, 'User not found');

  user.password = req.body.password;
  await user.save();
  res.json({ success: true, message: 'Password updated' });
});

/** DELETE /users/:id — remove a user (admin only). */
const remove = asyncHandler(async (req, res) => {
  if (req.user._id.toString() === req.params.id) {
    throw new ApiError(400, 'You cannot delete your own account');
  }

  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');

  if (user.role === 'admin') {
    const adminCount = await User.countDocuments({ role: 'admin' });
    if (adminCount <= 1) {
      throw new ApiError(400, 'Cannot delete the last remaining admin');
    }
  }

  await user.deleteOne();
  res.json({ success: true, message: 'User deleted' });
});

module.exports = { list, create, update, setPassword, remove };

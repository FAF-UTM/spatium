const express = require('express');
const rateLimit = require('express-rate-limit');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const { login, logout, me, changePassword } = require('../controllers/authController');

const router = express.Router();

// Throttle auth attempts to slow down credential stuffing / brute force.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many attempts, please try again later' },
});

router.post(
  '/login',
  authLimiter,
  [
    body('password').notEmpty().withMessage('Password is required'),
    body().custom((value) => {
      if (!value.identifier && !value.email && !value.username) {
        throw new Error('Username or email is required');
      }
      return true;
    }),
  ],
  validate,
  login
);

router.post('/logout', logout);
router.get('/me', protect, me);

router.put(
  '/change-password',
  protect,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('New password must be at least 8 characters'),
  ],
  validate,
  changePassword
);

module.exports = router;

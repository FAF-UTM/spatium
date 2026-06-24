const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');
const { list, create, update, setPassword, remove } = require('../controllers/userController');

const router = express.Router();

// Every route here requires an authenticated admin.
router.use(protect, authorize('admin'));

router.get('/', list);

router.post(
  '/',
  [
    body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
    body('username')
      .optional({ values: 'falsy' })
      .isLength({ min: 3 })
      .withMessage('Username must be at least 3 characters'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('role').optional().isIn(['user', 'admin']),
  ],
  validate,
  create
);

router.put(
  '/:id',
  [
    body('email').optional().isEmail().normalizeEmail(),
    body('username').optional({ values: 'falsy' }).isLength({ min: 3 }),
    body('role').optional().isIn(['user', 'admin']),
  ],
  validate,
  update
);

router.put(
  '/:id/password',
  [body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')],
  validate,
  setPassword
);

router.delete('/:id', remove);

module.exports = router;

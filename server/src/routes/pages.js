const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect, authorize, attachUserIfPresent } = require('../middleware/auth');
const {
  list,
  getOne,
  getByLink,
  create,
  update,
  remove,
} = require('../controllers/pageController');

const router = express.Router();

// Public reads.
router.get('/', attachUserIfPresent, list);
// Match a slug that may contain slashes, e.g. "project/trafficking-escape".
router.get('/by-link/:link(*)', getByLink);
router.get('/:id', getOne);

// Admin writes.
const pageValidators = [
  body('link').trim().notEmpty().withMessage('Page link is required'),
];

router.post('/', protect, authorize('admin'), pageValidators, validate, create);
router.put('/:id', protect, authorize('admin'), update);
router.delete('/:id', protect, authorize('admin'), remove);

module.exports = router;

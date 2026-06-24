const express = require('express');
const makeContentController = require('../controllers/contentController');
const { protect, authorize, attachUserIfPresent } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

/**
 * Build a REST router for a card model (News / Project / Gallery).
 * Public reads, admin-only writes. Accepts JSON or multipart (with an `image`
 * file field) on create/update.
 * @param {import('mongoose').Model} Model
 */
function makeContentRouter(Model) {
  const router = express.Router();
  const ctrl = makeContentController(Model);

  // attachUserIfPresent lets the list endpoint reveal unpublished items to
  // admins (?all=true) without requiring auth for the public case.
  router.get('/', attachUserIfPresent, ctrl.list);
  router.get('/:id', ctrl.getOne);

  router.post('/', protect, authorize('admin'), upload.single('image'), ctrl.create);
  router.put('/:id', protect, authorize('admin'), upload.single('image'), ctrl.update);
  router.delete('/:id', protect, authorize('admin'), ctrl.remove);

  return router;
}

module.exports = makeContentRouter;

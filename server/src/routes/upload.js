const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const { uploadImage } = require('../controllers/uploadController');

const router = express.Router();

// Single image upload under the multipart field name "image" (admin only).
router.post('/', protect, authorize('admin'), upload.single('image'), uploadImage);

module.exports = router;

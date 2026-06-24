const { uploadBufferToCloudinary } = require('../middleware/upload');
const { ApiError } = require('../middleware/errorHandler');
const asyncHandler = require('../utils/asyncHandler');

/**
 * POST /upload
 * Accepts a single `image` multipart field and returns its Cloudinary URL.
 */
const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'No image file provided (expected field "image")');
  }

  const { url, publicId } = await uploadBufferToCloudinary(req.file);

  res.status(201).json({
    success: true,
    image: { url, publicId },
  });
});

module.exports = { uploadImage };

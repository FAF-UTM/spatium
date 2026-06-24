// Image upload middleware: multer keeps the file in memory, then a helper
// streams the buffer to Cloudinary. Using memory storage (instead of
// multer-storage-cloudinary) keeps us compatible with the Cloudinary v2 SDK
// and lets us validate before spending an upload.
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { ApiError } = require('./errorHandler');

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];

const storage = multer.memoryStorage();

function fileFilter(_req, file, cb) {
  if (ALLOWED_MIME.includes(file.mimetype)) {
    return cb(null, true);
  }
  return cb(new ApiError(400, 'Unsupported file type. Allowed: JPEG, PNG, WEBP, GIF, AVIF'));
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE },
});

/**
 * Upload a multer in-memory file buffer to Cloudinary.
 * @param {Express.Multer.File} file
 * @param {string} [folder]
 * @returns {Promise<{ url: string, publicId: string }>}
 */
function uploadBufferToCloudinary(file, folder = 'spatium') {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) return reject(new ApiError(502, 'Image upload failed'));
        return resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(file.buffer);
  });
}

/**
 * Delete an asset from Cloudinary by public_id. Best-effort: never throws.
 * @param {string} publicId
 */
async function destroyFromCloudinary(publicId) {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.warn('[upload] Failed to delete Cloudinary asset', publicId, err.message);
  }
}

module.exports = { upload, uploadBufferToCloudinary, destroyFromCloudinary };

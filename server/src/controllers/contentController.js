// Factory that builds CRUD handlers for any "card" model (News, Project,
// Gallery). Keeps the three resources DRY while allowing per-resource routes.
const { ApiError } = require('../middleware/errorHandler');
const asyncHandler = require('../utils/asyncHandler');
const { uploadBufferToCloudinary, destroyFromCloudinary } = require('../middleware/upload');

// Fields a client is allowed to set on a card.
const CARD_FIELDS = [
  'title_ro',
  'title_ru',
  'title_en',
  'description_ro',
  'description_ru',
  'description_en',
  'date',
  'to',
  'order',
  'published',
];

function coerce(field, value) {
  if (field === 'order') return Number(value) || 0;
  if (field === 'published') return value === true || value === 'true';
  return value;
}

/**
 * Resolve the image for a request: an uploaded file takes priority, otherwise
 * an `img` URL already present in the body. Returns null when unchanged.
 */
async function resolveImage(req) {
  if (req.file) {
    const { url, publicId } = await uploadBufferToCloudinary(req.file);
    return { img: url, imagePublicId: publicId };
  }
  if (req.body.img !== undefined) {
    return { img: req.body.img, imagePublicId: req.body.imagePublicId || '' };
  }
  return null;
}

/**
 * Normalise an incoming gallery `images` value (JSON string or array) into a
 * clean [{ url, publicId }] list. Returns null when the field wasn't sent (so
 * existing images are left untouched).
 */
function parseImages(raw) {
  if (raw === undefined) return null;
  let arr = raw;
  if (typeof raw === 'string') {
    try {
      arr = JSON.parse(raw);
    } catch {
      return null;
    }
  }
  if (!Array.isArray(arr)) return null;
  return arr
    .filter((x) => x && x.url)
    .map((x) => ({ url: String(x.url), publicId: x.publicId ? String(x.publicId) : '' }));
}

/**
 * @param {import('mongoose').Model} Model
 */
function makeContentController(Model) {
  const list = asyncHandler(async (req, res) => {
    // Admins may request unpublished items with ?all=true.
    const filter = {};
    const includeUnpublished = req.query.all === 'true' && req.user && req.user.role === 'admin';
    if (!includeUnpublished) filter.published = true;

    // lean() returns plain objects (faster + lower memory) for this read-only
    // path; -__v keeps the response clean since the toJSON transform is skipped.
    const items = await Model.find(filter)
      .select('-__v')
      .sort({ order: 1, createdAt: -1 })
      .lean();
    res.json({ success: true, data: items });
  });

  const getOne = asyncHandler(async (req, res) => {
    const item = await Model.findById(req.params.id);
    if (!item) throw new ApiError(404, 'Item not found');
    res.json({ success: true, data: item });
  });

  const create = asyncHandler(async (req, res) => {
    const payload = {};
    for (const field of CARD_FIELDS) {
      if (req.body[field] !== undefined) payload[field] = coerce(field, req.body[field]);
    }

    const image = await resolveImage(req);
    if (image) Object.assign(payload, image);

    const images = parseImages(req.body.images);
    if (images) payload.images = images;

    const item = await Model.create(payload);
    res.status(201).json({ success: true, data: item });
  });

  const update = asyncHandler(async (req, res) => {
    const item = await Model.findById(req.params.id);
    if (!item) throw new ApiError(404, 'Item not found');

    for (const field of CARD_FIELDS) {
      if (req.body[field] !== undefined) item[field] = coerce(field, req.body[field]);
    }

    const image = await resolveImage(req);
    if (image) {
      const previous = item.imagePublicId;
      item.img = image.img;
      item.imagePublicId = image.imagePublicId;
      // Clean up the replaced Cloudinary asset (only ours, identified by id).
      if (previous && previous !== image.imagePublicId) {
        await destroyFromCloudinary(previous);
      }
    }

    // Gallery images: replace the list and destroy any assets that were removed.
    const images = parseImages(req.body.images);
    let removedIds = [];
    if (images) {
      const oldIds = (item.images || []).map((i) => i.publicId).filter(Boolean);
      const newIds = images.map((i) => i.publicId).filter(Boolean);
      removedIds = oldIds.filter((id) => !newIds.includes(id));
      item.images = images;
    }

    await item.save();
    for (const id of removedIds) await destroyFromCloudinary(id);

    res.json({ success: true, data: item });
  });

  const remove = asyncHandler(async (req, res) => {
    const item = await Model.findById(req.params.id);
    if (!item) throw new ApiError(404, 'Item not found');

    if (item.imagePublicId) await destroyFromCloudinary(item.imagePublicId);
    for (const im of item.images || []) {
      if (im.publicId) await destroyFromCloudinary(im.publicId);
    }
    await item.deleteOne();

    res.json({ success: true, message: 'Item deleted' });
  });

  return { list, getOne, create, update, remove };
}

module.exports = makeContentController;

const Page = require('../models/Page');
const { ApiError } = require('../middleware/errorHandler');
const asyncHandler = require('../utils/asyncHandler');

const PAGE_FIELDS = [
  'link',
  'type',
  'title_ro',
  'title_ru',
  'title_en',
  'content_ro',
  'content_ru',
  'content_en',
  'published',
];

function coerce(field, value) {
  if (field === 'published') return value === true || value === 'true';
  return value;
}

/** GET /pages — list (public sees published only). */
const list = asyncHandler(async (req, res) => {
  const includeUnpublished = req.query.all === 'true' && req.user && req.user.role === 'admin';
  const filter = includeUnpublished ? {} : { published: true };
  const pages = await Page.find(filter).select('-__v').sort({ createdAt: -1 }).lean();
  res.json({ success: true, data: pages });
});

/** GET /pages/:id — single page by id (admin editing). */
const getOne = asyncHandler(async (req, res) => {
  const page = await Page.findById(req.params.id);
  if (!page) throw new ApiError(404, 'Page not found');
  res.json({ success: true, data: page });
});

/** GET /pages/by-link/:link(*) — single page by slug (public rendering). */
const getByLink = asyncHandler(async (req, res) => {
  const link = (req.params.link || '').replace(/^\/+|\/+$/g, '');
  const page = await Page.findOne({ link, published: true }).select('-__v').lean();
  if (!page) throw new ApiError(404, 'Page not found');
  res.json({ success: true, data: page });
});

/** POST /pages */
const create = asyncHandler(async (req, res) => {
  const payload = {};
  for (const field of PAGE_FIELDS) {
    if (req.body[field] !== undefined) payload[field] = coerce(field, req.body[field]);
  }
  const page = await Page.create(payload);
  res.status(201).json({ success: true, data: page });
});

/** PUT /pages/:id */
const update = asyncHandler(async (req, res) => {
  const page = await Page.findById(req.params.id);
  if (!page) throw new ApiError(404, 'Page not found');

  for (const field of PAGE_FIELDS) {
    if (req.body[field] !== undefined) page[field] = coerce(field, req.body[field]);
  }
  await page.save();
  res.json({ success: true, data: page });
});

/** DELETE /pages/:id */
const remove = asyncHandler(async (req, res) => {
  const page = await Page.findById(req.params.id);
  if (!page) throw new ApiError(404, 'Page not found');
  await page.deleteOne();
  res.json({ success: true, message: 'Page deleted' });
});

module.exports = { list, getOne, getByLink, create, update, remove };

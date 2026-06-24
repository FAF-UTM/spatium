const mongoose = require('mongoose');

// Dynamic CMS page: rendered at /:lang/<link> on the frontend with the
// language-specific HTML content injected.
const pageSchema = new mongoose.Schema(
  {
    // Route slug, e.g. "project/trafficking-escape" (no leading slash, no lang).
    link: {
      type: String,
      required: [true, 'Page link is required'],
      unique: true,
      trim: true,
    },
    // Free-form category, e.g. "Project", "News", "Event".
    type: { type: String, trim: true, default: '' },

    title_ro: { type: String, trim: true, default: '' },
    title_ru: { type: String, trim: true, default: '' },
    title_en: { type: String, trim: true, default: '' },

    // HTML body per language.
    content_ro: { type: String, default: '' },
    content_ru: { type: String, default: '' },
    content_en: { type: String, default: '' },

    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Normalise the link: strip leading/trailing slashes.
pageSchema.pre('validate', function normaliseLink(next) {
  if (this.link) {
    this.link = this.link.replace(/^\/+|\/+$/g, '').trim();
  }
  next();
});

// `link` is already uniquely indexed; index `published` for public listing.
pageSchema.index({ published: 1, createdAt: -1 });

pageSchema.set('toJSON', {
  transform(_doc, ret) {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Page', pageSchema);

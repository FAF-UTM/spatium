const mongoose = require('mongoose');

// News, Projects and Gallery items share the same multilingual "card" shape.
// This factory returns a fresh Schema so each model owns its own instance.
function buildCardSchema() {
  const schema = new mongoose.Schema(
    {
      // Cloudinary secure URL (or a legacy local /images/... path).
      img: { type: String, trim: true, default: '' },
      // Cloudinary public_id so the asset can be deleted with the document.
      imagePublicId: { type: String, trim: true, default: '' },

      // Optional multi-image gallery (array order is the display order).
      images: {
        type: [
          {
            _id: false,
            url: { type: String, trim: true },
            publicId: { type: String, trim: true, default: '' },
          },
        ],
        default: [],
      },

      title_ro: { type: String, trim: true, default: '' },
      title_ru: { type: String, trim: true, default: '' },
      title_en: { type: String, trim: true, default: '' },

      description_ro: { type: String, default: '' },
      description_ru: { type: String, default: '' },
      description_en: { type: String, default: '' },

      // Kept as a display string (e.g. "15.05.2025") to match the frontend.
      date: { type: String, trim: true, default: '' },

      // Outbound link / route the card points to.
      to: { type: String, trim: true, default: '' },

      // Manual sort order (ascending). Lower shows first.
      order: { type: Number, default: 0 },

      published: { type: Boolean, default: true },
    },
    { timestamps: true }
  );

  // Index the common access pattern: public list filters by `published` and
  // sorts by `order` then newest-first.
  schema.index({ published: 1, order: 1, createdAt: -1 });

  schema.set('toJSON', {
    transform(_doc, ret) {
      delete ret.__v;
      return ret;
    },
  });

  return schema;
}

module.exports = buildCardSchema;

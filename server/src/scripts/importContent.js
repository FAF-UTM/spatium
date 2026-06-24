// One-off migration: load the legacy static JSON (client/public/json/*.json)
// into MongoDB, uploading every referenced local image to Cloudinary.
//
// Usage:
//   node src/scripts/importContent.js          # import only into empty collections
//   node src/scripts/importContent.js --fresh  # wipe those collections first
const path = require('path');
const fs = require('fs/promises');
const mongoose = require('mongoose');

const connectDB = require('../config/db');
const cloudinary = require('../config/cloudinary');
const News = require('../models/News');
const Project = require('../models/Project');
const Gallery = require('../models/Gallery');
const Page = require('../models/Page');

const JSON_DIR = path.resolve(__dirname, '../../../client/public/json');
const PUBLIC_DIR = path.resolve(__dirname, '../../../client/public');
const FRESH = process.argv.includes('--fresh');

// Cache so the same local image is only uploaded to Cloudinary once.
const uploadCache = new Map();

async function readJson(file) {
  const raw = await fs.readFile(path.join(JSON_DIR, file), 'utf8');
  return JSON.parse(raw);
}

/**
 * Upload a referenced local image (e.g. "/images/foo.jpg") to Cloudinary.
 * Returns { img, imagePublicId }. Falls back to the original path on failure.
 */
async function migrateImage(localPath, folder) {
  if (!localPath) return { img: '', imagePublicId: '' };
  if (uploadCache.has(localPath)) return uploadCache.get(localPath);

  const abs = path.join(PUBLIC_DIR, localPath.replace(/^\//, ''));
  let result;
  try {
    await fs.access(abs);
    const uploaded = await cloudinary.uploader.upload(abs, {
      folder: `spatium/${folder}`,
      resource_type: 'image',
    });
    result = { img: uploaded.secure_url, imagePublicId: uploaded.public_id };
    console.log(`  ✓ uploaded ${localPath} -> ${uploaded.secure_url}`);
  } catch (err) {
    console.warn(`  ! keeping local path for ${localPath} (${err.message})`);
    result = { img: localPath, imagePublicId: '' };
  }
  uploadCache.set(localPath, result);
  return result;
}

async function importCards(Model, file, folder) {
  const name = Model.modelName;
  const count = await Model.countDocuments();
  if (count > 0 && !FRESH) {
    console.log(`[${name}] ${count} docs already present — skipping (use --fresh to replace)`);
    return;
  }
  if (FRESH) await Model.deleteMany({});

  const items = await readJson(file);
  let order = 0;
  for (const item of items) {
    const { img, imagePublicId } = await migrateImage(item.img, folder);
    await Model.create({
      img,
      imagePublicId,
      title_ro: item.title_ro || '',
      title_ru: item.title_ru || '',
      title_en: item.title_en || '',
      description_ro: item.description_ro || '',
      description_ru: item.description_ru || '',
      description_en: item.description_en || '',
      date: item.date || '',
      to: item.to || '',
      order: order++,
      published: true,
    });
  }
  console.log(`[${name}] imported ${items.length} items`);
}

async function importPages() {
  const count = await Page.countDocuments();
  if (count > 0 && !FRESH) {
    console.log(`[Page] ${count} docs already present — skipping (use --fresh to replace)`);
    return;
  }
  if (FRESH) await Page.deleteMany({});

  const items = await readJson('pages.json');
  for (const item of items) {
    await Page.create({
      link: (item.link || '').replace(/^\/+|\/+$/g, ''),
      type: item.type || '',
      title_ro: item.title_ro || '',
      title_ru: item.title_ru || '',
      title_en: item.title_en || '',
      content_ro: item.content_ro || '',
      content_ru: item.content_ru || '',
      content_en: item.content_en || '',
      published: true,
    });
  }
  console.log(`[Page] imported ${items.length} pages`);
}

async function run() {
  await connectDB();
  console.log(`Importing legacy content from ${JSON_DIR}${FRESH ? ' (FRESH)' : ''}`);

  await importCards(News, 'news.json', 'news');
  await importCards(Project, 'projects.json', 'projects');
  await importCards(Gallery, 'galery.json', 'gallery');
  await importPages();

  await mongoose.disconnect();
  console.log('Done.');
  process.exit(0);
}

run().catch((err) => {
  console.error('Import failed:', err);
  process.exit(1);
});

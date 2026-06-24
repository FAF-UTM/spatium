// Cloudinary SDK configuration. Credentials come exclusively from the
// environment — never hardcode them.
const { v2: cloudinary } = require('cloudinary');
const config = require('./env');

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
  secure: true,
});

module.exports = cloudinary;

const mongoose = require('mongoose');
const buildCardSchema = require('./cardSchema');

module.exports = mongoose.model('Project', buildCardSchema());

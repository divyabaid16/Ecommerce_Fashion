const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: String,
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
});

module.exports = mongoose.model('Category', categorySchema);
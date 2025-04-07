const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: String,
  content: String,
  tags: [String],
});

module.exports = mongoose.model('Note', noteSchema);

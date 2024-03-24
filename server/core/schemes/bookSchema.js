const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookSchema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  year: Number,
  genres: [String], // массив строк
  isAvailable: { type: Boolean, default: true }
});

const Book = mongoose.model('Book', bookSchema);
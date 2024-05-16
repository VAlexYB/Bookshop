const { Schema, model } = require('mongoose');


const Book = new Schema({
  Title: { type: String, required: true },
  Author: { type: String, required: true },
  Year: Number,
  Genres: [String], // массив строк
  Exstension: String,
  IsOpen: { type: Boolean, default: true }, // книга из открытого каталога?
  Price: { type: Number, default: 0 },
  Description: { type: String, required: false }
});

module.exports = model('Book', Book);
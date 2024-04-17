const { Schema, model } = require('mongoose');


const Book = new Schema({
  Id: Number,
  Title: { type: String, required: true },
  Author: { type: String, required: true },
  Year: Date,
  Genres: [String], // массив строк
  Exstension: String,
  IsOpen: { type: Boolean, default: true } // книга из открытого каталога?
});

module.exports = model('Book', Book);
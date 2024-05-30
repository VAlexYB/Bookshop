const { Schema, model } = require('mongoose');


const Book = new Schema({
  Title: { type: String, required: true },
  Author: {
    type: Schema.Types.ObjectId,
    ref: 'Author',
    required: true,
    unique: true
  },
  Year: Number,
  Genres: [{type: String, ref: 'Genre'}], // массив строк
  Extension: String,
  IsOpen: { type: Boolean, default: true }, // книга из открытого каталога?
  Price: { type: Number, default: 0 },
  Description: { type: String, required: false },
  IsDeleted : { type: Boolean, default: false}
});

module.exports = model('Book', Book);
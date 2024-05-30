const { Schema, model } = require('mongoose');


const Author = new Schema({
  fullname: {type: String, unique: true },
  isDeleted: {type: Boolean, default: false}
});

module.exports = model('Author', Author);
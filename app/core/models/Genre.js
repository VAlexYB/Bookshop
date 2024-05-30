const { Schema, model } = require('mongoose');


const Genre = new Schema({
  value: {type: String, unique: true },
  isDeleted: {type: Boolean, default: false}
});

module.exports = model('Genre', Genre);
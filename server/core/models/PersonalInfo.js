const { Schema, model } = require('mongoose');


const PersonalInfo = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  surname: { type: String, required: false },
  name: { type: String, required: false },
  patronimyc: { type: String, required: false },
  nickname: { type: String, required: false },
  dateOfBirth: { type: Date, required: false },
  email: {type: String, required: true },
  phone: { type: String, required: false },
  cardIdFirstDigits: { type: String, required: false },
  cardIdLastDigits: { type: String, required: false },
  hasLinkedCard: { type: Boolean, required: true },
  hasAccess: { type: Boolean, required: true }
});

module.exports = model('PersonalInfo', PersonalInfo);
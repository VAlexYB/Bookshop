const { Schema, model } = require('mongoose');


const Storage = new Schema({
    book: {
        type: Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    amount: { type: Number, required: true },
    price: { type: Number, required: true } //цена на данный момент
});

module.exports = model('Storage', Storage);
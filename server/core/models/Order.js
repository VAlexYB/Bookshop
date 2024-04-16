const { Schema, model } = require('mongoose');


const Order = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    book: {
        type: Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    creationDate: Date = new Date()
});

module.exports = model('Book', Book);
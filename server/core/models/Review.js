const { Schema, model } = require('mongoose');

const Review = new Schema({
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
    content: { type: String, required: true },
    rating: { type: Number, required: true },
    creationDate: Date = new Date()
});

module.exports = model('Review', Review);
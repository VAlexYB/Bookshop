const { Schema, model } = require('mongoose');


const Cart = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    books: [{
        type: Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    }],
});

module.exports = model('Cart', Cart);
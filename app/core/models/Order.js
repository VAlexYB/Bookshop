const { Schema, model } = require('mongoose');


const Order = new Schema({
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
    creationDate: { type: Date, default: new Date()},
    editDate: Date,
    status: Number,
    price: Number,
    recipientFullname: String,
    recipientPhone: String
});

module.exports = model('Order', Order);
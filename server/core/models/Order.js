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
    id: Number,
    creationDate: Date = new Date(),
    editDate: Date,
    deliveryAddress: String,
    status: String,
    price: Number,
    recipientFullname: String,
    recipientPhone: String
});

module.exports = model('Order', Order);
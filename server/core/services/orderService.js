const Order = require('../models/Order');
const UserError = require('../customError');
const { ObjectId } = require('mongodb');

class OrderService {
    
    async create(data) {
        try {
            const order = new Order({
                user: data.userId,
                book: data.bookId,
                editDate: new Date(),
                deliveryAddress: data.address,
                status: 1,
                price: data.price,
                recipientFullname: data.recipient,
                recipientPhone: data.phone
            });
            
            await order.save();
            return order._id;
        } catch (error) {
            throw error;
        }
    }
    
    async delete(id) {
        try {
            const order = await Order.findByIdAndDelete(id);
            if (!order) {
                return Error("Попытка удаления заказа с несуществующим id OrderService.delete")
            }
            return order.book;
        } catch (error) {
            throw error;
        }
    }

    async getFilteredOrders(filter) {
        try {
            const userId = new ObjectId(filter.userId);
            let aggregationPipeline = [
                {
                    $lookup: {
                        from: 'books',
                        localField: 'book',
                        foreignField: '_id',
                        as: 'bookDetails'
                    }
                },
                {
                    $addFields: {
                        status: '$status',
                        deliveryAddress: '$deliveryAddress',
                        editDate: '$editDate',
                        creationDate: '$creationDate',
                        price: '$price',
                        bookId: { $arrayElemAt: ['$bookDetails._id', 0] },
                        bookTitle: { $arrayElemAt: ['$bookDetails.Title', 0] },
                        author: { $arrayElemAt: ['$bookDetails.Author', 0] },
                        extension: { $arrayElemAt: ['$bookDetails.Extension', 0] }
                    }
                },
                {
                    $match: {
                        user: userId
                    }
                },
                {
                    $project: {
                        _id: 1,
                        bookId: 1,
                        status: 1,
                        deliveryAddress: 1,
                        editDate: 1,
                        creationDate: 1,
                        price: 1,
                        bookTitle: 1,
                        author: 1,
                        extension: 1
                    }
                }
            ];
            
            if(filter.status) {
                aggregationPipeline.push({
                    $match: {
                        status : { $in: [filter.status] }
                    }
                });
            }
            
            if (filter.page && filter.pageSize) {
                const skip = (filter.page - 1) * filter.pageSize;
                aggregationPipeline.push({ $skip: skip });
                aggregationPipeline.push({ $limit: filter.pageSize });
            }
            let orders = await Order.aggregate(aggregationPipeline);
            return orders;
        } catch (error) {
            throw error;
        }
    } 
}
module.exports = new OrderService();
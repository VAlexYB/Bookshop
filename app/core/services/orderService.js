const Order = require('../models/Order');
const Book = require('../models/Book');
const CartService = require('../services/cartService');
const UserError = require('../customError');
const { ObjectId } = require('mongodb');

class OrderService {
    
    async create(data) {
        try {
            const bookIds = await CartService.getCartBookIds(data.userId);
            const order = new Order({
                user: data.userId,
                books: bookIds,
                editDate: new Date(),
                status: 1,
                price: data.price,
                recipientFullname: data.recipient,
                recipientPhone: data.phone
            });
            
            await order.save();
            await CartService.removeCart(data.userId);
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
            return order.books;
        } catch (error) {
            throw error;
        }
    }

    async getFilteredOrders(filter) {
        try {
            const userId = filter.userId;
            let query = { user: userId };

            if(filter.status) {
                query.status = filter.status;
            }
            

            let orders;
            if (filter.page && filter.pageSize) {
                const skip = (filter.page - 1) * filter.pageSize;
                orders = await Order.find(query)
                .populate({
                    path: 'books',
                    populate: { path: 'Author', model: 'Author' }
                })
                .skip(skip)
                .limit(filter.pageSize);
            } else {
                orders = await Order.find(query).populate({
                    path: 'books',
                    populate: { path: 'Author', model: 'Author' }
                });
            }
            
            if (!orders || orders.length === 0) {
                throw new Error('Заказы не найдены');
            }

            const orderSummary = orders.map(order => {
                const bookCountMap = {};
    
                order.books.forEach(book => {
                    if (bookCountMap[book._id]) {
                        bookCountMap[book._id].count += 1;
                    } else {
                        bookCountMap[book._id] = {
                            _id: book._id,
                            title: book.Title,
                            extension: book.Extension,
                            author: book.Author ? book.Author.fullname : '',
                            count: 1
                        };
                    }
                });
    
                return {
                    _id: order._id,
                    status: order.status,
                    editDate: order.editDate,
                    creationDate: order.creationDate,
                    price: order.price,
                    books: Object.values(bookCountMap)
                };
            });
    
            return orderSummary;
        } catch (error) {
            throw error;
        }
    } 
}
module.exports = new OrderService();
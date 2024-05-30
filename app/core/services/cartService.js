const Cart = require('../models/Cart');
const Book = require('../models/Book');
const Storage = require('../models/Storage');
const UserError = require('../customError');
const { ObjectId } = require('mongodb');

class CartService {
    async addToCart(data) {
        try {
            const userId = data.userId;
            const bookId = data.bookId;
            const cart = await Cart.findOne({ user: userId });
            if (!cart) {
                const newCart = new Cart({
                    user: userId,
                    books: [bookId]
                });
                await newCart.save();
            } else {
                cart.books.push(bookId);
                await cart.save();
            }
            return true;
        } catch (error) {
            return error;
        }
    }
    

    async removeFromCart(data) {
        try {
            const userId = data.userId;
            const bookId = data.bookId;
            const cart = await Cart.findOne({ user: userId });
            if (!cart) {
                return new Error('Корзина не найдена');
            }
            const index = cart.books.indexOf(bookId);
            if (index !== -1) {
                cart.books.splice(index, 1);
                await cart.save();
                return true;
            } else {
                return new Error('Книга не найдена в корзине');
            }
        } catch (error) {
            return error;
        }
    }

    async getCartSummary(userId) {
        try {
            const cart = await Cart.findOne({ user: userId }).populate('books');
            if (!cart) {
                return new Error('Корзина не найдена');
            }

            const bookSummary = {};

            for (const bookIdObj of cart.books) {
                const bookId = bookIdObj._id.toString();
                if (!bookSummary[bookId]) {
                    bookSummary[bookId] = { count: 0, totalPrice: 0,  title: '', extension: '', author: '' };
                }
                bookSummary[bookId].count += 1;
            }

            let totalAmount = 0;
            for (const bookId of Object.keys(bookSummary)) {
                const book = await Book.findById(bookId).populate('Author');
                const storage = await Storage.findOne({ book: bookId });

                if (book && storage) {
                    bookSummary[bookId].title = book.Title;
                    bookSummary[bookId].extension = book.Extension;
                    bookSummary[bookId].author = book.Author.fullname;
                    bookSummary[bookId].totalPrice = storage.price * bookSummary[bookId].count;
                    totalAmount += bookSummary[bookId].totalPrice;
                } else {
                    throw new Error(`Книга с id = ${bookId} не найдена в хранилище`);
                }
            }

            return { bookSummary, totalAmount };
        } catch (error) {
            return error;
        }
    }

    async getTotalCost(userId) {
        try {
            const cart = await Cart.findOne({ user: userId }).populate('books');
            if (!cart) {
                throw new Error('Корзина не найдена');
            }
    
            let totalAmount = 0;
    
            for (const bookIdObj of cart.books) {
                const bookId = bookIdObj._id.toString();
                const storage = await Storage.findOne({ book: bookId });
                if (!storage) {
                    throw new Error(`Хранилище для книги с id = ${bookId} не найдено`);
                }
                totalAmount += storage.price;
            }
            return totalAmount;
        } catch (error) {
            throw error;
        }
    }

    async getCartBookIds(userId) {
        try {
            const cart = await Cart.findOne({ user: userId }).select('books');
            if (!cart) {
                throw new Error('Корзина не найдена');
            }
            const bookIds = cart.books.map(book => book._id.toString());
            return bookIds;
        } catch (error) {
            throw error;
        }
    }

    async removeCart(userId) {
        try {
            const result = await Cart.findOneAndDelete({ user: userId });
            if (!result) {
                throw new Error('Корзина не найдена');
            }
        }
        catch (error) {
            throw error;
        }
    }
}
module.exports = new CartService();

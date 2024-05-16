const Book = require('../models/Book');
const UserError = require('../customError');

class BookService {

    async getBooks(page, pageSize) {
        try {
            const skip = (page - 1) * pageSize;
            const books =  await Book.find().skip(skip).limit(pageSize);
            return books;
        } catch (error) {
            throw error;
        }
    }
    
    async getFilteredBooks(filter) {
        try {
            let query = {};

            if(filter.term) {
                query.Title = { $regex: filter.term, $options: 'i' };
            }
            
            if(filter.genre) {
                query.Genres = { $in: [filter.genre] };
            }
        
            let books;
            if (filter.page && filter.pageSize) {
                const skip = (filter.page - 1) * filter.pageSize;
                books = await Book.find(query).skip(skip).limit(filter.pageSize);
            } else {
                books = await Book.find(query);
            }
            return books;
        } catch (error) {
            throw error;
        }
    } 
    
    async getById(id) {
        try {
            const book = await Book.findById(id);
            return book;
        } catch (error) {
            throw error;
        }
    }
    
    async createOrEdit(data) {
        try {
            const book = data.bookId ? await Book.findById(data.bookId) : new Book();
            if (!data.bookId) {
                const existBook = await Book.findOne({ Title: data.title, Author: data.author });
                if(existBook) {
                    throw new UserError('У этого автора уже задана книга с таким названием');
                }
            }
            
            book.Title = data.title;
            book.Author = data.author; 
            book.Genres = [data.genres];
            book.Year = data.year;      
            book.Price = data.price;
            book.IsOpen = !(data.price && data.price !== 0);
            
            await book.save();
            return true;
        } catch (error) {
            throw error;
        }
    }
    
    async delete(id) {
        try {
            await Book.findByIdAndDelete(id);
            return true;
        } catch (error) {
            throw error;
        }
    }
}
module.exports = new BookService();
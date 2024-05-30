const Author = require('../models/Author');
const Book = require('../models/Book');
const UserError = require('../customError');

class AuthorService {

    async getAuthors(data) {
        try {
            let query = { isDeleted: false }; 

            if (data.term) { 
                query.fullname = { $regex: data.term, $options: 'i' };
            }

            const authors = await Author.find(query).select('-isDeleted');
            return authors;
        } catch (error) {
            throw error;
        }
    }
    
    
    async create(data) {
        try {
            const existAuthor = await Author.findOne({ fullname: data.fullname });
            if(existAuthor && !existAuthor.isDeleted) {
                throw new UserError('Автор уже существует');
            }

            if(existAuthor && existAuthor.isDeleted) {
                existAuthor.isDeleted = false;
                await existAuthor.save();
                return true;
            }

            const author = new Author({
                fullname: data.fullname
            });

            await author.save();
            return true;
        } catch (error) {
            throw error;
        }
    }
    
    async delete(id) {
        try {
            const author = await Author.findById(id);
            if (!author) {
                throw new Error(`Авторы с id=${id} не найден`);
            }

            const booksUsingAuthor = await Book.find({ Author: id });
            if (booksUsingAuthor.length === 0) {
                await Author.findByIdAndDelete(id);
                return true;
            } else {
                author.isDeleted = true;
                await author.save();
                return true;
            }
        } catch (error) {
            throw error;
        }
    }
}
module.exports = new AuthorService();
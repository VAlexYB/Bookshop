const path = require('path');
const fs = require('fs');
const Book = require('../models/Book')
const UserError = require('../customError');

class FileService {
    async upload(data) {
        try {
            const file = data.file;
            const choice = data.choice;
            const bookId = data.bookId;

            const book = await Book.findById(bookId);
            if (!book) {
                throw new Error(`Книга с id = ${bookId} не обнаружена`);
            }

            const extension = path.extname(file.name);

            let filePath;
            if (choice === 'cover') {
                filePath = path.join(__dirname, '..', '..', 'public', 'images', 'covers', `${bookId}${extension}`); 
            } else if (choice === 'book') {
                filePath = path.join(__dirname, '..', '..', 'public', 'books', `${bookId}${extension}`); 
            } else {
                throw new UserError('Ошибка при выборе типа файла'); 
            }

            try {
                await fs.promises.writeFile(filePath, file.data); 
                book.Extension = extension.slice(1);
                await book.save();
                return true;
            } catch (err) {
                throw new Error('Ошибка при сохранении файла');
            }
            return true;
        } catch (error) {
            throw error;
        }
    }
}
module.exports = new FileService();
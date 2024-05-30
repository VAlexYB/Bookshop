const Genre = require('../models/Genre');
const Book = require('../models/Book');
const UserError = require('../customError');

class GenreService {

    async getGenres() {
        try {
            const genres = await Genre.find({ isDeleted: false }).select('-isDeleted');
            return genres;
        } catch (error) {
            throw error;
        }
    }
    
    
    async create(data) {
        try {
            const existGenre = await Genre.findOne({ value: data.name });
            if(existGenre && !existGenre.isDeleted) {
                throw new UserError('Жанр уже существует');
            }

            if(existGenre && existGenre.isDeleted) {
                existGenre.isDeleted = false;
                await existGenre.save();
                return true;
            }

            const genre = new Genre({
                value: data.name
            });

            await genre.save();
            return true;
        } catch (error) {
            throw error;
        }
    }
    
    async delete(id) {
        try {
            const genre = await Genre.findById(id);
            if (!genre) {
                throw new Error(`Жанр с id=${id} не найден`);
            }
            const booksUsingGenre = await Book.find({ Genres: genre.value });
            if (booksUsingGenre.length === 0) {
                await Genre.findByIdAndDelete(id);
                return true;
            } else {
                genre.isDeleted = true;
                await genre.save();
                return true;
            }
        } catch (error) {
            throw error;
        }
    }
}
module.exports = new GenreService();
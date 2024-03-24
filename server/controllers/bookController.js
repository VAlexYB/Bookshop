const BookService = require('../core/services/bookService');




const bookService = new BookService();

exports.getBooks = async (req, res) => {
    try {
        const books = await bookService.getBooks();
        res.json(books);
      } catch (error) {
        res.status(500).send(error.toString());
      }
  }
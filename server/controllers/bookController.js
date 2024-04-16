const Book = require('../core/models/Book')

class BookController {  
  async getBooks(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 20;

      const skip = (page - 1) * pageSize;
      const books =  await Book.find().skip(skip).limit(pageSize);
      res.json(books);
    } catch (error) {
      res.status(500).send(error.toString());
    }
  }

  getById = async (req, res) => {
    try {
      const id = parseInt(req.query.id);

      const book = await Book.findOne({Id: id});
      res.json(book);
    } catch (error) {
      res.status(500).send(error.toString());
    }
  }
}

module.exports = new BookController();


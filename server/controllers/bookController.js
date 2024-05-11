const BookService = require('../core/services/bookService')

class BookController {  
  async getBooks(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 20;
      const books =  await BookService.getBooks(page, pageSize);
      res.json(books);
    } catch (error) {
      if(error.isUserError) {
        return res.json({ message: error.message });
      }
      else {
        console.log(error);
      }
    }
  }

  async getFilteredBooks(req, res) {
    try {
      const filter = req.body;
      const books = await BookService.getFilteredBooks(filter);
      res.json(books);
    } catch (error) {
      if(error.isUserError) {
        return res.json({ message: error.message });
      }
      else {
        console.log(error);
      }
    }
  } 

  async getById(req, res) {
    try {
      const id = req.query.id;
      const book = await BookService.getById(id);
      res.json(book);
    } catch (error) {
      if(error.isUserError) {
        return res.json({ message: error.message });
      }
      else {
        console.log(error);
      }
    }
  }

  async createOrEdit(req, res) {
    try {
      const data = req.body;
      const result = await BookService.createOrEdit(data);
      if(result) {
        return res.json({ message: data.bookId ? "Книга успешно обновлена" : "Книга успешно добавлена" });
      }
      return res.json({ message: "Неизвестная ошибка"});
    } catch (error) {
      if(error.isUserError) {
        return res.json({ message: error.message });
      }
      else {
        console.log(error);
      }
    }
  }

  async delete(req, res) {
    try {
      const id = req.query.id;
      const result = await BookService.delete(id);
      if(result) {
        return res.json({ message: "Книга успешно удалена" });
      }
      return res.json({ message: "Неизвестная ошибка" });
    } catch (error) {
      if(error.isUserError) {
        return res.json({ message: error.message });
      }
      else {
        console.log(error);
      }
    }
  }
}

module.exports = new BookController();


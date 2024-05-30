const AuthorService = require('../core/services/authorService')

class AuthorController {  
  async getAuthors(req, res) {
    try {
      const data = req.body;  
      const authors =  await AuthorService.getAuthors(data);
      res.json(authors);
    } catch (error) {
      if(error.isUserError) {
        return res.json({ message: error.message });
      }
      else {
        console.log(error);
      }
    }
  }

  async create(req, res) {
    try {
      const data = req.body;
      const result = await AuthorService.create(data);
      if(result) {
        return res.json({ message: "Автор успешно добавлен" });
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
      console.log(id);
      const result = await AuthorService.delete(id);
      if(result) {
        return res.json({ message: "Автор успешно удален" });
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

module.exports = new AuthorController();


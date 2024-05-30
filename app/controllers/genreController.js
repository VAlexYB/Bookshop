const GenreService = require('../core/services/genresService')

class GenreController {  
  async getGenres(req, res) {
    try {
      const genres =  await GenreService.getGenres();
      res.json(genres);
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
      const result = await GenreService.create(data);
      if(result) {
        return res.json({ message: "Жанр успешно добавлен" });
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
      const result = await GenreService.delete(id);
      if(result) {
        return res.json({ message: "Жанр успешно удален" });
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

module.exports = new GenreController();


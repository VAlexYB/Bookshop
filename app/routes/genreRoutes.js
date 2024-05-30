const express = require('express');
const router = express.Router();
const roleMiddleware = require('../middleware/roleMiddleware');
const genreController = require('../controllers/genreController');


router.get('/genres', genreController.getGenres);
router.post('/addGenre', genreController.create);
router.get('/deleteGenre', genreController.delete);

module.exports = router;
const express = require('express');
const router = express.Router();
const roleMiddleware = require('../middleware/roleMiddleware');
const bookController = require('../controllers/bookController');

router.get('/books', bookController.getBooks);
router.post('/filteredBooks', bookController.getFilteredBooks);
router.get('/bookById', bookController.getById);
router.post('/addBook',  bookController.createOrEdit);
router.get('/deleteBook', bookController.delete);

module.exports = router;
const express = require('express');
const router = express.Router();
const roleMiddleware = require('../middleware/roleMiddleware');
const authorController = require('../controllers/authorController');


router.post('/authors', authorController.getAuthors);
router.post('/addAuthor', authorController.create);
router.get('/deleteAuthor', authorController.delete);

module.exports = router;
const express = require('express');
const router = express.Router();
const roleMiddleware = require('../middleware/roleMiddleware');
const bookController = require('../controllers/bookController');
const authController = require('../controllers/authController');
const userInfoController = require('../controllers/userInfoController');


router.post('/registration', authController.registration);
router.post('/login', authController.login);
router.get('/users', roleMiddleware(['ADMIN']), userInfoController.getUsers);
router.get('/books', bookController.getBooks);
router.get('/bookById', bookController.getById);

module.exports = router;
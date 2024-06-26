const express = require('express');
const router = express.Router();
const roleMiddleware = require('../middleware/roleMiddleware');
const { bookController, authController, userInfoController, fileController } = require('../controllers');
const storageController = require('../controllers/storageController');
const orderController = require('../controllers/orderController');


router.post('/registration', authController.registration);
router.post('/login', authController.login);
router.post('/addManager', roleMiddleware(['ADMIN']), authController.directMgrRegistration);
router.get('/deleteManager', roleMiddleware(['ADMIN']), authController.removeMgrProfile);

router.get('/users', roleMiddleware(['ADMIN']), userInfoController.getUsers);
router.get('/managers', roleMiddleware(['ADMIN']), userInfoController.getManagers);

router.get('/books', bookController.getBooks);
router.post('/filteredBooks', bookController.getFilteredBooks);
router.get('/bookById', bookController.getById);
router.post('/addBook',  bookController.createOrEdit);
router.get('/deleteBook', bookController.delete);

router.post('/upload', fileController.addFile);

router.post('/addSupply', storageController.addSupply);
router.post('/filteredStorages', storageController.getStorages);
router.post('/setPrice', storageController.setPrice);

router.get('/createOrder', roleMiddleware(['USER']), orderController.create);
router.get('/cancelOrder', roleMiddleware(['USER']), orderController.cancel);
router.post('/confirmOrder', roleMiddleware(['USER']), orderController.confirm);
router.post('/filteredOrders', roleMiddleware(['USER']), orderController.getFilteredOrders);
router.get('/deleteOrder', roleMiddleware(['USER']), orderController.delete);
module.exports = router;
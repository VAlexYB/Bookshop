const express = require('express');
const router = express.Router();
const roleMiddleware = require('../middleware/roleMiddleware');
const userInfoController = require('../controllers/userInfoController');

router.get('/users', roleMiddleware(['ADMIN']), userInfoController.getUsers);
router.get('/managers', roleMiddleware(['ADMIN']), userInfoController.getManagers);
router.get('/userInfo', roleMiddleware(['USER']), userInfoController.getById);
router.post('/editUserInfo', roleMiddleware(['USER']), userInfoController.changeProfile);
router.get('/buyerInfo', roleMiddleware(['USER']), userInfoController.getBuyerInfo);
module.exports = router;
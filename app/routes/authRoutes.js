const express = require('express');
const router = express.Router();
const roleMiddleware = require('../middleware/roleMiddleware');
const authController = require('../controllers/authController');

router.post('/registration', authController.registration);
router.post('/login', authController.login);
router.post('/addManager', roleMiddleware(['ADMIN']), authController.directMgrRegistration);
router.get('/deleteManager', roleMiddleware(['ADMIN']), authController.removeMgrProfile);

module.exports = router;
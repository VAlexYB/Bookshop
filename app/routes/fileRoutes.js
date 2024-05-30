const express = require('express');
const router = express.Router();
const roleMiddleware = require('../middleware/roleMiddleware');
const fileController = require('../controllers/fileController');


router.post('/upload', fileController.addFile);



module.exports = router;
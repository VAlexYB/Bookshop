const express = require('express');
const router = express.Router();
const roleMiddleware = require('../middleware/roleMiddleware');
const storageController = require('../controllers/storageController');


router.post('/addSupply', storageController.addSupply);
router.post('/filteredStorages', storageController.getStorages);
router.post('/setPrice', storageController.setPrice);

module.exports = router;
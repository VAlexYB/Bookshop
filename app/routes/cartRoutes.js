const express = require('express');
const router = express.Router();
const roleMiddleware = require('../middleware/roleMiddleware');
const cartController = require('../controllers/cartController');

router.get('/addToCart', roleMiddleware(['USER']), cartController.addToCart);
router.get('/removeFromCart', roleMiddleware(['USER']), cartController.removeFromCart);
router.get('/getSummary', roleMiddleware(['USER']), cartController.getCartSummary);

module.exports = router;
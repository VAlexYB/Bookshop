const express = require('express');
const router = express.Router();
const roleMiddleware = require('../middleware/roleMiddleware');
const orderController = require('../controllers/orderController');

router.post('/confirmOrder', roleMiddleware(['USER']), orderController.confirm);
router.post('/filteredOrders', roleMiddleware(['USER']), orderController.getFilteredOrders);
router.get('/deleteOrder', roleMiddleware(['USER']), orderController.delete);

module.exports = router;
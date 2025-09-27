const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const vendorAuth = require('../middleware/auth');

// User routes (protected)
router.post('/', vendorAuth, orderController.createOrder);
router.get('/', vendorAuth, orderController.getUserOrders);

// Vendor routes (protected)
router.patch('/:orderId/status', vendorAuth, orderController.updateOrderStatus);

module.exports = router;
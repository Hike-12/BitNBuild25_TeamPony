const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth'); // Use the same auth middleware

// User routes (protected)
router.post('/', auth, orderController.createOrder);
router.get('/', auth, orderController.getUserOrders);
router.get('/vendor', auth, orderController.getVendorOrders);

// Vendor routes (protected)
router.patch('/:orderId/status', auth, orderController.updateOrderStatus);

module.exports = router;
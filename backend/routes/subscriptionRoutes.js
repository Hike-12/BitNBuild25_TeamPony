const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const auth = require('../middleware/auth'); // Use the same auth middleware

// User routes (protected)
router.post('/', auth, subscriptionController.createSubscription);
router.get('/', auth, subscriptionController.getUserSubscriptions);
router.patch('/:subscriptionId/status', auth, subscriptionController.updateSubscriptionStatus);

// Vendor routes - if you haven't implemented getVendorSubscriptions, comment this out for now
// router.get('/vendor', auth, subscriptionController.getVendorSubscriptions);

module.exports = router;
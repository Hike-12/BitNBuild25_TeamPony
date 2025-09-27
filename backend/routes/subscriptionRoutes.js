const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const userAuth = require('../middleware/auth');

// All routes are user-protected
router.use(userAuth);

router.post('/', subscriptionController.createSubscription);
router.get('/', subscriptionController.getUserSubscriptions);
router.patch('/:subscriptionId/status', subscriptionController.updateSubscriptionStatus);

module.exports = router;
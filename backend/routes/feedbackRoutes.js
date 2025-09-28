const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

// No auth middleware needed since we're hardcoding the user ID
router.post('/orders/:orderId', feedbackController.createFeedback);
router.get('/user', feedbackController.getUserFeedbacks);
router.get('/vendors/:vendorId', feedbackController.getVendorFeedbacks);

module.exports = router;
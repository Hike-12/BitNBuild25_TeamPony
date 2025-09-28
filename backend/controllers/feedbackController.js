// controllers/feedbackController.js - With hardcoded user ID
const Feedback = require('../models/Feedback');
const Order = require('../models/Order');

exports.createFeedback = async (req, res) => {
  try {
    // HARDCODED USER ID
    const userId = '68d81c38257f975d59bc9cf3';
    
    const { orderId } = req.params;
    const { rating, comment } = req.body;

    // Check if order exists and is delivered
    const order = await Order.findOne({ 
      _id: orderId, 
      customer: userId,
      order_status: 'delivered'
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found or not delivered yet'
      });
    }

    // Check if feedback already exists
    const existingFeedback = await Feedback.findOne({ order: orderId });
    if (existingFeedback) {
      return res.status(400).json({
        success: false,
        error: 'Feedback already submitted'
      });
    }

    // Create feedback
    const feedback = await Feedback.create({
      order: orderId,
      customer: userId,
      vendor: order.vendor,
      menu: order.menu,
      rating,
      comment
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for your feedback!',
      feedback
    });

  } catch (error) {
    console.error('Create feedback error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.getUserFeedbacks = async (req, res) => {
  try {
    // HARDCODED USER ID
    const userId = '68d81c38257f975d59bc9cf3';
    
    const { page = 1, limit = 10 } = req.query;

    const feedbacks = await Feedback.find({ customer: userId })
      .populate('vendor', 'business_name')
      .populate('menu', 'name')
      .populate('order', 'delivery_date total_amount')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Feedback.countDocuments({ customer: userId });

    res.json({
      success: true,
      feedbacks,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(total / limit),
        total_feedbacks: total
      }
    });

  } catch (error) {
    console.error('Get user feedbacks error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.getVendorFeedbacks = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const feedbacks = await Feedback.find({ vendor: vendorId })
      .populate('customer', 'first_name last_name')
      .populate('menu', 'name')
      .populate('order', 'delivery_date total_amount')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      feedbacks
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

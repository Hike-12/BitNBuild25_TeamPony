const Subscription = require('../models/Subscription');
const TiffinVendor = require('../models/TiffinVendor');

exports.createSubscription = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      vendor_id,
      plan_type,
      meal_preferences,
      delivery_address,
      delivery_time_slot,
      delivery_days,
      start_date,
      end_date,
      price_per_meal,
      special_instructions
    } = req.body;

    // Validate required fields
    if (!vendor_id || !plan_type || !delivery_address || !delivery_time_slot || 
        !delivery_days?.length || !start_date || !end_date || !price_per_meal) {
      return res.status(400).json({
        success: false,
        error: 'All subscription details are required'
      });
    }

    // Check if vendor exists and is active
    const vendor = await TiffinVendor.findById(vendor_id);
    if (!vendor || !vendor.is_active) {
      return res.status(404).json({
        success: false,
        error: 'Vendor not found or inactive'
      });
    }

    // Calculate total meals and amount
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const weeksCount = Math.ceil(daysDiff / 7);
    const total_meals = delivery_days.length * weeksCount;
    const total_amount = total_meals * price_per_meal;

    // Create subscription
    const subscription = new Subscription({
      customer: userId,
      vendor: vendor_id,
      plan_type,
      meal_preferences,
      delivery_address,
      delivery_time_slot,
      delivery_days,
      start_date: startDate,
      end_date: endDate,
      price_per_meal,
      total_meals,
      total_amount,
      special_instructions
    });

    await subscription.save();

    // Populate subscription with vendor details
    const populatedSubscription = await Subscription.findById(subscription._id)
      .populate('vendor', 'business_name phone_number address');

    res.status(201).json({
      success: true,
      message: 'Subscription created successfully',
      subscription: populatedSubscription
    });

  } catch (error) {
    console.error('Create subscription error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.getUserSubscriptions = async (req, res) => {
  try {
    console.log('User ID:', req.user?._id); // Debug log
    
    const userId = req.user._id;
    const { status } = req.query;

    let filter = { customer: userId };
    if (status) filter.subscription_status = status;

    console.log('Filter:', filter); // Debug log

    const subscriptions = await Subscription.find(filter)
      .populate('vendor', 'business_name phone_number address')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      subscriptions: subscriptions || []
    });

  } catch (error) {
    console.error('Get user subscriptions error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.updateSubscriptionStatus = async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const { status } = req.body;
    const userId = req.user._id;

    const subscription = await Subscription.findOne({ 
      _id: subscriptionId, 
      customer: userId 
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        error: 'Subscription not found'
      });
    }

    subscription.subscription_status = status;
    await subscription.save();

    res.json({
      success: true,
      message: 'Subscription status updated successfully',
      subscription
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.getVendorSubscriptions = async (req, res) => {
  try {
    const vendorId = req.vendor._id;
    const { status, limit = 100 } = req.query;

    let filter = { vendor: vendorId };
    if (status) filter.subscription_status = status;

    const subscriptions = await Subscription.find(filter)
      .populate('customer', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(limit * 1);

    res.json({
      success: true,
      subscriptions
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
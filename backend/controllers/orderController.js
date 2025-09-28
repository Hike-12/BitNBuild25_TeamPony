const Order = require('../models/Order');
const Menu = require('../models/Menu');
const TiffinVendor = require('../models/TiffinVendor');

exports.createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      menu_id,
      vendor_id,
      quantity,
      delivery_address,
      delivery_date,
      delivery_time_slot,
      special_instructions,
      payment_method
    } = req.body;

    // Validate required fields
    if (!menu_id || !vendor_id || !delivery_address || !delivery_date || !delivery_time_slot) {
      return res.status(400).json({
        success: false,
        error: 'Menu, vendor, delivery address, date, and time slot are required'
      });
    }

    // Get menu details
    const menu = await Menu.findById(menu_id).populate('vendor');
    if (!menu) {
      return res.status(404).json({
        success: false,
        error: 'Menu not found'
      });
    }

    // Check if vendor is active and verified
    if (!menu.vendor.is_active || !menu.vendor.is_verified) {
      return res.status(400).json({
        success: false,
        error: 'Vendor is not available for orders'
      });
    }

    // Check menu availability
    if (!menu.is_active) {
      return res.status(400).json({
        success: false,
        error: 'This menu is no longer available'
      });
    }

    // Check if there are enough dabbas available
    const remainingDabbas = menu.max_dabbas - menu.dabbas_sold;
    if (remainingDabbas < quantity) {
      return res.status(400).json({
        success: false,
        error: `Only ${remainingDabbas} dabbas available`
      });
    }

    // Calculate total amount
    const total_amount = menu.full_dabba_price * quantity;

    // Create order
    const order = new Order({
      customer: userId,
      vendor: vendor_id,
      menu: menu_id,
      quantity,
      total_amount,
      delivery_address,
      delivery_date: new Date(delivery_date),
      delivery_time_slot,
      special_instructions,
      payment_method
    });

    await order.save();

    // Update menu dabbas_sold count
    menu.dabbas_sold += quantity;
    await menu.save();

    // Populate order with menu and vendor details
    const populatedOrder = await Order.findById(order._id)
      .populate('menu')
      .populate('vendor', 'business_name phone_number address');

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order: populatedOrder
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};



// Add to orderController.js
exports.getVendorOrders = async (req, res) => {
  try {
    const vendorId = req.vendor._id;
    const { status, limit = 10, page = 1 } = req.query;

    let filter = { vendor: vendorId };
    if (status && status !== 'all') filter.order_status = status;

    const orders = await Order.find(filter)
      .populate('customer', 'name email phone')
      .populate('menu', 'name full_dabba_price date')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      orders,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(total / limit),
        total_orders: total
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const { status, limit = 10, page = 1 } = req.query;

    let filter = { customer: userId };
    if (status) filter.order_status = status;

    const orders = await Order.find(filter)
      .populate('menu', 'name full_dabba_price date')
      .populate('vendor', 'business_name phone_number address')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      orders,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(total / limit),
        total_orders: total
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const vendorId = req.vendor._id;

    const order = await Order.findOne({ _id: orderId, vendor: vendorId });
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    order.order_status = status;
    await order.save();

    res.json({
      success: true,
      message: 'Order status updated successfully',
      order
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};


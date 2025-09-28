const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const OrderTracking = require('../models/OrderTracking');
const auth = require('../middleware/auth');

// Consumer Routes - Get their order tracking
router.get('/consumer/:orderId', auth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id;

    // Verify order belongs to user
    const order = await Order.findOne({ 
      _id: orderId, 
      customer: userId 
    }).populate('vendor', 'business_name phone_number address')
      .populate('menu', 'name');

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    const tracking = await OrderTracking.findOne({ order: orderId });

    res.json({
      success: true,
      order: {
        id: order._id,
        order_number: `#ORD${order._id.toString().slice(-6).toUpperCase()}`,
        menu_name: order.menu?.name,
        vendor_name: order.vendor?.business_name,
        vendor_phone: order.vendor?.phone_number,
        vendor_address: order.vendor?.address,
        total_amount: order.total_amount,
        quantity: order.quantity,
        delivery_address: order.delivery_address,
        delivery_time_slot: order.delivery_time_slot,
        special_instructions: order.special_instructions,
        payment_method: order.payment_method,
        payment_status: order.payment_status,
        created_at: order.createdAt
      },
      tracking: tracking ? {
        current_status: tracking.current_status,
        estimated_delivery_time: tracking.estimated_delivery_time,
        actual_delivery_time: tracking.actual_delivery_time,
        delivery_person: tracking.delivery_person,
        current_location: tracking.current_location,
        delivery_route: tracking.delivery_route,
        progress_percentage: tracking.progress_percentage,
        delivery_instructions: tracking.delivery_instructions,
        status_history: tracking.status_history
      } : null
    });
  } catch (error) {
    console.error('Consumer tracking error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Consumer Routes - Get all their orders tracking
router.get('/consumer', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { status, limit = 10 } = req.query;

    let filter = { customer: userId };
    if (status) filter.order_status = status;

    const orders = await Order.find(filter)
      .populate('vendor', 'business_name phone_number address')
      .populate('menu', 'name')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    const ordersWithTracking = await Promise.all(
      orders.map(async (order) => {
        const tracking = await OrderTracking.findOne({ order: order._id });
        
        return {
          id: order._id,
          order_number: `#ORD${order._id.toString().slice(-6).toUpperCase()}`,
          menu_name: order.menu?.name,
          vendor_name: order.vendor?.business_name,
          vendor_phone: order.vendor?.phone_number,
          total_amount: order.total_amount,
          quantity: order.quantity,
          delivery_address: order.delivery_address,
          delivery_time_slot: order.delivery_time_slot,
          payment_status: order.payment_status,
          created_at: order.createdAt,
          current_status: tracking?.current_status || order.order_status,
          estimated_delivery_time: tracking?.estimated_delivery_time,
          delivery_person: tracking?.delivery_person,
          current_location: tracking?.current_location,
          progress_percentage: tracking?.progress_percentage || 0
        };
      })
    );

    res.json({
      success: true,
      orders: ordersWithTracking
    });
  } catch (error) {
    console.error('Consumer orders tracking error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Vendor Routes - Get all orders for their business
router.get('/vendor', auth, async (req, res) => {
  try {
    const vendorId = req.vendor._id;
    const { status, date, limit = 20 } = req.query;

    let filter = { vendor: vendorId };
    if (status) filter.order_status = status;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      filter.createdAt = { $gte: startDate, $lt: endDate };
    }

    const orders = await Order.find(filter)
      .populate('customer', 'first_name last_name username email')
      .populate('menu', 'name')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    const ordersWithTracking = await Promise.all(
      orders.map(async (order) => {
        const tracking = await OrderTracking.findOne({ order: order._id });
        
        return {
          id: order._id,
          order_number: `#ORD${order._id.toString().slice(-6).toUpperCase()}`,
          customer_name: `${order.customer?.first_name || ''} ${order.customer?.last_name || ''}`.trim() || order.customer?.username,
          customer_phone: order.customer?.phone || 'N/A',
          customer_email: order.customer?.email,
          menu_name: order.menu?.name,
          total_amount: order.total_amount,
          quantity: order.quantity,
          delivery_address: order.delivery_address,
          delivery_time_slot: order.delivery_time_slot,
          special_instructions: order.special_instructions,
          payment_method: order.payment_method,
          payment_status: order.payment_status,
          created_at: order.createdAt,
          current_status: tracking?.current_status || order.order_status,
          estimated_delivery_time: tracking?.estimated_delivery_time,
          delivery_person: tracking?.delivery_person,
          current_location: tracking?.current_location,
          progress_percentage: tracking?.progress_percentage || 0,
          status_history: tracking?.status_history || []
        };
      })
    );

    res.json({
      success: true,
      orders: ordersWithTracking
    });
  } catch (error) {
    console.error('Vendor orders tracking error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Vendor Routes - Update order tracking
router.post('/vendor/:orderId/update', auth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const vendorId = req.vendor._id;
    const {
      current_status,
      estimated_delivery_time,
      delivery_person,
      current_location,
      progress_percentage,
      delivery_instructions,
      notes
    } = req.body;

    // Verify order belongs to vendor
    const order = await Order.findOne({ 
      _id: orderId, 
      vendor: vendorId 
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Find or create tracking record
    let tracking = await OrderTracking.findOne({ order: orderId });
    
    if (!tracking) {
      tracking = new OrderTracking({
        order: orderId,
        current_status: current_status || order.order_status
      });
    }

    // Update tracking fields
    if (current_status) {
      tracking.current_status = current_status;
      order.order_status = current_status;
      
      // Add to status history
      tracking.status_history.push({
        status: current_status,
        notes: notes || '',
        updated_by: 'vendor'
      });

      // Set delivery time if status is delivered
      if (current_status === 'delivered') {
        tracking.actual_delivery_time = new Date();
        tracking.progress_percentage = 100;
      }
    }

    if (estimated_delivery_time) {
      tracking.estimated_delivery_time = new Date(estimated_delivery_time);
    }

    if (delivery_person) {
      tracking.delivery_person = {
        ...tracking.delivery_person,
        ...delivery_person
      };
    }

    if (current_location) {
      tracking.current_location = current_location;
      
      // Add to delivery route
      tracking.delivery_route.push({
        latitude: current_location.latitude,
        longitude: current_location.longitude,
        status: current_status || tracking.current_status
      });
    }

    if (progress_percentage !== undefined) {
      tracking.progress_percentage = Math.max(0, Math.min(100, progress_percentage));
    }

    if (delivery_instructions) {
      tracking.delivery_instructions = delivery_instructions;
    }

    await tracking.save();
    await order.save();

    res.json({
      success: true,
      message: 'Order tracking updated successfully',
      tracking: {
        current_status: tracking.current_status,
        estimated_delivery_time: tracking.estimated_delivery_time,
        delivery_person: tracking.delivery_person,
        current_location: tracking.current_location,
        progress_percentage: tracking.progress_percentage
      }
    });
  } catch (error) {
    console.error('Update tracking error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get live tracking data (for real-time updates)
router.get('/live', auth, async (req, res) => {
  try {
    const { orderIds } = req.query; // Comma-separated order IDs
    
    if (!orderIds) {
      return res.status(400).json({
        success: false,
        error: 'Order IDs required'
      });
    }

    const idsArray = orderIds.split(',');
    
    const trackingData = await OrderTracking.find({
      order: { $in: idsArray },
      is_active: true
    }).populate({
      path: 'order',
      select: 'customer vendor order_status',
      populate: {
        path: 'customer vendor',
        select: 'first_name last_name business_name'
      }
    });

    // Filter based on user role
    const filteredData = trackingData.filter(tracking => {
      if (req.user) {
        // Consumer - only their orders
        return tracking.order.customer._id.toString() === req.user._id.toString();
      } else if (req.vendor) {
        // Vendor - only their orders
        return tracking.order.vendor._id.toString() === req.vendor._id.toString();
      }
      return false;
    });

    res.json({
      success: true,
      trackingData: filteredData.map(tracking => ({
        order_id: tracking.order._id,
        current_status: tracking.current_status,
        current_location: tracking.current_location,
        progress_percentage: tracking.progress_percentage,
        estimated_delivery_time: tracking.estimated_delivery_time,
        delivery_person: tracking.delivery_person,
        last_updated: tracking.updatedAt
      }))
    });
  } catch (error) {
    console.error('Live tracking error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
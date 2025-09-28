const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'TiffinVendor', required: true },
  menu: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu', required: true },
  order_type: { type: String, enum: ['one_time', 'subscription'], default: 'one_time' },
  quantity: { type: Number, default: 1, min: 1 },
  total_amount: { type: Number, required: true },
  delivery_address: { type: String, required: true },
  delivery_date: { type: Date, required: true },
  delivery_time_slot: { 
    type: String, 
    enum: ['12:00-13:00', '13:00-14:00', '19:00-20:00', '20:00-21:00'],
    required: true 
  },
  special_instructions: { type: String, default: '' },
  payment_method: { 
    type: String, 
    enum: ['cod', 'upi', 'card', 'wallet'], 
    default: 'cod' 
  },
  payment_status: { 
    type: String, 
    enum: ['pending', 'paid', 'failed', 'refunded'], 
    default: 'pending' 
  },
  order_status: { 
    type: String, 
    enum: ['placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'], 
    default: 'placed' 
  },
  razorpay_order_id: { type: String },
  razorpay_payment_id: { type: String },
  payment_signature: { type: String },
  is_active: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
const mongoose = require('mongoose');

const OrderTrackingSchema = new mongoose.Schema({
  order: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Order', 
    required: true 
  },
  current_status: {
    type: String,
    enum: ['placed', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'placed'
  },
  estimated_delivery_time: { type: Date },
  actual_delivery_time: { type: Date },
  delivery_person: {
    name: { type: String },
    phone: { type: String },
    vehicle_number: { type: String }
  },
  current_location: {
    latitude: { type: Number },
    longitude: { type: Number },
    address: { type: String }
  },
  delivery_route: [{
    latitude: { type: Number },
    longitude: { type: Number },
    timestamp: { type: Date, default: Date.now },
    status: { type: String }
  }],
  progress_percentage: { type: Number, default: 0, min: 0, max: 100 },
  delivery_instructions: { type: String },
  status_history: [{
    status: { type: String },
    timestamp: { type: Date, default: Date.now },
    notes: { type: String },
    updated_by: { type: String } // 'system', 'vendor', 'delivery_person'
  }],
  is_active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('OrderTracking', OrderTrackingSchema);
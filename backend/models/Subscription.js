const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'TiffinVendor', required: true },
  plan_type: { 
    type: String, 
    enum: ['weekly', 'monthly', 'custom'],
    required: true 
  },
  meal_preferences: {
    is_veg_only: { type: Boolean, default: false },
    spice_level: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    avoid_ingredients: [{ type: String }],
  },
  delivery_address: { type: String, required: true },
  delivery_time_slot: { 
    type: String, 
    enum: ['12:00-13:00', '13:00-14:00', '19:00-20:00', '20:00-21:00'],
    required: true 
  },
  delivery_days: [{ 
    type: String, 
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] 
  }],
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  price_per_meal: { type: Number, required: true },
  total_meals: { type: Number, required: true },
  total_amount: { type: Number, required: true },
  meals_delivered: { type: Number, default: 0 },
  payment_status: { 
    type: String, 
    enum: ['pending', 'paid', 'partial', 'failed'], 
    default: 'pending' 
  },
  subscription_status: { 
    type: String, 
    enum: ['active', 'paused', 'cancelled', 'completed'], 
    default: 'active' 
  },
  auto_renewal: { type: Boolean, default: false },
  special_instructions: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Subscription', SubscriptionSchema);
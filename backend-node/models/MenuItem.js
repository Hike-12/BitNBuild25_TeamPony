const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'TiffinVendor', required: true },
  name: { type: String, required: true },
  category: { 
    type: String, 
    enum: [
      'roti_bread', 'sabzi', 'dal', 'rice_item', 'non_veg',
      'pickle_papad', 'sweet', 'drink', 'raita_salad'
    ],
    default: 'sabzi'
  },
  price: { type: Number, required: true },
  is_vegetarian: { type: Boolean, default: true },
  is_spicy: { type: Boolean, default: false },
  is_available_today: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', MenuItemSchema);
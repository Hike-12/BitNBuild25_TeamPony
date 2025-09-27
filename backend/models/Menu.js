const mongoose = require('mongoose');

const MenuSchema = new mongoose.Schema({
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'TiffinVendor', required: true },
  name: { type: String, required: true },
  date: { type: Date, required: true },
  image: { type: String }, // store image URL or filename
  main_items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' }],
  side_items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' }],
  extras: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' }],
  is_veg_only: { type: Boolean, default: true },
  full_dabba_price: { type: Number, required: true },
  max_dabbas: { type: Number, default: 30 },
  dabbas_sold: { type: Number, default: 0 },
  todays_special: { type: String, default: '' },
  cooking_style: { type: String, default: '' },
  is_active: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Menu', MenuSchema);
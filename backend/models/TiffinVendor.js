const mongoose = require('mongoose');

const TiffinVendorSchema = new mongoose.Schema({
  kitchen_name: { type: String, required: true },
  address: { type: String, required: true },
  phone_number: { type: String, required: true },
  license_number: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  is_verified: { type: Boolean, default: false },
  is_active: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('TiffinVendor', TiffinVendorSchema);
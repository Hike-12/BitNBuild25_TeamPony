const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  order: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Order', 
    required: true 
  },
  customer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  vendor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'TiffinVendor', 
    required: true 
  },
  menu: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Menu'
  },
  rating: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5 
  },
  comment: { 
    type: String, 
    maxlength: 500 
  },
  vendor_response: { 
    type: String, 
    maxlength: 500 
  },
  vendor_responded_at: { 
    type: Date 
  }
}, { timestamps: true });

// One feedback per order
FeedbackSchema.index({ order: 1 }, { unique: true });

module.exports = mongoose.model('Feedback', FeedbackSchema);
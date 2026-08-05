const mongoose = require('mongoose');

const assignedUserSchema = new mongoose.Schema({
  userId: { type: String, default: '' },
  name: { type: String, default: '' },
  phone: { type: String, default: '' }
}, { _id: false });

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Coupon code is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['Percentage', 'Flat'],
    default: 'Percentage'
  },
  value: {
    type: Number,
    required: [true, 'Discount value is required'],
    min: 0
  },
  minCartValue: {
    type: Number,
    default: 0
  },
  expirationDate: {
    type: String,
    default: ''
  },
  usageLimit: {
    type: mongoose.Schema.Types.Mixed,
    default: 'Unlimited'
  },
  usedCount: {
    type: Number,
    default: 0
  },
  restrictCategories: {
    type: String,
    default: ''
  },
  restrictProducts: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    default: 'Active (Live)'
  },
  description: {
    type: String,
    default: ''
  },
  assignedUsers: [assignedUserSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Coupon', couponSchema);

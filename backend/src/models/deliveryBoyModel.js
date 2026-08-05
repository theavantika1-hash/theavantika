const mongoose = require('mongoose');

const deliveryBoySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email address is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  otp: {
    type: String,
    default: null
  },
  otpExpiry: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'inactive', 'suspended'],
    default: 'pending'
  },

  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },

  vehicleType: {
    type: String,
    default: 'Bike'
  },
  vehicleNumber: {
    type: String,
    default: ''
  },
  dob: {
    type: String,
    default: ''
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', ''],
    default: ''
  },
  drivingLicenseNumber: {
    type: String,
    default: ''
  },
  licenseValidUpto: {
    type: String,
    default: ''
  },
  profileImage: {
    type: String,
    default: null
  },

  isOnline: {
    type: Boolean,
    default: true
  },
  preferredRangeKm: {
    type: Number,
    default: 32
  },
  bankAccount: {
    type: String,
    default: 'HDFC Bank •••• 4821 (Verified)'
  },

  location: {
    latitude: { type: Number, default: 0 },
    longitude: { type: Number, default: 0 },
    address: { type: String, default: '' },
    lastUpdated: { type: Date, default: Date.now }
  },
  documents: {
    drivingLicense: { type: String, default: null },
    idProof: { type: String, default: null },
    vehicleRC: { type: String, default: null }
  },
  currentOrderId: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },

  order_ids: [{
    type: mongoose.Schema.Types.Mixed,
    ref: 'Order'
  }],
  lastLogin: {

    type: Date,
    default: null
  }
}, {
  timestamps: true
});


const DeliveryBoy = mongoose.model('DeliveryBoy', deliveryBoySchema);
module.exports = DeliveryBoy;

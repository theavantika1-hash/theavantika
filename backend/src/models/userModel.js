const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  cartItemId: {
    type: String,
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  slug: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    default: 0
  },
  image: {
    type: String,
    default: null
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  },
  estimatedWeight: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Number,
    default: () => Date.now()
  },
  configuration: {
    metal: {
      type: String,
      default: ''
    },
    purity: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: ''
    },
    stone: {
      type: String,
      default: ''
    }
  },
  pricingBreakdown: {
    metalPrice: {
      type: Number,
      default: 0
    },
    makingCharges: {
      type: Number,
      default: 0
    },
    stonePrice: {
      type: Number,
      default: 0
    },
    subTotal: {
      type: Number,
      default: 0
    },
    gst: {
      type: Number,
      default: 0
    },
    totalPrice: {
      type: Number,
      default: 0
    },
    estimatedWeight: {
      type: Number,
      default: 0
    },
    estimatedGoldWeight: {
      type: Number,
      default: 0
    },
    estimatedStoneWeight: {
      type: Number,
      default: 0
    }
  }
}, { _id: false });

const addressSchema = new mongoose.Schema({
  fullName: { type: String, default: "" },
  name: { type: String, default: "" },
  phone: { type: String, default: "" },
  houseNo: { type: String, default: "" },
  building: { type: String, default: "" },
  landmark: { type: String, default: "" },
  area: { type: String, default: "" },
  addressLine: { type: String, default: "" },
  city: { type: String, default: "" },
  state: { type: String, default: "" },
  pincode: { type: String, default: "" },
  country: { type: String, default: "" },
  type: { type: String, default: "Home" },
  isDefault: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });


const userSchema = new mongoose.Schema({
  user_name: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  phone_number: {
    type: String,
    required: true,
    unique: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  otp: {
    type: String
  },
  otpExpiry: {
    type: Date
  },
  auth_key: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  onboardingCompleted: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date,
    default: null
  },
  addresses: [addressSchema],
  emailVerified: {
    type: Date,
    default: null
  },
  gender: {
    type: String,
    default: null
  },
  name: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    default: null
  },
  cart: [cartItemSchema],
  orderHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }],
  preferences: {
    preferredCurrency: {
      type: String,
      default: 'INR'
    }
  },
  recentlyViewed: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  wishlist: [{
     type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['active', 'suspended', 'inactive'],
    default: 'active'
  },
  authProvider: {
    type: String,
    default: 'email'
  },
  mobileVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true // Auto-handles createdAt and updatedAt
});

const User = mongoose.model('User', userSchema);
module.exports = User;

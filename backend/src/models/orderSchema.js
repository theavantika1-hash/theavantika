const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  foodId: {
    type: mongoose.Schema.Types.Mixed,
    default: ""
  },
  productId: {
    type: mongoose.Schema.Types.Mixed,
    default: ""
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    default: 0
  },
  cost: {
    type: Number,
    default: 0
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  },
  customizations: {
    type: String,
    default: ""
  },
  image: {
    type: String,
    default: ""
  }
}, { _id: true });

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.Mixed,
    required: [true, 'User ID is required']
  },
  deliveryBoyId: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },

  customerName: {
    type: String,
    default: 'Valued Patron'
  },
  phoneNumber: {
    type: String,
    default: ''
  },
  customerEmail: {
    type: String,
    default: ''
  },
  deliveryAddress: {
    type: mongoose.Schema.Types.Mixed,
    default: ''
  },
  diningType: {
    type: String,
    default: 'Delivery'
  },
  tableNumber: {
    type: mongoose.Schema.Types.Mixed,
    default: ''
  },
  orderedItems: [orderItemSchema],
  items: [orderItemSchema],
  itemTotal: {
    type: Number,
    default: 0
  },
  deliveryCharge: {
    type: Number,
    default: 0
  },
  taxes: {
    type: Number,
    default: 0
  },
  discountAmount: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true,
    default: 0
  },
  paymentMethod: {
    type: String,
    required: true,
    default: 'UPI'
  },
  transactionId: {
    type: String,
    required: true
  },
  paymentStatus: {
    type: String,
    default: 'Paid'
  },
  orderStatus: {
    type: String,
    default: 'Requested'
  },
  specialInstructions: {
    type: String,
    default: ''
  },
  orderTime: {
    type: String,
    default: () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);

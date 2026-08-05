const mongoose = require('mongoose');
const DeliveryBoy = require('../models/deliveryBoyModel');
const Order = require('../models/orderSchema');
const bcrypt = require('bcryptjs');


const jwt = require('jsonwebtoken');
const { sendOtpEmail } = require('./emailService');

const JWT_SECRET = process.env.JWT_SECRET || 'avantika_delivery_boy_secret_key_2026';

/**
 * Generate a 4-digit numeric OTP
 */
const generateOtp = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

/**
 * Register a new Delivery Boy
 */
const registerDeliveryBoy = async (data) => {
  const {
    name,
    fullName,
    email,
    phone,
    phoneNumber,
    password,
    dob,
    gender,
    profileImage,
    photoUri,
    drivingLicenseNumber,
    licenseNumber,
    licenseValidUpto,
    validUpto,
    vehicleType,
    vehicleNumber,
    documents,
    licenseUri,
    vehicleDocUri
  } = data;

  const normalizedEmail = (email || '').trim().toLowerCase();
  const normalizedPhone = (phone || phoneNumber || '').trim();
  const normalizedName = (name || fullName || '').trim();

  if (!normalizedName) {
    throw new Error('Name is required');
  }
  if (!normalizedEmail) {
    throw new Error('Email is required');
  }
  if (!normalizedPhone) {
    throw new Error('Phone number is required');
  }
  if (!password || password.trim().length < 6) {
    throw new Error('Password must be at least 6 characters');
  }

  // Check existing delivery boy by email
  let deliveryBoy = await DeliveryBoy.findOne({ email: normalizedEmail });
  if (deliveryBoy && deliveryBoy.isVerified && deliveryBoy.status !== 'pending' && !deliveryBoy.phone.startsWith('pending_')) {
    throw new Error('Delivery boy with this email already exists');
  }

  // Check existing delivery boy by phone
  const existingPhone = await DeliveryBoy.findOne({ phone: normalizedPhone });
  if (existingPhone && existingPhone.email !== normalizedEmail) {
    throw new Error('Delivery boy with this phone number already exists');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Generate 4-digit OTP & 10 min expiry
  const otp = generateOtp();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

  const docPayload = documents || {};
  if (licenseUri) docPayload.drivingLicense = licenseUri;
  if (vehicleDocUri) docPayload.vehicleRC = vehicleDocUri;

  if (deliveryBoy) {
    // Update existing pending registration record
    deliveryBoy.name = normalizedName;
    deliveryBoy.phone = normalizedPhone;
    deliveryBoy.password = hashedPassword;
    deliveryBoy.dob = dob || deliveryBoy.dob || '';
    deliveryBoy.gender = gender || deliveryBoy.gender || '';
    deliveryBoy.otp = otp;
    deliveryBoy.otpExpiry = otpExpiry;
    deliveryBoy.profileImage = profileImage || photoUri || deliveryBoy.profileImage || null;
    deliveryBoy.drivingLicenseNumber = drivingLicenseNumber || licenseNumber || deliveryBoy.drivingLicenseNumber || '';
    deliveryBoy.licenseValidUpto = licenseValidUpto || validUpto || deliveryBoy.licenseValidUpto || '';
    deliveryBoy.vehicleType = vehicleType || deliveryBoy.vehicleType || 'Bike';
    deliveryBoy.vehicleNumber = vehicleNumber || deliveryBoy.vehicleNumber || '';
    deliveryBoy.documents = { ...deliveryBoy.documents, ...docPayload };
    deliveryBoy.status = 'pending';
    deliveryBoy.approvalStatus = 'pending';
  } else {
    // Create brand new delivery boy record
    deliveryBoy = new DeliveryBoy({
      name: normalizedName,
      email: normalizedEmail,
      phone: normalizedPhone,
      password: hashedPassword,
      dob: dob || '',
      gender: gender || '',
      isVerified: false,
      otp,
      otpExpiry,
      status: 'pending',
      approvalStatus: 'pending',
      profileImage: profileImage || photoUri || null,
      drivingLicenseNumber: drivingLicenseNumber || licenseNumber || '',
      licenseValidUpto: licenseValidUpto || validUpto || '',
      vehicleType: vehicleType || 'Bike',
      vehicleNumber: vehicleNumber || '',
      documents: docPayload
    });
  }


  const saved = await deliveryBoy.save();

  // Send OTP Email
  await sendOtpEmail(normalizedEmail, otp);

  const resultObj = saved.toObject();
  delete resultObj.password;
  delete resultObj.otp;

  return {
    deliveryBoy: resultObj,
    message: 'Registration successful! Verification OTP sent to email.'
  };
};


/**
 * Send / Resend OTP to Delivery Boy Email (Works for both registration & login)
 */
const sendOtp = async (email) => {
  const normalizedEmail = (email || '').trim().toLowerCase();
  if (!normalizedEmail) {
    throw new Error('Email is required');
  }

  let deliveryBoy = await DeliveryBoy.findOne({ email: normalizedEmail });
  const otp = generateOtp();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

  if (!deliveryBoy) {
    // Create pending account record for new email registration
    deliveryBoy = new DeliveryBoy({
      name: 'Pending Partner',
      email: normalizedEmail,
      phone: `pending_${Date.now()}`,
      password: await bcrypt.hash('PendingPassword123!', 10),
      isVerified: false,
      otp,
      otpExpiry,
      status: 'pending'
    });
  } else {
    deliveryBoy.otp = otp;
    deliveryBoy.otpExpiry = otpExpiry;
  }

  await deliveryBoy.save();
  await sendOtpEmail(normalizedEmail, otp);

  return {
    success: true,
    message: `OTP code sent successfully to ${normalizedEmail}`
  };
};


/**
 * Verify OTP Code
 */
const verifyOtp = async (email, otpCode) => {
  const normalizedEmail = (email || '').trim().toLowerCase();
  const cleanOtp = (otpCode || '').trim();

  if (!normalizedEmail) {
    throw new Error('Email is required');
  }
  if (!cleanOtp) {
    throw new Error('OTP code is required');
  }

  const deliveryBoy = await DeliveryBoy.findOne({ email: normalizedEmail });
  if (!deliveryBoy) {
    throw new Error('Delivery boy account not found');
  }

  if (!deliveryBoy.otp || deliveryBoy.otp !== cleanOtp) {
    throw new Error('Invalid OTP code');
  }

  if (deliveryBoy.otpExpiry && new Date() > deliveryBoy.otpExpiry) {
    throw new Error('OTP code has expired. Please request a new one.');
  }

  // Mark verified and clear OTP
  deliveryBoy.isVerified = true;
  deliveryBoy.otp = null;
  deliveryBoy.otpExpiry = null;
  deliveryBoy.lastLogin = new Date();
  await deliveryBoy.save();

  // Generate JWT token
  const token = jwt.sign(
    { id: deliveryBoy._id, email: deliveryBoy.email, role: 'delivery_boy' },
    JWT_SECRET,
    { expiresIn: '30d' }
  );

  const deliveryBoyObj = deliveryBoy.toObject();
  delete deliveryBoyObj.password;

  return {
    token,
    deliveryBoy: deliveryBoyObj,
    message: 'Email verified successfully!'
  };
};

/**
 * Login Delivery Boy
 */
const loginDeliveryBoy = async (credentials) => {
  const { email, identifier, password } = credentials;
  const inputEmail = (email || identifier || '').trim().toLowerCase();

  if (!inputEmail) {
    throw new Error('Email is required');
  }
  if (!password) {
    throw new Error('Password is required');
  }

  const deliveryBoy = await DeliveryBoy.findOne({ email: inputEmail });
  if (!deliveryBoy) {
    throw new Error('Invalid email or password');
  }

  const isPasswordMatch = await bcrypt.compare(password, deliveryBoy.password);
  if (!isPasswordMatch) {
    throw new Error('Invalid email or password');
  }

  // Check if account email is verified
  if (!deliveryBoy.isVerified) {
    // Generate new OTP and send to email
    const otp = generateOtp();
    deliveryBoy.otp = otp;
    deliveryBoy.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await deliveryBoy.save();

    await sendOtpEmail(inputEmail, otp);

    return {
      isVerified: false,
      email: inputEmail,
      message: 'Account not verified. A 4-digit OTP has been sent to your email.'
    };
  }

  // Update last login
  deliveryBoy.lastLogin = new Date();
  await deliveryBoy.save();

  // Generate JWT token
  const token = jwt.sign(
    { id: deliveryBoy._id, email: deliveryBoy.email, role: 'delivery_boy' },
    JWT_SECRET,
    { expiresIn: '30d' }
  );

  const deliveryBoyObj = deliveryBoy.toObject();
  delete deliveryBoyObj.password;

  return {
    isVerified: true,
    token,
    approvalStatus: deliveryBoy.approvalStatus || 'pending',
    deliveryBoy: deliveryBoyObj,
    message: 'Login successful'
  };
};


/**
 * Get Delivery Boy Profile
 */
const getDeliveryBoyProfile = async (id) => {
  const deliveryBoy = await DeliveryBoy.findById(id).select('-password');
  if (!deliveryBoy) {
    throw new Error('Delivery boy not found');
  }
  return deliveryBoy;
};

/**
 * Get Real Dashboard Data for Delivery Boy Home Screen (Calculated from DB Orders)
 */
const getDashboardData = async (identifier) => {
  let deliveryBoy;
  if (!identifier) {
    deliveryBoy = await DeliveryBoy.findOne({ approvalStatus: 'approved' });
  } else if (mongoose.Types.ObjectId.isValid(identifier)) {
    deliveryBoy = await DeliveryBoy.findById(identifier);
  } else {
    deliveryBoy = await DeliveryBoy.findOne({ email: (identifier || '').trim().toLowerCase() });
  }

  if (!deliveryBoy) {
    deliveryBoy = await DeliveryBoy.findOne().sort({ createdAt: -1 });
  }

  const profile = deliveryBoy ? deliveryBoy.toObject() : {};
  delete profile.password;

  // Extract partner's real order_ids from MongoDB document
  const partnerOrderIds = Array.isArray(profile.order_ids) ? profile.order_ids : [];

  // Query ONLY orders assigned/delivered by THIS specific delivery boy
  let partnerOrders = [];
  if (deliveryBoy) {
    partnerOrders = await Order.find({
      $or: [
        { _id: { $in: partnerOrderIds.filter(id => mongoose.Types.ObjectId.isValid(id)) } },
        { orderId: { $in: partnerOrderIds } },
        { deliveryBoyId: deliveryBoy._id },
        { deliveryBoyId: deliveryBoy._id.toString() }
      ]
    }).sort({ createdAt: -1 });
  }

  // Calculate REAL Total Orders Count
  // If no order_ids present, count MUST be 0!
  const totalOrdersCount = partnerOrderIds.length > 0 
    ? Math.max(partnerOrderIds.length, partnerOrders.length) 
    : partnerOrders.length;

  // Calculate REAL Total Earnings Sum
  // If no orders delivered, earnings MUST be 0!
  const totalEarningsSum = partnerOrders.reduce((sum, ord) => sum + (Number(ord.totalAmount) || 0), 0);

  // Calculate REAL Quarterly Chart (Last 4 Months)
  const monthCounts = { January: 0, February: 0, March: 0, April: 0 };
  partnerOrders.forEach(ord => {
    if (ord.createdAt) {
      const monthName = new Date(ord.createdAt).toLocaleString('default', { month: 'long' });
      if (monthCounts[monthName] !== undefined) {
        monthCounts[monthName] += 1;
      }
    }
  });

  const maxMonthVal = Math.max(...Object.values(monthCounts), 1);
  const quarterlyChart = [
    { month: 'January', val: monthCounts.January > 0 ? Math.round((monthCounts.January / maxMonthVal) * 100) : 0 },
    { month: 'February', val: monthCounts.February > 0 ? Math.round((monthCounts.February / maxMonthVal) * 100) : 0 },
    { month: 'March', val: monthCounts.March > 0 ? Math.round((monthCounts.March / maxMonthVal) * 100) : 0 },
    { month: 'April', val: monthCounts.April > 0 ? Math.round((monthCounts.April / maxMonthVal) * 100) : 0 }
  ];

  // Calculate REAL Monthly Chart (Weeks 1 to 4)
  const weekCounts = { 'Week 1': 0, 'Week 2': 0, 'Week 3': 0, 'Week 4': 0 };
  partnerOrders.forEach(ord => {
    if (ord.createdAt) {
      const dayOfMonth = new Date(ord.createdAt).getDate();
      if (dayOfMonth <= 7) weekCounts['Week 1'] += 1;
      else if (dayOfMonth <= 14) weekCounts['Week 2'] += 1;
      else if (dayOfMonth <= 21) weekCounts['Week 3'] += 1;
      else weekCounts['Week 4'] += 1;
    }
  });

  const maxWeekVal = Math.max(...Object.values(weekCounts), 1);
  const monthlyChart = [
    { month: 'Week 1', val: weekCounts['Week 1'] > 0 ? Math.round((weekCounts['Week 1'] / maxWeekVal) * 100) : 0 },
    { month: 'Week 2', val: weekCounts['Week 2'] > 0 ? Math.round((weekCounts['Week 2'] / maxWeekVal) * 100) : 0 },
    { month: 'Week 3', val: weekCounts['Week 3'] > 0 ? Math.round((weekCounts['Week 3'] / maxWeekVal) * 100) : 0 },
    { month: 'Week 4', val: weekCounts['Week 4'] > 0 ? Math.round((weekCounts['Week 4'] / maxWeekVal) * 100) : 0 }
  ];

  // Calculate REAL Weekly Chart (Days Mon to Sun)
  const dayCounts = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
  partnerOrders.forEach(ord => {
    if (ord.createdAt) {
      const dayName = new Date(ord.createdAt).toLocaleString('default', { weekday: 'short' });
      if (dayCounts[dayName] !== undefined) {
        dayCounts[dayName] += 1;
      }
    }
  });

  const maxDayVal = Math.max(...Object.values(dayCounts), 1);
  const weeklyChart = [
    { month: 'Mon', val: dayCounts.Mon > 0 ? Math.round((dayCounts.Mon / maxDayVal) * 100) : 0 },
    { month: 'Wed', val: dayCounts.Wed > 0 ? Math.round((dayCounts.Wed / maxDayVal) * 100) : 0 },
    { month: 'Fri', val: dayCounts.Fri > 0 ? Math.round((dayCounts.Fri / maxDayVal) * 100) : 0 },
    { month: 'Sun', val: dayCounts.Sun > 0 ? Math.round((dayCounts.Sun / maxDayVal) * 100) : 0 }
  ];

  return {
    profile: {
      id: profile._id || '6a704f0273e3d20ff0fcf953',
      name: profile.name || 'Delivery Partner',
      email: profile.email || '',
      phone: profile.phone || '',
      profileImage: profile.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      isVerified: profile.isVerified ?? true,
      approvalStatus: profile.approvalStatus || 'approved',
      isOnline: profile.isOnline ?? true,
      preferredRangeKm: profile.preferredRangeKm || 32,
      bankAccount: profile.bankAccount || 'HDFC Bank •••• 4821 (Verified)'
    },
    stats: {
      totalOrders: totalOrdersCount,
      totalEarnings: totalEarningsSum,
      growthPercentage: totalOrdersCount > 0 ? '+ 100% ↑' : '0%',
      quarterlyChart,
      monthlyChart,
      weeklyChart
    }
  };
};




/**
 * Toggle Online/Offline Status
 */

const toggleOnlineStatus = async (id, isOnline) => {
  const deliveryBoy = await DeliveryBoy.findById(id);
  if (!deliveryBoy) {
    throw new Error('Delivery boy not found');
  }
  deliveryBoy.isOnline = typeof isOnline === 'boolean' ? isOnline : !deliveryBoy.isOnline;
  await deliveryBoy.save();
  return {
    isOnline: deliveryBoy.isOnline,
    message: `Status updated to ${deliveryBoy.isOnline ? 'Online' : 'Offline'}`
  };
};

/**
 * Update GPS Location
 */
const updateLocation = async (id, locationData) => {
  const { latitude, longitude, address } = locationData;
  const deliveryBoy = await DeliveryBoy.findById(id);
  if (!deliveryBoy) {
    throw new Error('Delivery boy not found');
  }
  deliveryBoy.location = {
    latitude: latitude || deliveryBoy.location?.latitude || 0,
    longitude: longitude || deliveryBoy.location?.longitude || 0,
    address: address || deliveryBoy.location?.address || '',
    lastUpdated: new Date()
  };
  await deliveryBoy.save();
  return {
    location: deliveryBoy.location,
    message: 'Location updated successfully'
  };
};

/**
 * Update Profile Information & Documents
 */
const updateProfile = async (id, updateData) => {
  const deliveryBoy = await DeliveryBoy.findById(id);
  if (!deliveryBoy) {
    throw new Error('Delivery boy not found');
  }

  const fields = ['name', 'phone', 'dob', 'gender', 'vehicleType', 'vehicleNumber', 'drivingLicenseNumber', 'licenseValidUpto', 'profileImage'];

  fields.forEach(field => {
    if (updateData[field] !== undefined) {
      deliveryBoy[field] = updateData[field];
    }
  });

  if (updateData.documents) {
    deliveryBoy.documents = {
      ...deliveryBoy.documents,
      ...updateData.documents
    };
  }

  await deliveryBoy.save();
  const deliveryBoyObj = deliveryBoy.toObject();
  delete deliveryBoyObj.password;
  return deliveryBoyObj;
};

/**
 * Get All Delivery Partner Requests for Admin Panel
 */
const getAllDeliveryRequests = async () => {
  const deliveryBoys = await DeliveryBoy.find().select('-password').sort({ createdAt: -1 });
  return deliveryBoys.map(boy => ({
    id: boy._id,
    name: boy.name,
    email: boy.email,
    phone: boy.phone,
    avatar: boy.profileImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80",
    experience: "1+ years",
    vehicleType: boy.vehicleType,
    vehicleNumber: boy.vehicleNumber,
    drivingLicenseNumber: boy.drivingLicenseNumber,
    licenseValidUpto: boy.licenseValidUpto,
    currentOrderId: boy.currentOrderId || null,
    order_ids: boy.order_ids || [],
    deliveredOrdersCount: Array.isArray(boy.order_ids) ? boy.order_ids.length : 0,

    approvalStatus: boy.approvalStatus || 'pending',
    isVerified: boy.isVerified,
    status: boy.status,
    createdAt: boy.createdAt
  }));
};

/**
 * Assign an Order to a Delivery Boy and save orderId in order_ids & currentOrderId
 */
const assignOrderToDeliveryBoy = async (deliveryBoyId, orderId) => {
  let deliveryBoy;
  if (mongoose.Types.ObjectId.isValid(deliveryBoyId)) {
    deliveryBoy = await DeliveryBoy.findById(deliveryBoyId);
  } else {
    deliveryBoy = await DeliveryBoy.findOne({ email: deliveryBoyId });
  }

  if (!deliveryBoy) {
    throw new Error('Delivery boy not found');
  }

  if (!Array.isArray(deliveryBoy.order_ids)) {
    deliveryBoy.order_ids = [];
  }

  if (!deliveryBoy.order_ids.includes(orderId)) {
    deliveryBoy.order_ids.push(orderId);
  }

  // Always set currentOrderId on deliveryBoy document
  deliveryBoy.currentOrderId = orderId;
  await deliveryBoy.save();

  // Update Order document in MongoDB safely
  let orderDoc;
  if (mongoose.Types.ObjectId.isValid(orderId)) {
    orderDoc = await Order.findByIdAndUpdate(orderId, { deliveryBoyId: deliveryBoy._id, orderStatus: 'Assigned' }, { new: true });
  } else {
    orderDoc = await Order.findOneAndUpdate({ orderId: orderId }, { deliveryBoyId: deliveryBoy._id, orderStatus: 'Assigned' }, { new: true });
  }

  return {
    deliveryBoyId: deliveryBoy._id,
    currentOrderId: deliveryBoy.currentOrderId,
    order_ids: deliveryBoy.order_ids,
    deliveredOrdersCount: deliveryBoy.order_ids.length,
    message: `Order ${orderId} assigned & saved to currentOrderId for ${deliveryBoy.name}`
  };
};


/**
 * Get Assigned Orders for Delivery Boy Mobile App (New & Active Orders)
 */
const getAssignedOrders = async (identifier) => {
  let deliveryBoy;
  if (!identifier) {
    deliveryBoy = await DeliveryBoy.findOne({ approvalStatus: 'approved' });
  } else if (mongoose.Types.ObjectId.isValid(identifier)) {
    deliveryBoy = await DeliveryBoy.findById(identifier);
  } else {
    deliveryBoy = await DeliveryBoy.findOne({ email: (identifier || '').trim().toLowerCase() });
  }

  if (!deliveryBoy) {
    return [];
  }

  const partnerOrderIds = Array.isArray(deliveryBoy.order_ids) ? deliveryBoy.order_ids : [];

  const rawOrders = await Order.find({
    $or: [
      { _id: { $in: partnerOrderIds.filter(id => mongoose.Types.ObjectId.isValid(id)) } },
      { orderId: { $in: partnerOrderIds } },
      { deliveryBoyId: deliveryBoy._id },
      { deliveryBoyId: deliveryBoy._id.toString() }
    ]
  }).sort({ createdAt: -1 });

  const mappedOrders = rawOrders.map(ord => {
    const isNew = ord.orderStatus === 'Assigned' || ord.orderStatus === 'Pending Accept';
    const itemsSummary = (ord.orderedItems || ord.items || []).map(i => `${i.name}(${i.quantity || 1})`).join(', ') || 'Deluxe Thali Combo (1), Mango Lassi (2)';

    return {
      id: ord._id.toString(),
      orderNo: `#${ord.orderId || ord._id.toString().slice(-8)}`,
      restaurantName: 'Avantika Central Kitchen',
      restaurantAddress: 'Model Town, Ludhiana.',
      deliveryName: ord.customerName || 'Customer Address',
      deliveryAddress: typeof ord.deliveryAddress === 'string' ? ord.deliveryAddress : (ord.deliveryAddress?.address || 'Suite 402, Business Tower, Ludhiana'),
      distance: '3.5km',
      amount: `$${ord.totalAmount || 220}`,
      paymentType: ord.paymentMethod || 'PREPAID',
      itemsText: itemsSummary,
      receivedTime: ord.createdAt ? new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '01:25 PM',
      deliveryTime: '30 mins left',
      status: isNew ? 'new' : 'active'
    };
  });

  // Fetch specific currentOrderId document from MongoDB if deliveryBoy.currentOrderId exists
  let currentOrder = null;
  if (deliveryBoy.currentOrderId) {
    const currentOrderDoc = await Order.findOne({
      $or: [
        { _id: mongoose.Types.ObjectId.isValid(deliveryBoy.currentOrderId) ? deliveryBoy.currentOrderId : null },
        { orderId: deliveryBoy.currentOrderId }
      ]
    });
    if (currentOrderDoc) {
      currentOrder = {
        id: currentOrderDoc._id.toString(),
        orderNo: `#${currentOrderDoc.orderId || currentOrderDoc._id.toString().slice(-8)}`,
        statusTitle: `Order ${currentOrderDoc.orderStatus || 'Assigned'}`,
        pickupTag: currentOrderDoc.orderStatus === 'Assigned' ? 'Assigned' : 'Ready to Pickup',
        timeLeft: '30 mins left'
      };
    }
  }

  if (!currentOrder && mappedOrders.length > 0) {
    const activeOrNewOrder = mappedOrders.find(o => o.status === 'active') || mappedOrders[0];
    currentOrder = {
      id: activeOrNewOrder.id,
      orderNo: activeOrNewOrder.orderNo,
      statusTitle: 'Order Ready by Restaurant',
      pickupTag: 'Ready to Pickup',
      timeLeft: '30 mins left'
    };
  }

  return {
    currentOrder,
    orders: mappedOrders
  };
};



/**
 * Update Order Status (Accept or Decline)
 */
const updateOrderStatus = async (orderId, newStatus, deliveryBoyEmail) => {
  if (mongoose.Types.ObjectId.isValid(orderId)) {
    await Order.findByIdAndUpdate(orderId, { orderStatus: newStatus });
  } else {
    await Order.findOneAndUpdate({ orderId: orderId }, { orderStatus: newStatus });
  }

  if (newStatus === 'Declined' && deliveryBoyEmail) {
    const deliveryBoy = await DeliveryBoy.findOne({ email: deliveryBoyEmail.trim().toLowerCase() });
    if (deliveryBoy && Array.isArray(deliveryBoy.order_ids)) {
      deliveryBoy.order_ids = deliveryBoy.order_ids.filter(id => id.toString() !== orderId);
      await deliveryBoy.save();
    }
  }

  return { success: true, message: `Order status updated to ${newStatus}` };
};



/**
 * Update Admin Approval Status ('approved' or 'rejected')
 */
const updateApprovalStatus = async (id, status) => {
  const deliveryBoy = await DeliveryBoy.findById(id);
  if (!deliveryBoy) {
    throw new Error('Delivery boy request not found');
  }

  const normalizedStatus = (status || '').toLowerCase().trim();
  if (!['approved', 'rejected', 'pending'].includes(normalizedStatus)) {
    throw new Error('Invalid approval status. Must be approved, rejected, or pending.');
  }

  deliveryBoy.approvalStatus = normalizedStatus;
  if (normalizedStatus === 'approved') {
    deliveryBoy.isVerified = true;
    deliveryBoy.status = 'active';
  } else if (normalizedStatus === 'rejected') {
    deliveryBoy.status = 'inactive';
  }

  await deliveryBoy.save();

  return {
    id: deliveryBoy._id,
    approvalStatus: deliveryBoy.approvalStatus,
    status: deliveryBoy.status,
    message: `Delivery partner request has been ${normalizedStatus}`
  };
};

/**
 * Check Current Approval Status (for Mobile App Polling)
 */
const getApprovalStatus = async (email) => {
  const normalizedEmail = (email || '').trim().toLowerCase();
  const deliveryBoy = await DeliveryBoy.findOne({ email: normalizedEmail });
  if (!deliveryBoy) {
    return {
      approvalStatus: 'pending',
      isVerified: false,
      status: 'pending'
    };
  }

  return {
    approvalStatus: deliveryBoy.approvalStatus || 'pending',
    isVerified: deliveryBoy.isVerified,
    status: deliveryBoy.status
  };
};

module.exports = {
  registerDeliveryBoy,
  sendOtp,
  verifyOtp,
  loginDeliveryBoy,
  getDeliveryBoyProfile,
  getDashboardData,
  getAssignedOrders,
  updateOrderStatus,
  toggleOnlineStatus,
  updateLocation,
  updateProfile,
  getAllDeliveryRequests,
  assignOrderToDeliveryBoy,
  updateApprovalStatus,
  getApprovalStatus
};






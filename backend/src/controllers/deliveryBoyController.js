const deliveryBoyService = require('../services/deliveryBoyService');

const register = async (req, res) => {
  try {
    const result = await deliveryBoyService.registerDeliveryBoy(req.body);
    return res.status(201).json({
      success: true,
      message: result.message,
      data: result.deliveryBoy
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Registration failed'
    });
  }
};

const login = async (req, res) => {
  try {
    const result = await deliveryBoyService.loginDeliveryBoy(req.body);
    if (!result.isVerified) {
      return res.status(200).json({
        success: true,
        isVerified: false,
        email: result.email,
        message: result.message
      });
    }

    return res.status(200).json({
      success: true,
      isVerified: true,
      token: result.token,
      message: result.message,
      data: result.deliveryBoy
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message || 'Login failed'
    });
  }
};

const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await deliveryBoyService.sendOtp(email);
    return res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to send OTP'
    });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const result = await deliveryBoyService.verifyOtp(email, otp);
    return res.status(200).json({
      success: true,
      message: result.message,
      token: result.token,
      data: result.deliveryBoy
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'OTP verification failed'
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const deliveryBoyId = req.user?.id || req.params.id;
    const profile = await deliveryBoyService.getDeliveryBoyProfile(deliveryBoyId);
    return res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message || 'Profile not found'
    });
  }
};

const toggleOnlineStatus = async (req, res) => {
  try {
    const deliveryBoyId = req.user?.id || req.body?.id || req.body?.deliveryBoyId || req.params?.id;
    const { isOnline } = req.body;
    const result = await deliveryBoyService.toggleOnlineStatus(deliveryBoyId, isOnline);
    return res.status(200).json({
      success: true,
      message: result.message,
      data: { isOnline: result.isOnline }
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to update online status'
    });
  }
};

const updateLocation = async (req, res) => {
  try {
    const deliveryBoyId = req.user?.id || req.body?.id || req.body?.deliveryBoyId || req.params?.id;
    const result = await deliveryBoyService.updateLocation(deliveryBoyId, req.body);
    return res.status(200).json({
      success: true,
      message: result.message,
      data: result.location
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to update location'
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const deliveryBoyId = req.user?.id || req.body?.id || req.body?.deliveryBoyId || req.params?.id;
    const profile = await deliveryBoyService.updateProfile(deliveryBoyId, req.body);
    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: profile
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to update profile'
    });
  }
};

const getAdminRequests = async (req, res) => {
  try {
    const requests = await deliveryBoyService.getAllDeliveryRequests();
    return res.status(200).json({
      success: true,
      data: requests
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch delivery requests'
    });
  }
};

const updateAdminRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const result = await deliveryBoyService.updateApprovalStatus(id, status);
    return res.status(200).json({
      success: true,
      message: result.message,
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to update approval status'
    });
  }
};

const checkApprovalStatus = async (req, res) => {
  try {
    const { email } = req.params;
    const result = await deliveryBoyService.getApprovalStatus(email);
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to check approval status'
    });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const identifier = req.params.email || req.query.email || req.query.id;
    const statsData = await deliveryBoyService.getDashboardData(identifier);
    return res.status(200).json({
      success: true,
      data: statsData
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch dashboard stats'
    });
  }
};

const assignOrder = async (req, res) => {
  try {
    const { deliveryBoyId, orderId } = req.body;
    if (!deliveryBoyId || !orderId) {
      return res.status(400).json({
        success: false,
        message: 'deliveryBoyId and orderId are required'
      });
    }
    const result = await deliveryBoyService.assignOrderToDeliveryBoy(deliveryBoyId, orderId);
    return res.status(200).json({
      success: true,
      message: result.message,
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to assign order'
    });
  }
};

const getAssignedOrders = async (req, res) => {
  try {
    const identifier = req.params.email || req.query.email || req.query.id;
    const orders = await deliveryBoyService.getAssignedOrders(identifier);
    return res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch assigned orders'
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, email } = req.body;
    const result = await deliveryBoyService.updateOrderStatus(id, status, email);
    return res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update order status'
    });
  }
};

module.exports = {
  register,
  login,
  sendOtp,
  verifyOtp,
  getProfile,
  getDashboardStats,
  getAssignedOrders,
  updateOrderStatus,
  toggleOnlineStatus,
  updateLocation,
  updateProfile,
  getAdminRequests,
  assignOrder,
  updateAdminRequestStatus,
  checkApprovalStatus
};






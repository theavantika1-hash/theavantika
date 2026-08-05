const express = require('express');
const router = express.Router();
const deliveryBoyController = require('../controllers/deliveryBoyController');

// Registration API
router.post('/register', deliveryBoyController.register);

// Login API
router.post('/login', deliveryBoyController.login);

// Send / Resend Email OTP
router.post('/send-otp', deliveryBoyController.sendOtp);

// Verify Email OTP
router.post('/verify-otp', deliveryBoyController.verifyOtp);

// Profile
router.get('/profile', deliveryBoyController.getProfile);
router.get('/profile/:id', deliveryBoyController.getProfile);
router.put('/profile', deliveryBoyController.updateProfile);
router.put('/profile/:id', deliveryBoyController.updateProfile);

// Online/Offline Status Toggle
router.post('/status', deliveryBoyController.toggleOnlineStatus);

// Location Update
router.post('/location', deliveryBoyController.updateLocation);

// Admin Portal - Get all partner requests
router.get('/admin/requests', deliveryBoyController.getAdminRequests);

// Admin Portal - Approve or Reject request
router.put('/admin/requests/:id/status', deliveryBoyController.updateAdminRequestStatus);

// Mobile App - Check Approval Status Polling
router.get('/approval-status/:email', deliveryBoyController.checkApprovalStatus);

// Mobile App - Dashboard Stats & Profile Data
router.get('/dashboard-stats', deliveryBoyController.getDashboardStats);
router.get('/dashboard-stats/:email', deliveryBoyController.getDashboardStats);

// Mobile App & Admin - Assign order and save to order_ids array
router.post('/assign-order', deliveryBoyController.assignOrder);

// Mobile App - Get Assigned Orders
router.get('/assigned-orders', deliveryBoyController.getAssignedOrders);
router.get('/assigned-orders/:email', deliveryBoyController.getAssignedOrders);

// Mobile App - Update Order Status (Accept / Decline)
router.put('/orders/:id/status', deliveryBoyController.updateOrderStatus);

module.exports = router;







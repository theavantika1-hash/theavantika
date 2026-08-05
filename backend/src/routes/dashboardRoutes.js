const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboardController');

// GET /api/dashboard/stats & GET /api/dashboard
router.get('/stats', getDashboardStats);
router.get('/', getDashboardStats);

module.exports = router;

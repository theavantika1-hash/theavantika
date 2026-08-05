const Order = require('../models/orderSchema');
const User = require('../models/userModel');
const Food = require('../models/Food');

// GET /api/dashboard/stats
const getDashboardStats = async (req, res) => {
  try {
    // 1. Total Orders count from MongoDB
    const totalOrdersCount = await Order.countDocuments();

    // 2. Total Delivered / Served count
    const totalDeliveredCount = await Order.countDocuments({
      orderStatus: { $in: ['Delivered', 'Served'] }
    });

    // 3. Total Cancelled / Rejected count
    const totalCancelledCount = await Order.countDocuments({
      orderStatus: { $in: ['Rejected', 'Cancelled'] }
    });

    // 4. Total Revenue (sum of totalAmount for non-cancelled orders)
    const revenueResult = await Order.aggregate([
      { $match: { orderStatus: { $nin: ['Rejected', 'Cancelled'] } } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // 5. Total Registered Customers count
    const totalCustomersCount = await User.countDocuments();

    // 6. Total Menu Items count
    const totalMenuItemsCount = await Food.countDocuments();

    // 7. Active / Pending Tickets count
    const activeOrdersCount = await Order.countDocuments({
      orderStatus: { $in: ['Requested', 'Accepted', 'Cooking', 'Out for Delivery'] }
    });

    // 8. Order Status Breakdown
    const allOrders = await Order.find().sort({ createdAt: -1 });
    const statusBreakdown = {
      Requested: 0,
      Accepted: 0,
      Cooking: 0,
      'Out for Delivery': 0,
      Delivered: 0,
      Served: 0,
      Rejected: 0,
      Cancelled: 0
    };
    allOrders.forEach(o => {
      const st = o.orderStatus || 'Requested';
      if (statusBreakdown[st] !== undefined) {
        statusBreakdown[st]++;
      } else {
        statusBreakdown[st] = 1;
      }
    });

    // 9. Weekly Revenue Breakdown (Mon-Sun)
    const weeklyData = [
      { label: 'Mon', key: 1, revenue: 0 },
      { label: 'Tue', key: 2, revenue: 0 },
      { label: 'Wed', key: 3, revenue: 0 },
      { label: 'Thu', key: 4, revenue: 0 },
      { label: 'Fri', key: 5, revenue: 0 },
      { label: 'Sat', key: 6, revenue: 0 },
      { label: 'Sun', key: 0, revenue: 0 }
    ];

    allOrders.forEach(o => {
      if (o.createdAt && o.orderStatus !== 'Rejected' && o.orderStatus !== 'Cancelled') {
        const dayIdx = new Date(o.createdAt).getDay(); // 0 is Sun, 1 is Mon...
        const item = weeklyData.find(w => w.key === dayIdx);
        if (item) {
          item.revenue += (o.totalAmount || 0);
        }
      }
    });

    // 10. Monthly Revenue Breakdown (Week 1, Week 2, Week 3, Week 4)
    const monthlyData = [
      { label: 'Week 1', revenue: 0 },
      { label: 'Week 2', revenue: 0 },
      { label: 'Week 3', revenue: 0 },
      { label: 'Week 4', revenue: 0 }
    ];

    const now = new Date();
    allOrders.forEach(o => {
      if (o.createdAt && o.orderStatus !== 'Rejected' && o.orderStatus !== 'Cancelled') {
        const orderDate = new Date(o.createdAt);
        // Match current month
        if (orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear()) {
          const dateNum = orderDate.getDate();
          if (dateNum <= 7) monthlyData[0].revenue += (o.totalAmount || 0);
          else if (dateNum <= 14) monthlyData[1].revenue += (o.totalAmount || 0);
          else if (dateNum <= 21) monthlyData[2].revenue += (o.totalAmount || 0);
          else monthlyData[3].revenue += (o.totalAmount || 0);
        } else {
          // If order is from earlier, add to week 4
          monthlyData[3].revenue += (o.totalAmount || 0);
        }
      }
    });

    // 11. Recent 5 Orders
    const recentOrders = allOrders.slice(0, 5);

    return res.status(200).json({
      success: true,
      message: 'Dashboard stats fetched successfully from MongoDB',
      data: {
        totalOrders: totalOrdersCount,
        totalDelivered: totalDeliveredCount,
        totalCancelled: totalCancelledCount,
        totalRevenue: totalRevenue,
        totalCustomers: totalCustomersCount,
        totalMenuItems: totalMenuItemsCount,
        activeOrders: activeOrdersCount,
        statusBreakdown: statusBreakdown,
        weeklyRevenue: weeklyData,
        monthlyRevenue: monthlyData,
        recentOrders: recentOrders
      }
    });
  } catch (error) {
    console.error('Dashboard Stats Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats',
      error: error.message
    });
  }
};

module.exports = {
  getDashboardStats
};

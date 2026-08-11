const orderService = require("../services/orderService");

/**
 * Controller to handle HTTP requests/responses for Order operations
 */

// Place a new order
const placeOrder = async (req, res) => {
    try {
        const userId = req.user?._id || req.body.userId;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required to place an order"
            });
        }

        const order = await orderService.createOrder({
            ...req.body,
            userId
        });

        return res.status(201).json({
            success: true,
            message: "Order placed successfully",
            data: order
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || "Failed to place order"
        });
    }
};

// Get all orders (Admin portal)
const getAllOrders = async (req, res) => {
    try {
        const orders = await orderService.getAllOrders();
        return res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch orders"
        });
    }
};

// Get user order history
const getUserOrders = async (req, res) => {
    try {
        const userId = req.params.userId || req.query.userId || req.user?._id;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        const orders = await orderService.getUserOrders(userId);
        return res.status(200).json({
            success: true,
            data: orders
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch user orders"
        });
    }
};

// Update order status (Admin portal)
const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { orderStatus, paymentStatus } = req.body;
        const order = await orderService.updateOrderStatus(orderId, orderStatus, paymentStatus);

        return res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            data: order
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || "Failed to update order status"
        });
    }
};

// Get tracking info for an order (restaurant, user, delivery boy live location)
const getOrderTracking = async (req, res) => {
    try {
        const { orderId } = req.params;
        const trackingData = await orderService.getOrderTrackingInfo(orderId);
        return res.status(200).json({
            success: true,
            data: trackingData
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || "Failed to fetch order tracking info"
        });
    }
};

// Get road route, snapping info, road distance and ETA for an order
const getOrderRoute = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { lat, lng } = req.query;
        const routeData = await orderService.getOrderRouteInfo(orderId, lat, lng);
        return res.status(200).json({
            success: true,
            data: routeData
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || "Failed to calculate road route"
        });
    }
};

module.exports = {
    placeOrder,
    getAllOrders,
    getUserOrders,
    updateOrderStatus,
    getOrderTracking,
    getOrderRoute
};



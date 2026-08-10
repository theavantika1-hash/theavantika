const Order = require("../models/orderSchema");
const Cart = require("../models/cartModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");
const Recipe = require("../models/Recipe");
const Inventory = require("../models/Inventory");

/**
 * Create a new order in MongoDB database
 */
const createOrder = async (orderData) => {
    let {
        userId,
        customerName,
        phoneNumber,
        customerEmail,
        deliveryAddress,
        diningType,
        tableNumber,
        orderedItems,
        items,
        itemTotal,
        deliveryCharge,
        taxes,
        discountAmount,
        totalAmount,
        paymentMethod,
        transactionId,
        specialInstructions
    } = orderData;

    if (!userId) {
        throw new Error("User ID is required to place an order");
    }

    const itemsList = Array.isArray(orderedItems) && orderedItems.length > 0
        ? orderedItems
        : (Array.isArray(items) ? items : []);

    if (itemsList.length === 0) {
        throw new Error("Order items cannot be empty");
    }

    const orderId = orderData.orderId || ('AV-' + Math.floor(10000000 + Math.random() * 90000000));

    if (!transactionId) {
        const pm = (paymentMethod || '').toLowerCase();
        if (pm.includes('upi')) {
            transactionId = 'UPI_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7).toUpperCase();
        } else if (pm.includes('card')) {
            transactionId = 'CARD_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7).toUpperCase();
        } else if (pm.includes('cod')) {
            transactionId = 'COD_' + Date.now();
        } else {
            transactionId = 'TXN_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7).toUpperCase();
        }
    }

    const formattedItems = itemsList.map(item => ({
        foodId: item.foodId || item._id || item.id || item.name,
        productId: item.productId || item.foodId || item.id || item.name,
        name: item.name || item.foodName || "Food Item",
        price: Number(item.cost || item.price || item.foodPrice) || 0,
        cost: Number(item.cost || item.price || item.foodPrice) || 0,
        quantity: Math.max(1, Number(item.quantity) || 1),
        customizations: item.customizations || item.choiceOfCrust?.name || "",
        image: item.image || item.foodImage || ""
    }));

    const computedTotal = Number(totalAmount) || (
        formattedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) +
        (Number(taxes) || 0) +
        (Number(deliveryCharge) || 0) -
        (Number(discountAmount) || 0)
    );

    const isCod = paymentMethod === 'cod' || paymentMethod === 'Cash on Delivery';
    const paymentStatus = isCod ? 'Pending' : 'Paid';

    const newOrder = new Order({
        orderId,
        userId,
        customerName: customerName || 'Valued Patron',
        phoneNumber: phoneNumber || '',
        customerEmail: customerEmail || '',
        deliveryAddress: deliveryAddress || '',
        diningType: diningType || 'Delivery',
        tableNumber: tableNumber || '',
        orderedItems: formattedItems,
        items: formattedItems,
        itemTotal: Number(itemTotal) || 0,
        deliveryCharge: Number(deliveryCharge) || 0,
        taxes: Number(taxes) || 0,
        discountAmount: Number(discountAmount) || 0,
        totalAmount: Math.max(0, computedTotal),
        paymentMethod: paymentMethod || 'UPI',
        transactionId,
        paymentStatus,
        orderStatus: orderData.orderStatus || 'Requested',
        specialInstructions: specialInstructions || '',
        orderTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    const savedOrder = await newOrder.save();

    // Auto deduct inventory stock based on recipe mapping
    try {
        for (const item of formattedItems) {
            const recipe = await Recipe.findOne({ foodName: item.name.trim() });
            if (recipe && Array.isArray(recipe.ingredients)) {
                for (const ingredient of recipe.ingredients) {
                    const invItem = await Inventory.findOne({ name: ingredient.inventoryName });
                    if (invItem) {
                        const amountToUse = ingredient.qtyNeeded * item.quantity;
                        invItem.usedQty = Math.min(invItem.totalQty, invItem.usedQty + amountToUse);
                        await invItem.save();
                    }
                }
            }
        }
    } catch (invErr) {
        console.log("Auto inventory deduction failed on order placement:", invErr.message);
    }

    // Auto clear cart in database for user
    try {
        await Cart.findOneAndUpdate({ userId }, { items: [], totalItems: 0, totalAmount: 0 });
    } catch (e) {
        console.log("Cart clear on order placement info:", e.message);
    }

    // Append order reference to User document if user ID is ObjectId
    try {
        if (mongoose.Types.ObjectId.isValid(userId)) {
            await User.findByIdAndUpdate(userId, { $push: { orderHistory: savedOrder._id } });
        }
    } catch (e) {
        console.log("User history update info:", e.message);
    }

    return savedOrder;
};

// Get all orders (for Admin portal)
const getAllOrders = async () => {
    return await Order.find({}).sort({ createdAt: -1 });
};

// Get user order history
const getUserOrders = async (userId) => {
    return await Order.find({
        $or: [
            { userId: userId },
            { userId: mongoose.Types.ObjectId.isValid(userId) ? userId : null }
        ]
    }).sort({ createdAt: -1 });
};

// Update order status
const updateOrderStatus = async (orderId, orderStatus, paymentStatus) => {
    const updateObj = {};
    if (orderStatus) updateObj.orderStatus = orderStatus;
    if (paymentStatus) updateObj.paymentStatus = paymentStatus;

    return await Order.findOneAndUpdate(
        { $or: [{ orderId: orderId }, { _id: mongoose.Types.ObjectId.isValid(orderId) ? orderId : null }] },
        { $set: updateObj },
        { new: true }
    );
};

// Get order tracking details with restaurant, user, and delivery boy locations
const getOrderTrackingInfo = async (orderId) => {
    const order = await Order.findOne({
        $or: [
            { orderId: orderId },
            { _id: mongoose.Types.ObjectId.isValid(orderId) ? orderId : null }
        ]
    });

    if (!order) {
        throw new Error("Order not found");
    }

    // Default Restaurant Coordinates (SH 25, near Telco circle, Bhagwanpura, Alwar)
    const restaurantLocation = {
        name: "Avantika Restaurant",
        address: "SH 25, near Telco circle, Bhagwanpura, Alwar, Rajasthan 301001",
        latitude: 27.596704286992576,
        longitude: 76.63211439999625,
        phone: "+91 98290 12345"
    };

    // User / Delivery Address & Coordinates
    let userLocation = {
        address: typeof order.deliveryAddress === 'string' ? order.deliveryAddress : (order.deliveryAddress?.address || "Customer Delivery Address"),
        latitude: 27.596704286992576,
        longitude: 76.63211439999625
    };

    if (order.deliveryAddress && typeof order.deliveryAddress === 'object') {
        if (order.deliveryAddress.latitude) userLocation.latitude = Number(order.deliveryAddress.latitude);
        if (order.deliveryAddress.longitude) userLocation.longitude = Number(order.deliveryAddress.longitude);
    }

    // Check delivery boy details & location
    let deliveryBoyInfo = null;
    const DeliveryBoy = require('../models/deliveryBoyModel');
    
    let dboy = null;
    if (order.deliveryBoyId) {
        dboy = await DeliveryBoy.findById(order.deliveryBoyId).select('-password');
    }
    
    // Fallback: If no delivery boy ID is directly linked yet, find an active delivery partner
    if (!dboy) {
        dboy = await DeliveryBoy.findOne({ status: 'active' }).select('-password');
    }
    if (!dboy) {
        dboy = await DeliveryBoy.findOne().select('-password');
    }

    if (dboy) {
        let lat = dboy.location?.latitude;
        let lng = dboy.location?.longitude;
        if (!lat || !lng || (lat === 0 && lng === 0)) {
            // Provide realistic live coordinates near Avantika Restaurant / Alwar route
            lat = 27.6085;
            lng = 76.6385;
        }

        deliveryBoyInfo = {
            id: dboy._id,
            name: dboy.name || 'Ramesh Kumar',
            phone: dboy.phone || '+91 98765 43210',
            vehicleType: dboy.vehicleType || 'Bike',
            vehicleNumber: dboy.vehicleNumber || 'RJ-14-DB-8812',
            profileImage: dboy.profileImage,
            location: {
                latitude: lat,
                longitude: lng,
                address: dboy.location?.address || 'Near Telco Circle, Bhagwanpura'
            },
            isOnline: dboy.isOnline !== undefined ? dboy.isOnline : true
        };
    } else {
        // Fallback rider object if DB has no delivery boys yet
        deliveryBoyInfo = {
            name: 'Ramesh Kumar',
            phone: '+91 98765 43210',
            vehicleType: 'Bike',
            vehicleNumber: 'RJ-14-DB-8812',
            location: {
                latitude: 27.6085,
                longitude: 76.6385,
                address: 'Near Telco Circle'
            },
            isOnline: true
        };
    }

    return {
        orderId: order.orderId,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        customerName: order.customerName,
        phoneNumber: order.phoneNumber,
        deliveryAddress: userLocation.address,
        diningType: order.diningType,
        totalAmount: order.totalAmount,
        orderTime: order.orderTime,
        createdAt: order.createdAt,
        items: order.orderedItems || order.items || [],
        restaurantLocation,
        userLocation,
        deliveryBoy: deliveryBoyInfo
    };
};

module.exports = {
    createOrder,
    getAllOrders,
    getUserOrders,
    updateOrderStatus,
    getOrderTrackingInfo
};


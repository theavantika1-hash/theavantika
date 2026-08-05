const cartService = require("../services/cartService");

/**
 * Controller to handle HTTP requests/responses for Cart operations
 */

const getUserId = (req) => {
    const body = req.body || {};
    const params = req.params || {};
    const query = req.query || {};
    return req.user?._id || body.userId || params.userId || query.userId;
};

// Add item to cart
const addItemToCart = async (req, res) => {
    try {
        const userId = getUserId(req);
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        const cart = await cartService.addToCart(userId, req.body || {});
        return res.status(200).json({
            success: true,
            message: "Item added to cart successfully",
            data: cart
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || "Failed to add item to cart"
        });
    }
};

// Get user cart
const getUserCart = async (req, res) => {
    try {
        const userId = getUserId(req);
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        const cart = await cartService.getCart(userId);
        return res.status(200).json({
            success: true,
            data: cart
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch cart"
        });
    }
};

// Update cart item quantity
const updateItemQuantity = async (req, res) => {
    try {
        const userId = getUserId(req);
        const { itemId } = req.params || {};
        const { quantity } = req.body || {};

        if (!userId || !itemId || quantity === undefined) {
            return res.status(400).json({
                success: false,
                message: "User ID, item ID, and quantity are required"
            });
        }

        const cart = await cartService.updateCartItemQuantity(userId, itemId, quantity);
        return res.status(200).json({
            success: true,
            message: "Cart item quantity updated",
            data: cart
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || "Failed to update cart item quantity"
        });
    }
};

// Remove single item from cart
const removeItem = async (req, res) => {
    try {
        const userId = getUserId(req);
        const { itemId } = req.params || {};

        if (!userId || !itemId) {
            return res.status(400).json({
                success: false,
                message: "User ID and item ID are required"
            });
        }

        const cart = await cartService.removeCartItem(userId, itemId);
        return res.status(200).json({
            success: true,
            message: "Item removed from cart",
            data: cart
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || "Failed to remove item from cart"
        });
    }
};

// Clear entire cart
const clearUserCart = async (req, res) => {
    try {
        const userId = getUserId(req);
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        const cart = await cartService.clearCart(userId);
        return res.status(200).json({
            success: true,
            message: "Cart cleared successfully",
            data: cart
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || "Failed to clear cart"
        });
    }
};

// Completely delete user cart document
const deleteCart = async (req, res) => {
    try {
        const userId = getUserId(req);
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        await cartService.deleteCart(userId);
        return res.status(200).json({
            success: true,
            message: "Cart deleted successfully"
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || "Failed to delete cart"
        });
    }
};

module.exports = {
    addItemToCart,
    getUserCart,
    updateItemQuantity,
    removeItem,
    clearUserCart,
    deleteCart
};


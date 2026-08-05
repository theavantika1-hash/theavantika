const userService = require("../services/userService");

/**
 * Controller to handle HTTP requests/responses for User operations
 */

// Handle user registration
const registerUser = async (req, res) => {
    try {
        const user = await userService.registerUser(req.body);
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: user
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || "User registration failed"
        });
    }
};

// Handle user login
const loginUser = async (req, res) => {
    try {
        const result = await userService.loginUser(req.body);
        return res.status(200).json({
            success: true,
            message: "Login successful",
            token: result.token,
            data: result.user
        });
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: error.message || "Invalid credentials"
        });
    }
};

// Get all users / customer base
const getAllUsers = async (req, res) => {
    try {
        const customers = await userService.getAllUsers();
        return res.status(200).json({
            success: true,
            totalCustomers: customers.length,
            count: customers.length,
            data: customers
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch customers"
        });
    }
};

// Address endpoints
const getUserAddresses = async (req, res) => {
    try {
        const userId = req.user?._id || req.params.userId || req.query.userId || req.body?.userId;
        const addresses = await userService.getUserAddresses(userId);
        return res.status(200).json({
            success: true,
            data: addresses
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch addresses"
        });
    }
};

const addAddress = async (req, res) => {
    try {
        const userId = req.user?._id || req.params.userId || req.body?.userId || req.query?.userId;
        const addresses = await userService.addAddress(userId, req.body);
        return res.status(201).json({
            success: true,
            message: "Address added successfully",
            data: addresses
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || "Failed to add address"
        });
    }
};

const updateAddress = async (req, res) => {
    try {
        const userId = req.user?._id || req.params.userId || req.body?.userId || req.query?.userId;
        const { addressId } = req.params;
        const addresses = await userService.updateAddress(userId, addressId, req.body);
        return res.status(200).json({
            success: true,
            message: "Address updated successfully",
            data: addresses
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || "Failed to update address"
        });
    }
};

const deleteAddress = async (req, res) => {
    try {
        const userId = req.user?._id || req.params.userId || req.query?.userId || req.body?.userId;
        const { addressId } = req.params;
        const addresses = await userService.deleteAddress(userId, addressId);
        return res.status(200).json({
            success: true,
            message: "Address deleted successfully",
            data: addresses
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || "Failed to delete address"
        });
    }
};


module.exports = {
    registerUser,
    loginUser,
    getAllUsers,
    getUserAddresses,
    addAddress,
    updateAddress,
    deleteAddress
};



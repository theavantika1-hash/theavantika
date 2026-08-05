const User = require("../models/userModel");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


/**
 * User Service containing database and business logic for User operations
 */

// Register a new user
const registerUser = async (userData) => {
    const {
        fullName,
        userName,
        user_name,
        name,
        email,
        phoneNumber,
        phone_number,
        phone,
        password
    } = userData;

    const normalizedEmail = (email || "").trim().toLowerCase();
    const normalizedPhone = (phoneNumber || phone_number || phone || "").trim();
    const normalizedName = (fullName || userName || user_name || name || "").trim();

    if (!normalizedName) {
        throw new Error("Full name is required");
    }
    if (!normalizedEmail) {
        throw new Error("Email address is required");
    }
    if (!normalizedPhone) {
        throw new Error("Phone number is required");
    }
    if (!password || password.trim().length < 6) {
        throw new Error("Password is required and must be at least 6 characters");
    }

    // Check if user with existing email or phone number already exists
    const existingEmail = await User.findOne({ email: normalizedEmail });
    if (existingEmail) {
        throw new Error("User with this email already exists");
    }

    const existingPhone = await User.findOne({ phone_number: normalizedPhone });
    if (existingPhone) {
        throw new Error("User with this phone number already exists");
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user record according to userModel schema
    const newUser = new User({
        user_name: normalizedName,
        name: normalizedName,
        email: normalizedEmail,
        phone_number: normalizedPhone,
        phone: normalizedPhone,
        password: hashedPassword,
        isVerified: false,
        status: "active",
        authProvider: "email"
    });

    const savedUser = await newUser.save();

    // Return sanitized user object without password
    const userObj = savedUser.toObject();
    delete userObj.password;

    return userObj;
};

// Login user via email or phone number with password
const loginUser = async (credentials) => {
    const {
        email,
        phoneNumber,
        phone_number,
        phone,
        identifier,
        emailOrPhone,
        password
    } = credentials;

    const inputIdentifier = (email || phoneNumber || phone_number || phone || identifier || emailOrPhone || "").trim();

    if (!inputIdentifier) {
        throw new Error("Email or Phone number is required");
    }
    if (!password) {
        throw new Error("Password is required");
    }

    // Find user by email or phone number
    const normalizedEmail = inputIdentifier.toLowerCase();
    const user = await User.findOne({
        $or: [
            { email: normalizedEmail },
            { phone_number: inputIdentifier },
            { phone: inputIdentifier }
        ]
    });

    if (!user) {
        throw new Error("Invalid email/phone or password");
    }

    // Compare password (supports bcrypt hash and fallback)
    const isMatch = await bcrypt.compare(password, user.password) || (user.password === password);
    if (!isMatch) {
        throw new Error("Invalid email/phone or password");
    }

    // Update lastLogin timestamp
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET || "avantika_secret_jwt_key_2026";
    const token = jwt.sign(
        { id: user._id, email: user.email, role: user.status },
        jwtSecret,
        { expiresIn: "7d" }
    );

    const userObj = user.toObject();
    delete userObj.password;

    return {
        token,
        user: userObj
    };
};

// Get all users / customers
const getAllUsers = async () => {
    const users = await User.find({}).sort({ createdAt: -1 });
    return users.map(user => {
        const doc = user.toObject();
        delete doc.password;

        const totalOrders = Array.isArray(doc.orderHistory) ? doc.orderHistory.length : 0;
        const totalSpending = doc.totalSpending !== undefined ? doc.totalSpending : (totalOrders * 1200);
        const loyaltyPoints = Math.floor(totalSpending / 10);
        const displayName = doc.name || doc.user_name || doc.fullName || "Patron User";
        const displayPhone = doc.phone_number || doc.phone || "+91 98765 00000";
        const displayEmail = doc.email || "";

        return {
            ...doc,
            id: doc._id.toString(),
            name: displayName,
            phone: displayPhone,
            email: displayEmail,
            totalOrders: totalOrders,
            totalSpending: totalSpending,
            loyaltyPoints: loyaltyPoints,
            favouriteDish: doc.favouriteDish || "Truffle Butter Dal Makhani",
            lastVisit: doc.lastLogin ? new Date(doc.lastLogin).toISOString().split('T')[0] : "2026-07-25"
        };
    });
};

const formatAddress = (addr) => {
    const obj = addr.toObject ? addr.toObject() : addr;
    return {
        id: obj._id ? obj._id.toString() : obj.id,
        _id: obj._id ? obj._id.toString() : obj.id,
        name: obj.name || obj.fullName || "",
        phone: obj.phone || "",
        houseNo: obj.houseNo || "",
        building: obj.building || "",
        landmark: obj.landmark || "",
        area: obj.area || "",
        addressLine: obj.addressLine || "",
        city: obj.city || "",
        state: obj.state || "",
        pincode: obj.pincode || "",
        type: obj.type || "Home",
        isDefault: !!obj.isDefault
    };
};

const findUserByIdentifier = async (userId) => {
    if (!userId) return null;
    if (mongoose.Types.ObjectId.isValid(userId)) {
        const found = await User.findById(userId);
        if (found) return found;
    }
    return await User.findOne({
        $or: [
            { _id: mongoose.Types.ObjectId.isValid(userId) ? userId : null },
            { email: userId },
            { phone_number: userId },
            { phone: userId },
            { user_name: userId }
        ]
    });
};

// Get user addresses
const getUserAddresses = async (userId) => {
    const user = await findUserByIdentifier(userId);
    if (!user) return [];
    return (user.addresses || []).map(formatAddress);
};

// Add new address
const addAddress = async (userId, addressData) => {
    const user = await findUserByIdentifier(userId);
    if (!user) {
        throw new Error("User not found");
    }

    const newAddrObj = {
        name: addressData.name || addressData.fullName || "",
        fullName: addressData.fullName || addressData.name || "",
        phone: addressData.phone || "",
        houseNo: addressData.houseNo || "",
        building: addressData.building || "",
        landmark: addressData.landmark || "",
        area: addressData.area || "",
        addressLine: addressData.addressLine || `${addressData.houseNo || ''} ${addressData.building || ''} ${addressData.area || ''}`.trim(),
        city: addressData.city || "",
        state: addressData.state || "",
        pincode: addressData.pincode || "",
        type: addressData.type || "Home",
        isDefault: !!addressData.isDefault
    };

    user.addresses.unshift(newAddrObj);
    await user.save();
    return user.addresses.map(formatAddress);
};

// Update existing address
const updateAddress = async (userId, addressId, addressData) => {
    const user = await findUserByIdentifier(userId);
    if (!user) {
        throw new Error("User not found");
    }

    const addr = user.addresses.id(addressId);
    if (!addr) {
        throw new Error("Address not found");
    }

    if (addressData.name !== undefined) addr.name = addressData.name;
    if (addressData.fullName !== undefined) addr.fullName = addressData.fullName;
    if (addressData.phone !== undefined) addr.phone = addressData.phone;
    if (addressData.houseNo !== undefined) addr.houseNo = addressData.houseNo;
    if (addressData.building !== undefined) addr.building = addressData.building;
    if (addressData.landmark !== undefined) addr.landmark = addressData.landmark;
    if (addressData.area !== undefined) addr.area = addressData.area;
    if (addressData.addressLine !== undefined) addr.addressLine = addressData.addressLine;
    if (addressData.city !== undefined) addr.city = addressData.city;
    if (addressData.state !== undefined) addr.state = addressData.state;
    if (addressData.pincode !== undefined) addr.pincode = addressData.pincode;
    if (addressData.type !== undefined) addr.type = addressData.type;
    if (addressData.isDefault !== undefined) addr.isDefault = !!addressData.isDefault;

    await user.save();
    return user.addresses.map(formatAddress);
};

// Delete address
const deleteAddress = async (userId, addressId) => {
    const user = await findUserByIdentifier(userId);
    if (!user) {
        throw new Error("User not found");
    }

    user.addresses.pull({ _id: addressId });
    await user.save();
    return user.addresses.map(formatAddress);
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



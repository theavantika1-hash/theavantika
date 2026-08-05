const Coupon = require('../models/couponModel');

// GET /api/coupons - Fetch all coupons (Admin)
const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      message: 'Coupons fetched successfully',
      data: coupons
    });
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch coupons',
      error: error.message
    });
  }
};

// GET /api/coupons/user?phone=...&userId=... - Fetch coupons available to a specific user
const getCouponsForUser = async (req, res) => {
  try {
    const userPhone = String(req.query.phone || '').trim();
    const userId = String(req.query.userId || '').trim();

    const allCoupons = await Coupon.find({ status: 'Active (Live)' }).sort({ createdAt: -1 });

    const availableCoupons = allCoupons.filter(c => {
      // If no assigned users, it's public to all
      if (!c.assignedUsers || c.assignedUsers.length === 0) {
        return true;
      }
      // Otherwise, match userPhone or userId
      return c.assignedUsers.some(u => {
        if (userPhone && u.phone && u.phone.includes(userPhone)) return true;
        if (userId && u.userId && u.userId === userId) return true;
        if (userPhone && u.userId && u.userId.includes(userPhone)) return true;
        return false;
      });
    });

    return res.status(200).json({
      success: true,
      data: availableCoupons
    });
  } catch (error) {
    console.error('Error fetching user coupons:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user coupons',
      error: error.message
    });
  }
};

// POST /api/coupons - Create a new coupon
const addCoupon = async (req, res) => {
  try {
    const {
      code,
      type,
      value,
      minCartValue,
      expirationDate,
      usageLimit,
      restrictCategories,
      restrictProducts,
      status,
      description,
      assignedUsers
    } = req.body;

    if (!code || value === undefined || value === null) {
      return res.status(400).json({
        success: false,
        message: 'Coupon code and discount value are required'
      });
    }

    const formattedCode = code.toUpperCase().trim();
    const existing = await Coupon.findOne({ code: formattedCode });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Coupon code "${formattedCode}" already exists`
      });
    }

    const newCoupon = new Coupon({
      code: formattedCode,
      type: type || 'Percentage',
      value: Number(value),
      minCartValue: minCartValue ? Number(minCartValue) : 0,
      expirationDate: expirationDate || '',
      usageLimit: usageLimit ? usageLimit : 'Unlimited',
      restrictCategories: restrictCategories || '',
      restrictProducts: restrictProducts || '',
      status: status || 'Active (Live)',
      description: description || (type === 'Percentage' ? `${value}% OFF` : `₹${value} OFF`),
      assignedUsers: Array.isArray(assignedUsers) ? assignedUsers : []
    });

    await newCoupon.save();

    return res.status(201).json({
      success: true,
      message: 'Coupon created successfully in database',
      data: newCoupon
    });
  } catch (error) {
    console.error('Error adding coupon:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create coupon',
      error: error.message
    });
  }
};

// POST /api/coupons/assign - Assign coupon to selected users
const assignCouponUsers = async (req, res) => {
  try {
    const { code, assignedUsers } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'Coupon code is required' });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase().trim() });
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }

    coupon.assignedUsers = Array.isArray(assignedUsers) ? assignedUsers : [];
    await coupon.save();

    return res.status(200).json({
      success: true,
      message: `Coupon ${coupon.code} assigned to ${coupon.assignedUsers.length} user(s) successfully`,
      data: coupon
    });
  } catch (error) {
    console.error('Error assigning coupon:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to assign coupon',
      error: error.message
    });
  }
};

// PUT /api/coupons/:id - Update existing coupon
const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.code) {
      updateData.code = updateData.code.toUpperCase().trim();
    }

    const updated = await Coupon.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Coupon updated successfully',
      data: updated
    });
  } catch (error) {
    console.error('Error updating coupon:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update coupon',
      error: error.message
    });
  }
};

// DELETE /api/coupons/:id - Delete coupon
const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Coupon.findByIdAndDelete(id);
    if (!deleted) {
      const deletedByCode = await Coupon.findOneAndDelete({ code: id });
      if (!deletedByCode) {
        return res.status(404).json({
          success: false,
          message: 'Coupon not found'
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Coupon deleted successfully from database'
    });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete coupon',
      error: error.message
    });
  }
};

// POST /api/coupons/validate - Validate coupon for user checkout
const validateCoupon = async (req, res) => {
  try {
    const { code, userPhone, userId, cartTotal } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'Coupon code is required' });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase().trim(), status: 'Active (Live)' });
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid or inactive promo code.' });
    }

    // Check user assignment restriction
    if (coupon.assignedUsers && coupon.assignedUsers.length > 0) {
      const isAssigned = coupon.assignedUsers.some(u => {
        if (userPhone && u.phone && u.phone.includes(userPhone)) return true;
        if (userId && u.userId && u.userId === userId) return true;
        return false;
      });
      if (!isAssigned) {
        return res.status(403).json({
          success: false,
          message: `This coupon ${coupon.code} is exclusively assigned to selected users and not available for your account.`
        });
      }
    }

    // Check min cart value
    if (cartTotal !== undefined && coupon.minCartValue && cartTotal < coupon.minCartValue) {
      return res.status(400).json({
        success: false,
        message: `Minimum cart total of ₹${coupon.minCartValue} required to apply code ${coupon.code}.`
      });
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (coupon.type === 'Percentage') {
      discountAmount = Math.round(((cartTotal || 0) * coupon.value) / 100);
    } else {
      discountAmount = coupon.value;
    }

    return res.status(200).json({
      success: true,
      message: `Coupon ${coupon.code} applied successfully!`,
      data: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        discountAmount: discountAmount
      }
    });
  } catch (error) {
    console.error('Error validating coupon:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to validate coupon',
      error: error.message
    });
  }
};

module.exports = {
  getCoupons,
  getCouponsForUser,
  addCoupon,
  assignCouponUsers,
  updateCoupon,
  deleteCoupon,
  validateCoupon
};

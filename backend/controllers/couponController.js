import db from '../config/db.js';

// Validate coupon code
export const validateCoupon = async (req, res) => {
  try {
    const { code, orderValue } = req.body;
    if (!code) {
      return res.status(400).json({ message: 'Coupon code is required' });
    }

    const coupon = await db.coupons.findOne({ code: code.toUpperCase() });
    if (!coupon) {
      return res.status(404).json({ message: 'Invalid coupon code' });
    }

    if (!coupon.active) {
      return res.status(400).json({ message: 'This coupon is no longer active' });
    }

    // Expiry check
    const today = new Date().toISOString().split('T')[0];
    if (coupon.expiryDate && coupon.expiryDate < today) {
      return res.status(400).json({ message: 'This coupon has expired' });
    }

    // Minimum order value check
    if (orderValue && orderValue < coupon.minOrderValue) {
      return res.status(400).json({ message: `Minimum order value of ₹${coupon.minOrderValue} required for this coupon` });
    }

    // Usage limit check
    if (coupon.usageCount >= coupon.usageLimit) {
      return res.status(400).json({ message: 'This coupon has reached its usage limit' });
    }

    res.json({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      minOrderValue: coupon.minOrderValue
    });
  } catch (error) {
    console.error('Validate coupon error:', error);
    res.status(500).json({ message: 'Server error validating coupon' });
  }
};

// --- ADMIN CONTROLLERS ---

// Get all coupons
export const getCoupons = async (req, res) => {
  try {
    const coupons = await db.coupons.find({});
    res.json(coupons);
  } catch (error) {
    console.error('Fetch coupons error:', error);
    res.status(500).json({ message: 'Server error fetching coupons' });
  }
};

// Create coupon
export const createCoupon = async (req, res) => {
  try {
    const { code, type, value, minOrderValue, expiryDate, usageLimit } = req.body;

    if (!code || !type || !value) {
      return res.status(400).json({ message: 'Code, type, and value are required' });
    }

    const existing = await db.coupons.findOne({ code: code.toUpperCase() });
    if (existing) {
      return res.status(400).json({ message: 'Coupon with this code already exists' });
    }

    const newCoupon = await db.coupons.insertOne({
      code: code.toUpperCase(),
      type, // 'percentage' or 'fixed'
      value: Number(value),
      minOrderValue: Number(minOrderValue || 0),
      expiryDate: expiryDate || '2028-12-31',
      usageLimit: Number(usageLimit || 100),
      usageCount: 0,
      active: true
    });

    res.status(201).json(newCoupon);
  } catch (error) {
    console.error('Create coupon error:', error);
    res.status(500).json({ message: 'Server error creating coupon' });
  }
};

// Delete coupon
export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await db.coupons.deleteOne({ _id: id });
    if (!success) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    res.json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    console.error('Delete coupon error:', error);
    res.status(500).json({ message: 'Server error deleting coupon' });
  }
};

import express from 'express';
import { validateCoupon, getCoupons, createCoupon, deleteCoupon } from '../controllers/couponController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public verification
router.post('/validate', validateCoupon);

// Admin-only management
router.get('/', protect, adminOnly, getCoupons);
router.post('/', protect, adminOnly, createCoupon);
router.delete('/:id', protect, adminOnly, deleteCoupon);

export default router;

import express from 'express';
import { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus } from '../controllers/orderController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);

// Admin-only management
router.get('/admin/all', protect, adminOnly, getAllOrders);
router.put('/admin/:id', protect, adminOnly, updateOrderStatus);

export default router;

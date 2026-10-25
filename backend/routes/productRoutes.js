import express from 'express';
import { 
  getProducts, 
  getProductBySlug, 
  addProductReview, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  getAllReviews,
  deleteReview 
} from '../controllers/productController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Routes
router.get('/', getProducts);
router.get('/:slug', getProductBySlug);
router.post('/:slug/reviews', addProductReview);

// Admin Routes (Protected)
router.post('/', protect, adminOnly, createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);
router.get('/admin/reviews', protect, adminOnly, getAllReviews);
router.delete('/admin/reviews/:id', protect, adminOnly, deleteReview);

export default router;

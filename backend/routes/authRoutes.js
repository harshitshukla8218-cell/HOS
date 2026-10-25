import express from 'express';
import { registerUser, loginUser, getProfile, updateAddresses, updateSavedSizes } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getProfile);
router.put('/addresses', protect, updateAddresses);
router.put('/sizes', protect, updateSavedSizes);

export default router;

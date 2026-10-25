import express from 'express';
import { getCMS, updateCMS } from '../controllers/cmsController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getCMS);
router.put('/', protect, adminOnly, updateCMS);

export default router;

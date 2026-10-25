import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import cmsRoutes from './routes/cmsRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import db from './config/db.js';
import { seed } from './config/seed.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cms', cmsRoutes);
app.use('/api/coupons', couponRoutes);

// Serve static assets from uploads if any
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', brand: "HOS — Anushka's Atelier", time: new Date() });
});

// Auto-seed check
async function initializeServer() {
  try {
    const userCount = await db.users.count();
    if (userCount === 0) {
      console.log("No users found in database. Seeding initial HOS data...");
      await seed();
    }
  } catch (error) {
    console.error('Error during database auto-seed check:', error);
  }

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`HOS Server is running in active mode on port ${PORT}`);
  });
}

initializeServer();

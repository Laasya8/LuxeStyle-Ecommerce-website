import { Router } from 'express';
import userRoutes from './userRoutes.js';
import productRoutes from './productRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import brandRoutes from './brandRoutes.js';
import cartRoutes from './cartRoutes.js';
import wishlistRoutes from './wishlistRoutes.js';
import reviewRoutes from './reviewRoutes.js';
import orderRoutes from './orderRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';

const router = Router();

router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/brands', brandRoutes);
router.use('/cart', cartRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/reviews', reviewRoutes);
router.use('/orders', orderRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;

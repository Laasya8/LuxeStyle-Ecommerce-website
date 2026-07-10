import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import {
  getProducts,
  searchProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';

const router = Router();

router.get('/', getProducts); // list with pagination/filter/sort
router.get('/search', searchProducts); // live search suggestions
router.get('/:slug', getProductBySlug); // product details
router.post('/', requireAuth, requireAdmin, createProduct);
router.put('/:id', requireAuth, requireAdmin, updateProduct);
router.delete('/:id', requireAuth, requireAdmin, deleteProduct);

export default router;

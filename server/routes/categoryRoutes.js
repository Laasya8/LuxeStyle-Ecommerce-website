import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';

const router = Router();

router.get('/', getCategories);
router.get('/:slug', getCategoryBySlug);
router.post('/', requireAuth, requireAdmin, createCategory);
router.put('/:id', requireAuth, requireAdmin, updateCategory);
router.delete('/:id', requireAuth, requireAdmin, deleteCategory);

export default router;

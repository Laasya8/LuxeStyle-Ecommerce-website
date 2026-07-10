import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import {
  getBrands,
  getBrandBySlug,
  createBrand,
  updateBrand,
  deleteBrand,
} from '../controllers/brandController.js';

const router = Router();

router.get('/', getBrands);
router.get('/:slug', getBrandBySlug);
router.post('/', requireAuth, requireAdmin, createBrand);
router.put('/:id', requireAuth, requireAdmin, updateBrand);
router.delete('/:id', requireAuth, requireAdmin, deleteBrand);

export default router;

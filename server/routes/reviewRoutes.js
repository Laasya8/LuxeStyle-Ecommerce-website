import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  getAllReviewsAdmin,
} from '../controllers/reviewController.js';

const router = Router();

router.get('/admin/all', requireAuth, requireAdmin, getAllReviewsAdmin);
router.get('/product/:productId', getProductReviews);
router.post('/product/:productId', requireAuth, createReview);
router.put('/:id', requireAuth, updateReview);
router.delete('/:id', requireAuth, deleteReview);

export default router;

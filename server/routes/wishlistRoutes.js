import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { notImplemented } from '../utils/notImplemented.js';

const router = Router();
const stub = notImplemented('wishlist lands in Phase 3');

router.use(requireAuth);
router.get('/', stub);
router.post('/:productId', stub);
router.delete('/:productId', stub);

export default router;

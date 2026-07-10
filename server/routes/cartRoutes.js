import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { notImplemented } from '../utils/notImplemented.js';

const router = Router();
const stub = notImplemented('cart lands in Phase 3');

router.use(requireAuth);
router.get('/', stub);
router.post('/', stub); // add item
router.put('/:itemId', stub); // update quantity / saved-for-later
router.delete('/:itemId', stub);

export default router;

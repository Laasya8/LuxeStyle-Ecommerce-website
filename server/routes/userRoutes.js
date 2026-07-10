import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { notImplemented } from '../utils/notImplemented.js';

const router = Router();
const stub = notImplemented('profile & address management lands in Phase 3');

router.get('/me', requireAuth, (req, res) => {
  res.json({ success: true, data: req.user });
});
router.put('/me', requireAuth, stub); // edit profile
router.post('/me/addresses', requireAuth, stub);
router.put('/me/addresses/:addressId', requireAuth, stub);
router.delete('/me/addresses/:addressId', requireAuth, stub);

export default router;

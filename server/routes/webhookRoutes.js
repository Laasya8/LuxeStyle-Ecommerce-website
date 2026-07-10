import { Router } from 'express';
import { handleClerkWebhook } from '../controllers/webhookController.js';

const router = Router();

// Note: this route is mounted with express.raw() in server.js, not express.json(),
// because svix needs the exact raw bytes to verify the signature.
router.post('/clerk', handleClerkWebhook);

export default router;

import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { getOverview, getCustomers, getReports } from '../controllers/dashboardController.js';

const router = Router();

router.use(requireAuth, requireAdmin);
router.get('/overview', getOverview); // revenue, sales analytics, recent orders, low stock
router.get('/customers', getCustomers);
router.get('/reports', getReports);

export default router;

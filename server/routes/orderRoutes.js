import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';

const router = Router();

router.use(requireAuth);
router.get('/', getMyOrders); // my orders
router.get('/admin/all', requireAdmin, getAllOrders);
router.get('/:id', getOrderById); // order details
router.post('/', createOrder); // place order (COD)
router.put('/:id/status', requireAdmin, updateOrderStatus);

export default router;

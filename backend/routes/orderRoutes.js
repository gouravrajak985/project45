import express from 'express';
import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  updateShippingStatus,
  getMyOrders,
  getSellerOrders,
  getOrders,
} from '../controllers/orderController.js';
import { protect, admin, seller } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/sellerorders').get(protect, seller, getSellerOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/deliver').put(protect, seller, updateOrderToDelivered);
router.route('/:id/shipping').put(protect, seller, updateShippingStatus);

export default router;
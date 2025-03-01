import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getSellerProducts,
  approveProduct,
  getAdminProducts,
} from '../controllers/productController.js';
import { protect, admin, seller } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getProducts).post(protect, seller, createProduct);
router.route('/seller').get(protect, seller, getSellerProducts);
router.route('/admin').get(protect, admin, getAdminProducts);
router
  .route('/:id')
  .get(getProductById)
  .put(protect, seller, updateProduct)
  .delete(protect, seller, deleteProduct);
router.route('/:id/approve').put(protect, admin, approveProduct);

export default router;
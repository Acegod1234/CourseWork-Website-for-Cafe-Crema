import express from 'express';
import {
  placeOrder,
  processPayment,
  getOrdersByUser,
  getOrderById
} from '../controllers/ordersController.js';
import { authenticateToken } from '../middleware/auth.js';
const router = express.Router();

// Place a new order
router.post('/', authenticateToken, placeOrder);

// Process payment for an order
router.post('/:orderId/payment', authenticateToken, processPayment);

// Get all orders for the authenticated user
router.get('/', authenticateToken, getOrdersByUser);

// Get a specific order by ID
router.get('/:orderId', authenticateToken, getOrderById);

export default router;
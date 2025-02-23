const express = require('express');
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
  deleteOrder
} = require('../controllers/orderController');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Apply authentication middleware
router.use(isAuthenticated);

// Admin routes first (more specific routes)
router.get('/all', isAdmin, getAllOrders);
router.patch('/:id/status', isAdmin, updateOrderStatus);
router.delete('/:id', isAdmin, deleteOrder);

// Then regular routes
router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);

module.exports = router;

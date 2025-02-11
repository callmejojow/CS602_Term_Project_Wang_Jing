const express = require('express');
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus
} = require('../controllers/orderController');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(isAuthenticated); // All order routes require authentication

router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', isAdmin, updateOrderStatus);

module.exports = router;

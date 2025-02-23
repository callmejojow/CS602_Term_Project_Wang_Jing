const express = require('express');
const { 
  getCart, 
  addToCart, 
  updateCartItem, 
  removeFromCart,
  clearCart
} = require('../controllers/cartController');
const { isAuthenticated } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(isAuthenticated); // All cart routes require authentication

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/update', updateCartItem);
router.delete('/remove/:productId', removeFromCart);
router.delete('/clear', clearCart);

module.exports = router;

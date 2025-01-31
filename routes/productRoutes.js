const express = require('express');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');


const router = express.Router();

// Public Routes (No Authentication Required)
router.get('/', getProducts);
router.get('/:id', getProductById);

// Protected Routes (Only Admins Can Modify Products)
router.post('/', isAuthenticated, isAdmin, createProduct);
router.put('/:id', isAuthenticated, isAdmin, updateProduct);
router.delete('/:id', isAuthenticated, isAdmin, deleteProduct);

module.exports = router;

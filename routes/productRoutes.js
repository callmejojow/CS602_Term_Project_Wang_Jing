const express = require('express');
const passport = require('passport');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

const router = express.Router();

// Public Routes (No Authentication Required)
router.get('/', getProducts);
router.get('/:id', getProductById);

// Protected Routes (Only Admins Can Modify Products)
router.post('/', passport.authenticate('jwt', { session: false }), createProduct);
router.put('/:id', passport.authenticate('jwt', { session: false }), updateProduct);
router.delete('/:id', passport.authenticate('jwt', { session: false }), deleteProduct);

module.exports = router;

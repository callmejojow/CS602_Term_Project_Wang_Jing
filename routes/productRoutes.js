const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByName,
  getProductsByDescription
} = require('../controllers/productController');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');

// Search route
router.get('/search', (req, res) => {
  const { name, description } = req.query;
  
  if (name) {
    return getProductsByName(req, res);
  } else if (description) {
    return getProductsByDescription(req, res);
  } else {
    return res.status(400).json({ error: 'Please provide either name or description search parameter' });
  }
});

// Then general routes
router.get('/', getProducts);

// ID routes LAST
router.get('/:id', getProductById);
router.post('/', isAuthenticated, isAdmin, createProduct);
router.put('/:id', isAuthenticated, isAdmin, updateProduct);
router.delete('/:id', isAuthenticated, isAdmin, deleteProduct);

module.exports = router;

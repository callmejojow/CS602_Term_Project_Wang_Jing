const Product = require('../models/Product');
const mongoose = require('mongoose');

// GET All Products (Public)
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// GET Single Product by ID (Public)
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Attempting to get product by ID:', id); // Debug log

    if (id === 'search') {
      console.log('Search was caught by ID route!'); // Debug log
      return res.status(400).json({ error: 'Invalid route - use /search endpoint' });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid product ID format' });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error in getProductById:', error);
    res.status(500).json({ error: 'Failed to get product' });
  }
};
  


// POST Create a New Product (Admin Only)
exports.createProduct = async (req, res) => {
    try {
      const { name, description, price, stock } = req.body;
  
      if (!name || !description || !price || !stock) {
        return res.status(400).json({ error: "All fields are required" });
      }
  
      const newProduct = new Product({ name, description, price, stock });
      await newProduct.save();
  
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(500).json({ error: "Failed to create product" });
    }
  };

// PUT Update a Product (Admin Only)
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;
    
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, stock },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Failed to update product' });
  }
};

// DELETE Remove a Product (Admin Only)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Failed to delete product' });
  }
};

// GET Products by Name
exports.getProductsByName = async (req, res) => {
  try {
    const { name } = req.query;
    console.log('Searching by name:', name); // Debug log

    if (!name) {
      return res.status(400).json({ error: 'Name search term is required' });
    }

    const products = await Product.find({
      name: { $regex: name, $options: 'i' }
    });
    
    console.log(`Found ${products.length} products matching name:`, name);
    res.json(products);
  } catch (error) {
    console.error('Name search error:', error);
    res.status(500).json({ error: "Failed to search products by name" });
  }
};

// GET Products by Description
exports.getProductsByDescription = async (req, res) => {
  try {
    const { description } = req.query;
    console.log('Searching by description:', description); // Debug log

    if (!description) {
      return res.status(400).json({ error: 'Description search term is required' });
    }

    const products = await Product.find({
      description: { $regex: description, $options: 'i' }
    });
    
    console.log(`Found ${products.length} products matching description:`, description);
    res.json(products);
  } catch (error) {
    console.error('Description search error:', error);
    res.status(500).json({ error: "Failed to search products by description" });
  }
};
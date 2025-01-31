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
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid product ID format" });
      }
  
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Internal server error", details: error.message });
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
      const { id } = req.params;
      const updates = req.body;
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid product ID format" });
      }
  
      const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true });
  
      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      res.json(updatedProduct);
    } catch (error) {
      res.status(500).json({ error: "Failed to update product" });
    }
};

// DELETE Remove a Product (Admin Only)
exports.deleteProduct = async (req, res) => {
    try {
      const { id } = req.params;
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid product ID format" });
      }
  
      const deletedProduct = await Product.findByIdAndDelete(id);
  
      if (!deletedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete product" });
    }
};

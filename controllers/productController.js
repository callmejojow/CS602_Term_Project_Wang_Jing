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
    // Ensure only admins can add products
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: "Unauthorized. You must login as admin to create a new product." });
    }

    const { name, description, price, stock, imageUrl } = req.body;
    const newProduct = new Product({ name, description, price, stock, imageUrl });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// PUT Update a Product (Admin Only)
exports.updateProduct = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: "Unauthorized. You must login as admin to update a product." });
    }

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE Remove a Product (Admin Only)
exports.deleteProduct = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: "Unauthorized. You must login as admin to delete a product." });
    }

    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

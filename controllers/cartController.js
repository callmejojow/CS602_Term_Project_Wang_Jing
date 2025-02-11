const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Get user's cart
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id })
                        .populate('items.product');
    
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cart" });
  }
};

// Add item to cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    // Verify product exists and has enough stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    if (product.stock < quantity) {
      return res.status(400).json({ error: "Not enough stock" });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    // Update or add item
    const itemIndex = cart.items.findIndex(item => 
      item.product.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    await cart.populate('items.product');
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Failed to add item to cart" });
  }
};

// Update cart item quantity
exports.updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    if (quantity < 1) {
      return res.status(400).json({ error: "Quantity must be at least 1" });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(item => 
      item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ error: "Item not found in cart" });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    await cart.populate('items.product');

    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Failed to update cart item" });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    cart.items = cart.items.filter(item => 
      item.product.toString() !== productId
    );

    await cart.save();
    await cart.populate('items.product');

    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Failed to remove item from cart" });
  }
};

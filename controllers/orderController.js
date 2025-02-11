const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Create new order from cart
exports.createOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
                          .populate('items.product');
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Calculate total and verify stock
    let totalAmount = 0;
    for (let item of cart.items) {
      if (item.quantity > item.product.stock) {
        return res.status(400).json({ 
          error: `Not enough stock for ${item.product.name}` 
        });
      }
      totalAmount += item.product.price * item.quantity;
    }

    // Create order
    const order = await Order.create({
      user: req.user._id,
      items: cart.items,
      totalAmount
    });

    // Update product stock
    for (let item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity }
      });
    }

    // Clear cart
    cart.items = [];
    await cart.save();

    await order.populate('items.product');
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to create order" });
  }
};

// Get user's orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
                            .populate('items.product')
                            .sort('-createdAt');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

// Get single order
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('items.product');

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch order" });
  }
};

// Update order status (Admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('items.product');

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to update order status" });
  }
};

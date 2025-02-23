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
    const orderId = req.params.id;
    
    if (!['pending', 'processing', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const order = await Order.findById(orderId)
      .populate('user', 'name email')
      .populate('items.product');

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // If order is being cancelled, restore product stock
    if (status === 'cancelled' && order.status !== 'cancelled') {
      for (let item of order.items) {
        await Product.findByIdAndUpdate(item.product._id, {
          $inc: { stock: item.quantity }
        });
      }
    }

    // Update order status
    order.status = status;
    await order.save();

    res.json(order);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: "Failed to update order status" });
  }
};

// Get all orders (Admin only)
exports.getAllOrders = async (req, res) => {
  try {
    console.log('Starting getAllOrders...');
    
    const orders = await Order.find()
      .populate('user')
      .populate('items.product')
      .sort('-createdAt');
    
    console.log('Orders fetched:', orders); // See what we're getting
    
    res.json(orders);
  } catch (error) {
    // Log the full error details
    console.error('Get all orders detailed error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

// Delete order (Admin only)
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Restore product stock quantities if order is 
    for (let item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity }
      });
    }

    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({ error: "Failed to delete order" });
  }
};



const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

const resolvers = {
  // User Queries
  getUser: async ({ id }, context) => {
    if (!context.user) throw new Error('Not authenticated');
    // ... implementation
  },
  getAllUsers: async (args, context) => {
    if (!context.user?.role === 'admin') throw new Error('Not authorized');
    // ... implementation
  },

  // Product Queries
  getAllProducts: async () => {
    // ... implementation
  },
  getProduct: async ({ id }) => {
    // ... implementation
  },
  searchProductsByName: async ({ name }) => {
    // ... implementation
  },
  searchProductsByDescription: async ({ description }) => {
    // ... implementation
  },

  // Order Queries
  getOrder: async ({ id }, context) => {
    if (!context.user) throw new Error('Not authenticated');
    const order = await Order.findById(id)
      .populate('user')
      .populate('items.product');
    if (!order) throw new Error('Order not found');
    if (context.user.role !== 'admin' && 
        order.user._id.toString() !== context.user._id.toString()) {
      throw new Error('Not authorized');
    }
    return order;
  },

  getUserOrders: async (args, context) => {
    if (!context.user) throw new Error('Not authenticated');
    return await Order.find({ user: context.user._id })
      .populate('user')
      .populate('items.product')
      .sort('-createdAt');
  },

  getAllOrders: async (args, context) => {
    if (!context.user?.role !== 'admin') throw new Error('Not authorized');
    return await Order.find({})
      .populate('user')
      .populate('items.product')
      .sort('-createdAt');
  },

  // User Mutations
  createUser: async ({ input }) => {
    // ... implementation
  },
  updateUser: async ({ id, input }, context) => {
    // ... implementation
  },
  deleteUser: async ({ id }, context) => {
    // ... implementation
  },

  // Product Mutations
  createProduct: async ({ input }, context) => {
    // ... implementation
  },
  updateProduct: async ({ id, input }, context) => {
    // ... implementation
  },
  deleteProduct: async ({ id }, context) => {
    // ... implementation
  },

  // Order Mutations
  createOrder: async ({ input }, context) => {
    if (!context.user) throw new Error('Not authenticated');
    
    let totalAmount = 0;
    const orderItems = [];

    // Process each item
    for (const item of input.items) {
      const product = await Product.findById(item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found`);
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }

      totalAmount += product.price * item.quantity;
      orderItems.push({
        product: item.productId,
        quantity: item.quantity,
        price: product.price
      });

      // Update stock
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity }
      });
    }

    const order = new Order({
      user: context.user._id,
      items: orderItems,
      totalAmount,
      status: 'PENDING'
    });

    await order.save();
    return await order.populate('user').populate('items.product');
  },

  updateOrderStatus: async ({ id, input }, context) => {
    if (!context.user?.role !== 'admin') throw new Error('Not authorized');

    const order = await Order.findById(id);
    if (!order) throw new Error('Order not found');

    // Handle stock restoration for cancelled orders
    if (input.status === 'CANCELLED' && order.status !== 'CANCELLED') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity }
        });
      }
    }

    order.status = input.status;
    await order.save();
    
    return await order.populate('user').populate('items.product');
  },

  deleteOrder: async ({ id }, context) => {
    if (!context.user?.role !== 'admin') throw new Error('Not authorized');
    const result = await Order.findByIdAndDelete(id);
    return !!result;
  }
};

module.exports = resolvers;
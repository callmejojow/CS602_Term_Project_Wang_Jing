const Product = require('../../models/Product');
const User = require('../../models/User');
const Order = require('../../models/Order');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const root = {
  // User Query Resolvers
  getUser: async ({ id }, context) => {
    try {
      if (!context.user) throw new Error('Not authenticated');
      const user = await User.findById(id).select('-password');
      if (!user) throw new Error('User not found');
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  getAllUsers: async (args, context) => {
    try {
      if (!context.user || context.user.role !== 'admin') {
        throw new Error('Not authorized');
      }
      return await User.find({}).select('-password');
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Product Query Resolvers
  getAllProducts: async () => {
    try {
      return await Product.find({});
    } catch (error) {
      throw new Error('Error fetching products');
    }
  },

  getProduct: async ({ id }) => {
    try {
      const product = await Product.findById(id);
      if (!product) throw new Error('Product not found');
      return product;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  searchProductsByName: async ({ name }) => {
    try {
      return await Product.find({ 
        name: { $regex: name, $options: 'i' } 
      });
    } catch (error) {
      throw new Error('Error searching products');
    }
  },

  searchProductsByDescription: async ({ description }) => {
    try {
      return await Product.find({ 
        description: { $regex: description, $options: 'i' } 
      });
    } catch (error) {
      throw new Error('Error searching products');
    }
  },

  // User Mutation Resolvers
  createUser: async ({ input }) => {
    try {
      const existingUser = await User.findOne({ email: input.email });
      if (existingUser) throw new Error('Email already exists');

      const hashedPassword = await bcrypt.hash(input.password, 10);
      const user = new User({
        ...input,
        password: hashedPassword,
        role: 'customer'
      });

      await user.save();
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  updateUser: async ({ id, input }, context) => {
    try {
      if (!context.user) throw new Error('Not authenticated');
      if (context.user.role !== 'admin' && context.user._id.toString() !== id) {
        throw new Error('Not authorized');
      }

      if (input.password) {
        input.password = await bcrypt.hash(input.password, 10);
      }

      const user = await User.findByIdAndUpdate(
        id,
        { $set: input },
        { new: true }
      ).select('-password');

      if (!user) throw new Error('User not found');
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  deleteUser: async ({ id }, context) => {
    try {
      if (!context.user || context.user.role !== 'admin') {
        throw new Error('Not authorized');
      }

      const result = await User.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Product Mutation Resolvers
  createProduct: async ({ input }, context) => {
    try {
      if (!context.user || context.user.role !== 'admin') {
        throw new Error('Not authorized');
      }

      const product = new Product(input);
      await product.save();
      return product;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  updateProduct: async ({ id, input }, context) => {
    try {
      if (!context.user || context.user.role !== 'admin') {
        throw new Error('Not authorized');
      }

      const product = await Product.findByIdAndUpdate(
        id,
        { $set: input },
        { new: true }
      );

      if (!product) throw new Error('Product not found');
      return product;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  deleteProduct: async ({ id }, context) => {
    try {
      if (!context.user || context.user.role !== 'admin') {
        throw new Error('Not authorized');
      }

      const result = await Product.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Order Query Resolvers
  getOrder: async ({ id }, context) => {
    try {
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
    } catch (error) {
      throw new Error(error.message);
    }
  },

  getUserOrders: async (args, context) => {
    try {
      if (!context.user) throw new Error('Not authenticated');
      
      return await Order.find({ user: context.user._id })
        .populate('user')
        .populate('items.product')
        .sort('-createdAt');
    } catch (error) {
      throw new Error('Error fetching user orders');
    }
  },

  getAllOrders: async (args, context) => {
    try {
      if (!context.user || context.user.role !== 'admin') {
        throw new Error('Not authorized');
      }
      
      return await Order.find({})
        .populate('user')
        .populate('items.product')
        .sort('-createdAt');
    } catch (error) {
      throw new Error('Error fetching all orders');
    }
  },

  // Order Mutation Resolvers
  createOrder: async ({ input }, context) => {
    try {
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
    } catch (error) {
      throw new Error(error.message);
    }
  },

  updateOrderStatus: async ({ id, input }, context) => {
    try {
      if (!context.user || context.user.role !== 'admin') {
        throw new Error('Not authorized');
      }

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
    } catch (error) {
      throw new Error(error.message);
    }
  },

  deleteOrder: async ({ id }, context) => {
    try {
      if (!context.user || context.user.role !== 'admin') {
        throw new Error('Not authorized');
      }
      const result = await Order.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      throw new Error(error.message);
    }
  }
};

module.exports = root; 
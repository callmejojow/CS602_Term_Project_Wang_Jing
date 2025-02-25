const Product = require('../../models/Product');
const User = require('../../models/User');
const Order = require('../../models/Order');

const root = {
  // User Query Resolvers
  getUser: async ({ id }) => {
    try {
      return await User.findById(id);
    } catch (error) {
      throw new Error('Error fetching user');
    }
  },

  getAllUsers: async () => {
    try {
      return await User.find({});
    } catch (error) {
      throw new Error('Error fetching users');
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
      return await Product.findById(id);
    } catch (error) {
      throw new Error('Error fetching product');
    }
  },

  searchProductsByName: async ({ name }) => {
    try {
      return await Product.find({
        name: { $regex: name, $options: 'i' }
      });
    } catch (error) {
      throw new Error('Error searching products by name');
    }
  },

  searchProductsByDescription: async ({ description }) => {
    try {
      return await Product.find({
        description: { $regex: description, $options: 'i' }
      });
    } catch (error) {
      throw new Error('Error searching products by description');
    }
  },

  // User Mutation Resolvers
  createUser: async ({ input }) => {
    try {
      const user = new User(input);
      return await user.save();
    } catch (error) {
      throw new Error('Error creating user');
    }
  },

  updateUser: async ({ id, input }) => {
    try {
      return await User.findByIdAndUpdate(id, input, { new: true });
    } catch (error) {
      throw new Error('Error updating user');
    }
  },

  deleteUser: async ({ id }) => {
    try {
      await User.findByIdAndDelete(id);
      return true;
    } catch (error) {
      throw new Error('Error deleting user');
    }
  },

  // Product Mutation Resolvers
  createProduct: async ({ input }) => {
    try {
      const product = new Product(input);
      return await product.save();
    } catch (error) {
      throw new Error('Error creating product');
    }
  },

  updateProduct: async ({ id, input }) => {
    try {
      return await Product.findByIdAndUpdate(id, input, { new: true });
    } catch (error) {
      throw new Error('Error updating product');
    }
  },

  deleteProduct: async ({ id }) => {
    try {
      await Product.findByIdAndDelete(id);
      return true;
    } catch (error) {
      throw new Error('Error deleting product');
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
      
      // Check if user is admin or order owner
      if (context.user.role !== 'admin' && 
          order.user._id.toString() !== context.user._id.toString()) {
        throw new Error('Not authorized');
      }

      return order;
    } catch (error) {
      throw new Error('Error fetching order: ' + error.message);
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

      // Calculate total and validate stock
      let totalAmount = 0;
      for (const item of input.items) {
        const product = await Product.findById(item.productId);
        if (!product) throw new Error(`Product ${item.productId} not found`);
        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}`);
        }
        totalAmount += product.price * item.quantity;

        // Update stock
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: -item.quantity }
        });
      }

      const order = new Order({
        user: context.user._id,
        items: input.items.map(item => ({
          product: item.productId,
          quantity: item.quantity
        })),
        totalAmount,
        status: 'PENDING'
      });

      await order.save();
      return await order.populate('user').populate('items.product');
    } catch (error) {
      throw new Error('Error creating order: ' + error.message);
    }
  },

  updateOrderStatus: async ({ id, input }, context) => {
    try {
      if (!context.user || context.user.role !== 'admin') {
        throw new Error('Not authorized');
      }

      const order = await Order.findById(id);
      if (!order) throw new Error('Order not found');

      // If cancelling order, restore stock
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
      throw new Error('Error updating order status: ' + error.message);
    }
  },

  deleteOrder: async ({ id }, context) => {
    try {
      if (!context.user || context.user.role !== 'admin') {
        throw new Error('Not authorized');
      }

      const order = await Order.findByIdAndDelete(id);
      return !!order;
    } catch (error) {
      throw new Error('Error deleting order');
    }
  }
};

module.exports = root; 
const Product = require('../../models/Product');
const User = require('../../models/User');
const Order = require('../../models/Order');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Cart = require('../../models/Cart');

const root = {
  // User Query Resolvers
  getUser: async ({ id }, context) => {
    try {
      if (!context.user.isAuthenticated) throw new Error('Not authenticated');
      const user = await User.findById(id).select('-password');
      if (!user) throw new Error('User not found');
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  getAllUsers: async (args, context) => {
    try {
      if (!context.user.isAdmin) throw new Error('Not authorized');
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
      if (!context.user.isAuthenticated) throw new Error('Not authenticated');
      if (context.user.role !== 'admin' && context.user.userId !== id) {
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
      if (!context.user.isAdmin) throw new Error('Not authorized');

      const result = await User.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Product Mutation Resolvers
  createProduct: async ({ input }, context) => {
    try {
      if (!context.user.isAdmin) throw new Error('Not authorized');

      const product = new Product(input);
      await product.save();
      return product;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  updateProduct: async ({ id, input }, context) => {
    try {
      if (!context.user.isAdmin) throw new Error('Not authorized');

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
      if (!context.user.isAdmin) throw new Error('Not authorized');

      const result = await Product.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Order Query Resolvers
  getOrder: async ({ id }, context) => {
    try {
      if (!context.user.isAuthenticated) throw new Error('Not authenticated');
      
      const order = await Order.findById(id)
        .populate('user')
        .populate('items.product');
      
      if (!order) throw new Error('Order not found');
      
      if (!context.user.isAdmin && order.user._id.toString() !== context.user.userId) {
        throw new Error('Not authorized');
      }
      
      return order;
    } catch (error) {
      throw new Error('Error fetching order: ' + error.message);
    }
  },

  getUserOrders: async (args, context) => {
    try {
      if (!context.user.isAuthenticated) throw new Error('Not authenticated');
      
      return await Order.find({ user: context.user.userId })
        .populate('user')
        .populate('items.product')
        .sort('-createdAt');
    } catch (error) {
      throw new Error('Error fetching user orders');
    }
  },

  getAllOrders: async (args, context) => {
    try {
      if (!context.user.isAdmin) throw new Error('Not authorized');
      
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
      if (!context.user.isAuthenticated) throw new Error('Not authenticated');
      
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
          quantity: item.quantity
        });

        // Update stock
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: -item.quantity }
        });
      }

      const order = new Order({
        user: context.user.userId,
        items: orderItems,
        totalAmount,
        status: 'PENDING'
      });

      await order.save();
      return await order
        .populate('user')
        .populate('items.product');
    } catch (error) {
      throw new Error('Error creating order: ' + error.message);
    }
  },

  updateOrderStatus: async ({ id, input }, context) => {
    try {
      if (!context.user.isAdmin) throw new Error('Not authorized');

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
      
      return await order
        .populate('user')
        .populate('items.product');
    } catch (error) {
      throw new Error('Error updating order status: ' + error.message);
    }
  },

  deleteOrder: async ({ id }, context) => {
    try {
      if (!context.user.isAdmin) throw new Error('Not authorized');

      const order = await Order.findByIdAndDelete(id);
      return !!order;
    } catch (error) {
      throw new Error('Error deleting order');
    }
  },

  // Add login mutation resolver
  login: async ({ email, password }) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('User not found');
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error('Invalid password');
      }

      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      return {
        userId: user._id,
        token: token,
        role: user.role
      };
    } catch (error) {
      throw new Error('Error logging in: ' + error.message);
    }
  },

  // Cart Query Resolvers
  getCart: async (args, context) => {
    try {
      if (!context.user.isAuthenticated) throw new Error('Not authenticated');

      let cart = await Cart.findOne({ user: context.user.userId })
        .populate('user')
        .populate('items.product');

      if (!cart) {
        // Create new cart with initialized values
        cart = new Cart({
          user: context.user.userId,
          items: [],
          totalAmount: 0.0  // Explicitly set to 0.0
        });
        await cart.save();
        cart = await Cart.findById(cart._id)
          .populate('user')
          .populate('items.product');
      }

      // Ensure totalAmount is always a number
      cart.totalAmount = cart.totalAmount || 0.0;

      return {
        _id: cart._id,
        user: cart.user,
        items: cart.items || [],
        totalAmount: cart.totalAmount
      };
    } catch (error) {
      throw new Error('Error fetching cart: ' + error.message);
    }
  },

  // Cart Mutation Resolvers
  addToCart: async ({ input }, context) => {
    try {
      if (!context.user.isAuthenticated) throw new Error('Not authenticated');

      const { productId, quantity } = input;
      if (quantity <= 0) throw new Error('Quantity must be positive');

      const product = await Product.findById(productId);
      if (!product) throw new Error('Product not found');
      if (product.stock < quantity) throw new Error('Insufficient stock');

      let cart = await Cart.findOne({ user: context.user.userId });
      if (!cart) {
        cart = new Cart({
          user: context.user.userId,
          items: [],
          totalAmount: 0
        });
      }

      const existingItemIndex = cart.items.findIndex(
        item => item.product.toString() === productId
      );

      if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        cart.items.push({
          product: productId,
          quantity
        });
      }

      cart.totalAmount = await calculateCartTotal(cart.items);
      await cart.save();
      
      return await cart.populate('user').populate('items.product');
    } catch (error) {
      throw new Error('Error adding to cart: ' + error.message);
    }
  },

  updateCartItem: async ({ productId, quantity }, context) => {
    try {
      if (!context.user.isAuthenticated) throw new Error('Not authenticated');
      if (quantity <= 0) throw new Error('Quantity must be positive');

      const product = await Product.findById(productId);
      if (!product) throw new Error('Product not found');
      if (product.stock < quantity) throw new Error('Insufficient stock');

      const cart = await Cart.findOne({ user: context.user.userId });
      if (!cart) throw new Error('Cart not found');

      const itemIndex = cart.items.findIndex(
        item => item.product.toString() === productId
      );
      if (itemIndex === -1) throw new Error('Item not in cart');

      cart.items[itemIndex].quantity = quantity;
      cart.totalAmount = await calculateCartTotal(cart.items);
      await cart.save();

      return await cart.populate('user').populate('items.product');
    } catch (error) {
      throw new Error('Error updating cart item: ' + error.message);
    }
  },

  removeFromCart: async ({ productId }, context) => {
    try {
      if (!context.user.isAuthenticated) throw new Error('Not authenticated');

      const cart = await Cart.findOne({ user: context.user.userId });
      if (!cart) throw new Error('Cart not found');

      cart.items = cart.items.filter(
        item => item.product.toString() !== productId
      );
      cart.totalAmount = await calculateCartTotal(cart.items);
      await cart.save();

      return await cart.populate('user').populate('items.product');
    } catch (error) {
      throw new Error('Error removing from cart: ' + error.message);
    }
  },

  clearCart: async (args, context) => {
    try {
      if (!context.user.isAuthenticated) throw new Error('Not authenticated');

      const cart = await Cart.findOne({ user: context.user.userId });
      if (!cart) throw new Error('Cart not found');

      cart.items = [];
      cart.totalAmount = 0;
      await cart.save();

      return await cart.populate('user').populate('items.product');
    } catch (error) {
      throw new Error('Error clearing cart: ' + error.message);
    }
  },

  checkoutCart: async (args, context) => {
    try {
      if (!context.user.isAuthenticated) throw new Error('Not authenticated');

      const cart = await Cart.findOne({ user: context.user.userId })
        .populate('items.product');
      if (!cart || cart.items.length === 0) {
        throw new Error('Cart is empty');
      }

      // Verify stock availability
      for (const item of cart.items) {
        if (item.product.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${item.product.name}`);
        }
      }

      // Create order
      const order = new Order({
        user: context.user.userId,
        items: cart.items.map(item => ({
          product: item.product._id,
          quantity: item.quantity
        })),
        totalAmount: cart.totalAmount,
        status: 'PENDING'
      });

      // Update product stock
      for (const item of cart.items) {
        await Product.findByIdAndUpdate(item.product._id, {
          $inc: { stock: -item.quantity }
        });
      }

      await order.save();
      
      // Clear cart
      cart.items = [];
      cart.totalAmount = 0;
      await cart.save();

      return await order.populate('user').populate('items.product');
    } catch (error) {
      throw new Error('Error checking out cart: ' + error.message);
    }
  }
};

// Helper function to calculate cart total
async function calculateCartTotal(items) {
  let total = 0;
  for (const item of items) {
    const product = await Product.findById(item.product);
    if (product) {
      total += product.price * item.quantity;
    }
  }
  return total;
}

module.exports = root; 
const Product = require('../../models/Product');
const User = require('../../models/User');

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
  }
};

module.exports = root; 
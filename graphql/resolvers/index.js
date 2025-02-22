const User = require('../../models/User');
const Product = require('../../models/Product');

const resolvers = {
  // Queries
  getUser: async ({ id }) => {
    return await User.findById(id);
  },
  getAllUsers: async () => {
    return await User.find({});
  },
  getProduct: async ({ id }) => {
    return await Product.findById(id);
  },
  getAllProducts: async () => {
    return await Product.find({});
  },

  // Mutations
  createUser: async ({ input }) => {
    const user = new User(input);
    return await user.save();
  },
  updateUser: async ({ id, input }) => {
    return await User.findByIdAndUpdate(id, input, { new: true });
  },
  deleteUser: async ({ id }) => {
    await User.findByIdAndDelete(id);
    return true;
  },
  createProduct: async ({ input }) => {
    const product = new Product(input);
    return await product.save();
  },
  updateProduct: async ({ id, input }) => {
    return await Product.findByIdAndUpdate(id, input, { new: true });
  },
  deleteProduct: async ({ id }) => {
    await Product.findByIdAndDelete(id);
    return true;
  }
};

module.exports = resolvers; 
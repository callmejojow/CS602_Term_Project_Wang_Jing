const { buildSchema } = require('graphql');
const userType = require('../types/userType');
const productType = require('../types/productType');

const schema = buildSchema(`
  ${userType}
  ${productType}

  type Query {
    getUser(id: ID!): User
    getAllUsers: [User]
    getProduct(id: ID!): Product
    getAllProducts: [Product]
  }

  type Mutation {
    createUser(input: UserInput): User
    updateUser(id: ID!, input: UserInput): User
    deleteUser(id: ID!): Boolean

    createProduct(input: ProductInput): Product
    updateProduct(id: ID!, input: ProductInput): Product
    deleteProduct(id: ID!): Boolean
  }
`);

module.exports = schema; 
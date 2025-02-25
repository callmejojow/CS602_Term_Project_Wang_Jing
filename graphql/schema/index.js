const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type User {
    _id: ID!
    email: String
    password: String
    name: String!
    role: UserRole!
    createdAt: String!
    updatedAt: String!
  }

  enum UserRole {
    admin
    customer
  }

  type Product {
    _id: ID!
    name: String!
    description: String
    price: Float!
    stock: Int!
    image: String
    createdAt: String!
    updatedAt: String!
  } 

  type Order {
    _id: ID!
    user: User!
    items: [OrderItem!]!
    totalAmount: Float!
    status: String!
    createdAt: String!
    updatedAt: String!
  }

  type OrderItem {
    product: Product!
    quantity: Int!
  }   

  enum OrderStatus {
    PENDING
    PROCESSING
    COMPLETED
    CANCELLED
  }

  input OrderItemInput {
    productId: ID!
    quantity: Int!
  }

  input CreateOrderInput {
    items: [OrderItemInput!]!
  }

  input UpdateOrderStatusInput {
    status: OrderStatus!
  }

  input UserInput {
    email: String!
    password: String!
    name: String
  }

  input UpdateUserInput {
    email: String
    password: String
    name: String
  }

  input ProductInput {
    name: String!
    description: String
    price: Float!
    stock: Int!
    image: String
  }

  input UpdateProductInput {
    name: String
    description: String
    price: Float
    stock: Int
    image: String
  }

  type AuthData {
    userId: ID!
    token: String!
    role: UserRole!
  }

  type Query {
    # User Queries
    getUser(id: ID!): User
    getAllUsers: [User!]!
    
    # Product Queries
    getAllProducts: [Product!]!
    getProduct(id: ID!): Product
    searchProductsByName(name: String!): [Product!]!
    searchProductsByDescription(description: String!): [Product!]!

    # Order Queries
    getOrder(id: ID!): Order
    getUserOrders: [Order!]!
    getAllOrders: [Order!]!
  }

  type Mutation {
    # Auth Mutations
    login(email: String!, password: String!): AuthData!
    
    # User Mutations
    createUser(input: UserInput!): User!
    updateUser(id: ID!, input: UpdateUserInput!): User!
    deleteUser(id: ID!): Boolean!
    
    # Product Mutations
    createProduct(input: ProductInput!): Product!
    updateProduct(id: ID!, input: UpdateProductInput!): Product!
    deleteProduct(id: ID!): Boolean!

    # Order Mutations
    createOrder(input: CreateOrderInput!): Order!
    updateOrderStatus(id: ID!, input: UpdateOrderStatusInput!): Order!
    deleteOrder(id: ID!): Boolean!
  }
`);

module.exports = schema;
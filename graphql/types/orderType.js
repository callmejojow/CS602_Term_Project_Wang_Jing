const orderType = `
    type Order {
        _id: ID!
        user: User!
        items: [OrderItem!]!
        totalAmount: Float!
        status: OrderStatus!
        createdAt: String!
        updatedAt: String!
      }
      
      type OrderItem {
        product: Product!
        quantity: Int!
        price: Float!
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
      
      type Query {
        # Existing queries...
        getOrder(id: ID!): Order
        getUserOrders: [Order!]!
        getAllOrders: [Order!]! # Admin only
      }
      
      type Mutation {
        # Existing mutations...
        createOrder(input: CreateOrderInput!): Order!
        updateOrderStatus(id: ID!, input: UpdateOrderStatusInput!): Order!
        deleteOrder(id: ID!): Boolean!
      }
`;

module.exports = orderType;
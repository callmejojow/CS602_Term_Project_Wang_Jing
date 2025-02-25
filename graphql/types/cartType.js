const cartType = `
  type Cart {
    _id: ID!
    user: User!
    items: [CartItem!]!s
  }

  type CartItem {
    product: Product!
    quantity: Int!
  }

  input CartItemInput {
    productId: ID!
    quantity: Int!
  }

  extend type Query {
    getCart: Cart
  }

  extend type Mutation {
    addToCart(input: CartItemInput!): Cart!
    updateCartItem(productId: ID!, quantity: Int!): Cart!
    removeFromCart(productId: ID!): Cart!
    clearCart: Cart!
    checkoutCart: Order!
  }
`;

module.exports = cartType; 
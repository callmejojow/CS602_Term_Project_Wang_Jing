const productType = `
  type Product {
    _id: ID!
    name: String!
    description: String
    price: Float!
    stock: Int!
    image: String
    createdAt: String
    updatedAt: String
  }

  input ProductInput {
    name: String!
    description: String
    price: Float!
    stock: Int!
    image: String
  }
`;

module.exports = productType; 
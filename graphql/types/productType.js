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

  type Query {
    getProduct(id: ID!): Product
    getAllProducts: [Product]
    searchProductsByName(name: String!): [Product]
    searchProductsByDescription(description: String!): [Product]
  }

  type Mutation {
    createProduct(input: ProductInput): Product
    updateProduct(id: ID!, input: ProductInput): Product
    deleteProduct(id: ID!): Boolean
  }
`;

module.exports = productType; 
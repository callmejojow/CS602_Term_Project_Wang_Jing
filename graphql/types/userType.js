const userType = `
  type User {
    _id: ID!
    email: String!
    password: String!
    name: String
    role: String!
    createdAt: String
    updatedAt: String
  }

  input UserInput {
    email: String!
    password: String!
    name: String
    role: String
  }
`;

module.exports = userType; 
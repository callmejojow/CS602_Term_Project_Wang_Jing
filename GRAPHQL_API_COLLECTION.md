# Jing's Gizmo Trove GraphQL API Collection

## User Queries
1. **Get User**
   ```graphql
   query {
     getUser(id: "user_id_here") {
       _id
       name
       email
       role
       createdAt
     }
   }
   ```

2. **Get All Users**
   ```graphql
   query {
     getAllUsers {
       _id
       name
       email
       role
       createdAt
     }
   }
   ```

## Product Queries
1. **Get All Products**
   ```graphql
   query {
     getAllProducts {
       _id
       name
       description
       price
       stock
       imageUrl
       createdAt
     }
   }
   ```

2. **Get Single Product**
   ```graphql
   query {
     getProduct(id: "product_id_here") {
       _id
       name
       description
       price
       stock
       imageUrl
     }
   }
   ```

3. **Search Products by Name**
   ```graphql
   query {
     searchProductsByName(name: "keyboard") {
       _id
       name
       description
       price
       stock
     }
   }
   ```

4. **Search Products by Description**
   ```graphql
   query {
     searchProductsByDescription(description: "wireless") {
       _id
       name
       description
       price
       stock
     }
   }
   ```

## User Mutations
1. **Create User**
   ```graphql
   mutation {
     createUser(input: {
       name: "Test User"
       email: "test@example.com"
       password: "password123"
     }) {
       _id
       name
       email
       role
     }
   }
   ```

2. **Update User**
   ```graphql
   mutation {
     updateUser(
       id: "user_id_here"
       input: {
         name: "Updated Name"
         email: "updated@example.com"
       }
     ) {
       _id
       name
       email
     }
   }
   ```

3. **Delete User**
   ```graphql
   mutation {
     deleteUser(id: "user_id_here")
   }
   ```

## Product Mutations
1. **Create Product**
   ```graphql
   mutation {
     createProduct(input: {
       name: "New Product"
       description: "Product description"
       price: 99.99
       stock: 100
       imageUrl: "https://example.com/image.jpg"
     }) {
       _id
       name
       description
       price
       stock
     }
   }
   ```

2. **Update Product**
   ```graphql
   mutation {
     updateProduct(
       id: "product_id_here"
       input: {
         name: "Updated Product"
         price: 149.99
         stock: 75
       }
     ) {
       _id
       name
       price
       stock
     }
   }
   ```

3. **Delete Product**
   ```graphql
   mutation {
     deleteProduct(id: "product_id_here")
   }
   ```

## Testing Notes
1. GraphQL endpoint: `http://localhost:3000/graphql`

2. For authenticated operations, include the Authorization header:
   ```
   {
     "Authorization": "Bearer <your_jwt_token>"
   }
   ```

3. Test user credentials (after seeding):
   - Admin: admin@example.com / admin123
   - User: user@example.com / user123

4. Variables can be passed separately in the variables section:
   ```json
   {
     "id": "actual_id_here",
     "input": {
       "name": "actual_name_here"
     }
   }
   ```

5. All IDs should be valid MongoDB ObjectIds 
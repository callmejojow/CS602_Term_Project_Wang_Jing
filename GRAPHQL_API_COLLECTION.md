# Jing's Gizmo Trove GraphQL API Collection

## Authentication
1. **Login**
   ```graphql
   mutation {
     login(email: "test@example.com", password: "password123") {
       userId
       token
       role
     }
   }
   ```

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
       image
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
       image
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

## Order Queries
1. **Get Single Order**
   ```graphql
   query {
     getOrder(id: "order_id_here") {
       _id
       user {
         _id
         name
         email
       }
       items {
         product {
           _id
           name
           price
         }
         quantity
         price
       }
       totalAmount
       status
       createdAt
       updatedAt
     }
   }
   ```

2. **Get User Orders**
   ```graphql
   query {
     getUserOrders {
       _id
       items {
         product {
           name
           price
         }
         quantity
       }
       totalAmount
       status
       createdAt
     }
   }
   ```

3. **Get All Orders (Admin)**
   ```graphql
   query {
     getAllOrders {
       _id
       user {
         name
         email
       }
       items {
         product {
           name
         }
         quantity
         price
       }
       totalAmount
       status
       createdAt
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
       image: "https://example.com/image.jpg"
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

## Order Mutations
1. **Create Order**
   ```graphql
   mutation {
     createOrder(input: {
       items: [
         {
           productId: "product_id_here",
           quantity: 2
         }
       ]
     }) {
       _id
       items {
         product {
           name
           price
         }
         quantity
       }
       totalAmount
       status
       createdAt
     }
   }
   ```

2. **Update Order Status (Admin)**
   ```graphql
   mutation {
     updateOrderStatus(
       id: "order_id_here",
       input: {
         status: COMPLETED  # PENDING, PROCESSING, COMPLETED, CANCELLED
       }
     ) {
       _id
       status
       updatedAt
     }
   }
   ```

3. **Delete Order (Admin)**
   ```graphql
   mutation {
     deleteOrder(id: "order_id_here")
   }
   ```

## Cart Queries
1. **Get User's Cart**
   ```graphql
   query {
     getCart {
       _id
       user {
         _id
         name
         email
       }
       items {
         product {
           _id
           name
           price
           stock
         }
         quantity
       }
       totalAmount
     }
   }
   ```

## Cart Mutations
1. **Add Item to Cart**
   ```graphql
   mutation {
     addToCart(
       input: {
         productId: "product_id_here"
         quantity: 2
       }
     ) {
       _id
       items {
         product {
           name
           price
         }
         quantity
       }
       totalAmount
     }
   }
   ```

2. **Update Cart Item Quantity**
   ```graphql
   mutation {
     updateCartItem(
       productId: "product_id_here"
       quantity: 3
     ) {
       _id
       items {
         product {
           name
           price
         }
         quantity
       }
       totalAmount
     }
   }
   ```

3. **Remove Item from Cart**
   ```graphql
   mutation {
     removeFromCart(productId: "product_id_here") {
       _id
       items {
         product {
           name
         }
         quantity
       }
       totalAmount
     }
   }
   ```

4. **Clear Cart**
   ```graphql
   mutation {
     clearCart {
       _id
       items {
         product {
           name
         }
         quantity
       }
       totalAmount
     }
   }
   ```

5. **Checkout Cart**
   ```graphql
   mutation {
     checkoutCart {
       _id
       user {
         name
         email
       }
       items {
         product {
           name
           price
         }
         quantity
       }
       totalAmount
       status
       createdAt
     }
   }
   ```

## Cart Operation Notes
1. All cart operations require authentication (Bearer Token)
2. Cart is automatically created for new users
3. Adding same product multiple times updates quantity
4. Quantity must be positive integer
5. Stock availability is checked during:
   - Adding items
   - Updating quantities
   - Checkout
6. Cart is cleared after successful checkout
7. Checkout creates a new order
8. Common error scenarios:
   - Not authenticated
   - Product not found
   - Insufficient stock
   - Invalid quantity
   - Empty cart (for checkout)

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
       "items": [
         {
           "productId": "actual_product_id",
           "quantity": 1
         }
       ]
     }
   }
   ```

5. All IDs should be valid MongoDB ObjectIds

6. Order Status Values:
   - PENDING
   - PROCESSING
   - COMPLETED
   - CANCELLED 
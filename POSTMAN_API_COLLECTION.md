# Jing's Gizmo Trove API Collection

## Authentication
1. **Register User**
   - Method: POST
   - URL: `http://localhost:3000/api/auth/register`
   - Body (raw JSON):
   ```json
   {
     "name": "Test User",
     "email": "test@example.com",
     "password": "password123"
   }
   ```

2. **Login**
   - Method: POST
   - URL: `http://localhost:3000/api/auth/login`
   - Body (raw JSON):
   ```json
   {
     "email": "test@example.com",
     "password": "password123"
   }
   ```

3. **Get User Profile**
   - Method: GET
   - URL: `http://localhost:3000/api/auth/profile`
   - Auth: Bearer Token
   - Description: Returns the authenticated user's profile information
   - Example Response:
   ```json
   {
     "_id": "user_id",
     "name": "Test User",
     "email": "test@example.com",
     "role": "customer",
     "createdAt": "2024-01-01T00:00:00.000Z",
     "updatedAt": "2024-01-01T00:00:00.000Z"
   }
   ```

## Products
1. **Get All Products**
   - Method: GET
   - URL: `http://localhost:3000/api/products`

2. **Get Single Product**
   - Method: GET
   - URL: `http://localhost:3000/api/products/:id`

3. **Create Product (Admin)**
   - Method: POST
   - URL: `http://localhost:3000/api/products`
   - Auth: Bearer Token
   - Body (raw JSON):
   ```json
   {
     "name": "New Product",
     "description": "Product description",
     "price": 99.99,
     "stock": 100,
     "imageUrl": "https://example.com/image.jpg"
   }
   ```

4. **Update Product (Admin)**
   - Method: PUT
   - URL: `http://localhost:3000/api/products/:id`
   - Auth: Bearer Token
   - Body (raw JSON):
   ```json
   {
     "name": "Updated Product",
     "price": 149.99,
     "stock": 75
   }
   ```

5. **Delete Product (Admin)**
   - Method: DELETE
   - URL: `http://localhost:3000/api/products/:id`
   - Auth: Bearer Token

## Cart Operations
1. **Add Item to Cart**
   - Method: POST
   - URL: `http://localhost:3000/api/cart/items`
   - Auth: Bearer Token
   - Body (raw JSON):
   ```json
   {
     "productId": "product_id_here",
     "quantity": 2
   }
   ```
   - Example Response:
   ```json
   {
     "cart": {
       "_id": "cart_id",
       "user": "user_id",
       "items": [
         {
           "product": {
             "_id": "product_id",
             "name": "Product Name",
             "price": 99.99
           },
           "quantity": 2
         }
       ],
       "totalAmount": 199.98
     }
   }
   ```

2. **Get Cart**
   - Method: GET
   - URL: `http://localhost:3000/api/cart`
   - Auth: Bearer Token
   - Example Response:
   ```json
   {
     "cart": {
       "_id": "cart_id",
       "user": "user_id",
       "items": [
         {
           "product": {
             "_id": "product_id",
             "name": "Product Name",
             "price": 99.99,
             "image": "image_url"
           },
           "quantity": 2
         }
       ],
       "totalAmount": 199.98
     }
   }
   ```

3. **Update Cart Item Quantity**
   - Method: PATCH
   - URL: `http://localhost:3000/api/cart/items/:productId`
   - Auth: Bearer Token
   - Body (raw JSON):
   ```json
   {
     "quantity": 3
   }
   ```
   - Example Response:
   ```json
   {
     "cart": {
       "_id": "cart_id",
       "items": [
         {
           "product": {
             "name": "Product Name",
             "price": 99.99
           },
           "quantity": 3
         }
       ],
       "totalAmount": 299.97
     }
   }
   ```

4. **Remove Item from Cart**
   - Method: DELETE
   - URL: `http://localhost:3000/api/cart/items/:productId`
   - Auth: Bearer Token
   - Example Response:
   ```json
   {
     "message": "Item removed from cart",
     "cart": {
       "_id": "cart_id",
       "items": [...],
       "totalAmount": 0
     }
   }
   ```

5. **Clear Cart**
   - Method: DELETE
   - URL: `http://localhost:3000/api/cart`
   - Auth: Bearer Token
   - Example Response:
   ```json
   {
     "message": "Cart cleared successfully",
     "cart": {
       "_id": "cart_id",
       "items": [],
       "totalAmount": 0
     }
   }
   ```

6. **Checkout Cart**
   - Method: POST
   - URL: `http://localhost:3000/api/cart/checkout`
   - Auth: Bearer Token
   - Example Response:
   ```json
   {
     "message": "Order created successfully",
     "order": {
       "_id": "order_id",
       "items": [...],
       "totalAmount": 299.97,
       "status": "PENDING"
     }
   }
   ```


## Orders
1. **Get User Orders**
   - Method: GET
   - URL: `http://localhost:3000/api/orders`
   - Auth: Bearer Token

2. **Get All Orders (Admin)**
   - Method: GET
   - URL: `http://localhost:3000/api/orders/all`
   - Auth: Bearer Token

3. **Create Order**
   - Method: POST
   - URL: `http://localhost:3000/api/orders`
   - Auth: Bearer Token
   - Body (raw JSON):
   ```json
   {
     "items": [
       {
         "product": "product_id_here",
         "quantity": 2
       }
     ]
   }
   ```

4. **Update Order Status (Admin)**
   - Method: PATCH
   - URL: `http://localhost:3000/api/orders/:id/status`
   - Auth: Bearer Token
   - Body (raw JSON):
   ```json
   {
     "status": "completed"
   }
   ```

## Users (Admin Only)
1. **Get All Users**
   - Method: GET
   - URL: `http://localhost:3000/api/auth/all`
   - Auth: Bearer Token

2. **Update User Role**
   - Method: PATCH
   - URL: `http://localhost:3000/api/auth/:id/role`
   - Auth: Bearer Token
   - Body (raw JSON):
   ```json
   {
     "role": "admin"
   }
   ```

3. **Delete User**
   - Method: DELETE
   - URL: `http://localhost:3000/api/auth/:id`
   - Auth: Bearer Token

## Testing Notes
1. For authenticated routes, add the JWT token in the Authorization header:
   - Type: Bearer Token
   - Value: `<token_from_login_response>`

2. Admin routes require an admin user token

3. Test user credentials (after seeding):
   - Admin: admin@example.com / admin123
   - User: user@example.com / user123

4. Replace `:id` in URLs with actual MongoDB ObjectIds

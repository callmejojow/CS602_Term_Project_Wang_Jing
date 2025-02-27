# Jing's Gizmo Trove - CS602 Term Project

A full-stack e-commerce platform built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Demo Video

[Demo Video](https://www.loom.com/share/ddfef8e063e84023a27f193d30f39213?sid=07e96df9-f42a-4ab2-8f0a-3fa939113d85)
## Features

- **User Authentication**
  - Register/Login functionality
  - Role-based authorization (Admin/Customer) using Passport.js
  - JWT-based authentication using Passport.js

- **Product Management**
  - Browse products
  - Product details with images
  - Admin product CRUD operations
  - Stock management

- **Shopping Cart**
  - Add/Remove items
  - Quantity management
  - Persistent cart data using MongoDB

- **Order Management**
  - Order creation and tracking
  - Order status updates
  - Stock adjustment on order status changes

- **Admin Dashboard**
  - User management
  - Product management
  - Order management
  - Sales overview

## Tech Stack

- **Frontend:**
  - React.js
  - Material-UI
  - React Router
  - Context API for state management
  - Axios for API calls

- **Backend:**
  - Node.js
  - Express.js
  - MongoDB with Mongoose
  - Passport.js for authentication using JWT strategy
  - Bcrypt for password hashing

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone [https://github.com/callmejojow/CS602_Term_Project_Wang_Jing]
   cd CS602_Term_Project_Wang_Jing
   ```

2. **Backend Setup**
   ```bash
   npm install
   
   # Create .env file with:
   PORT=3000
   MONGODB_URI=mongodb://127.0.0.1:27017/shopping-cart
   JWT_SECRET=30751f54e67b18027578ef18779ff053448ea3273a6b9a7a236e6331680e5512

    # Seed initial data (products and admin user)
   node seeder.js
   ```

3. **Frontend Setup**
   ```bash
   cd client
   npm install
   
   # Create .env file with:
   PORT=3001
   ```

## Running the Application

1. **Start MongoDB**
   ```bash
   mongod
   ```

2. **Start Backend Server**
   ```bash
   npm run start
   ```

3. **Start Frontend Development Server**
   ```bash
   cd client
   npm run start
   ```

The application will be available at:
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000

## API Endpoints

### Authentication
- POST `/api/auth/signup` - Register new user
- POST `/api/auth/login` - User login
- POST `/api/auth/logout` - User logout
- GET `/api/auth/check` - Check if user is authenticated
- GET `/api/auth/profile` - Get user profile
- GET `/api/auth/allUsers` - Get all users (Admin)
- PATCH `/api/auth/:id/role` - Update user role (Admin)
- DELETE `/api/auth/:id` - Delete user (Admin)

### Products
- GET `/api/products` - Get all products
- GET `/api/products/:id` - Get single product
- POST `/api/products` - Create product (Admin)
- PUT `/api/products/:id` - Update product (Admin)
- DELETE `/api/products/:id` - Delete product (Admin)

### Cart
- GET `/api/cart` - Get user cart
- POST `/api/cart/add` - Add item to cart
- PUT `/api/cart/update` - Update item quantity
- DELETE `/api/cart/remove/:productId` - Remove item from cart
- DELETE `/api/cart/clear` - Clear cart

### Orders
- GET `/api/orders` - Get user orders
- GET `/api/orders/:id` - Get single order
- GET `/api/orders/all` - Get all orders (Admin)
- POST `/api/orders` - Create order
- PATCH `/api/orders/:id/status` - Update order status (Admin)
- DELETE `/api/orders/:id` - Delete order (Admin)

## Project Structure

```
.
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── components/
│       ├── context/
│       └── hooks/
├── server/                 # Node.js backend
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   └── routes/
└── README.md
```

## Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 3000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT signing

### Frontend (.env)
- `PORT` - Client port (default: 3001)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.

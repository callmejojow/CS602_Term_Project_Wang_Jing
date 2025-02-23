# Jing's Gizmo Trove - Frontend

This is the frontend application for Jing's Gizmo Trove, an e-commerce platform built with React for my Term Project of CS602 - Server Side Web Development.

## Prerequisites

Before running this application, make sure you have:
- Node.js (v14 or higher)
- npm (comes with Node.js)
- The backend server running on port 3000

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```


2. Create a `.env` file in the client root directory and add:
   ```bash
    PORT=3001
    ```

3. Start the frontend server:
   ```bash
   npm start
   ```

The application will open in your default browser at [http://localhost:3001](http://localhost:3001)

## Features

- User Authentication (Login/Register)
- Product Browsing
- Shopping Cart Management
- Admin Dashboard
  - Product Management
  - User Management
  - Order Management

## Available Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production
- `npm run eject`: Ejects from Create React App

## Project Structure
  ```bash
src/
├── components/
│ ├── admin/ # Admin dashboard components
│ ├── auth/ # Authentication components
│ ├── cart/ # Shopping cart components
│ ├── common/ # Reusable components
│ ├── layout/ # Layout components
│ └── products/ # Product-related components
├── context/ # React Context providers
├── hooks/ # Custom React hooks
└── App.js # Main application component
  ```

## API Endpoints

The backend API is hosted at [http://localhost:3000/api](http://localhost:3000/api)

## Notes

- Make sure the backend server is running before starting the frontend
- The application assumes the backend API is available at http://localhost:3000
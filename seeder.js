const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const users = [
  {
    name: "Admin User",
    email: "admin@metcs.com",
    password: "admin123",
    role: "admin"
  },
  {
    name: "John Smith",
    email: "john.smith@metcs.com",
    password: "123456",
    role: "customer"
  },
  {
    name: "Jane Doe",
    email: "jane.doe@metcs.com",
    password: "123456",
    role: "customer"
  }
];

const products = [
  {
    name: "Gaming Laptop",
    description: "High-performance gaming laptop with RTX 4070",
    price: 1499.99,
    stock: 10,
    image: "/src/assets/laptop.png"
  },
  {
    name: "Wireless Earbuds",
    description: "Premium noise-cancelling wireless earbuds",
    price: 199.99,
    stock: 50,
    image: "/src/assets/earbuds.png"
  },
  {
    name: "Smart Watch",
    description: "Fitness tracking smartwatch with heart rate monitor",
    price: 249.99,
    stock: 30,
    image: "/src/assets/smartwatch.png"
  },
  {
    name: "4K Monitor",
    description: "32-inch 4K Ultra HD Monitor",
    price: 399.99,
    stock: 15,
    image: "/src/assets/monitor.png"
  },
  {
    name: "Mechanical Keyboard",
    description: "RGB mechanical gaming keyboard",
    price: 129.99,
    stock: 25,
    image: "/src/assets/keyboard.png"
  },
  {
    name: "Wireless Mouse",
    description: "Ergonomic wireless gaming mouse",
    price: 79.99,
    stock: 40,
    image: "/src/assets/mouse.png"
  },
  {
    name: "Webcam",
    description: "1080p HD webcam with microphone",
    price: 69.99,
    stock: 35,
    image: "/src/assets/webcam.png"
  },
  {
    name: "Graphics Card",
    description: "NVIDIA RTX 3060 Graphics Card",
    price: 399.99,
    stock: 8,
    image: "/src/assets/gpu.png"
  },
  {
    name: "Tablet",
    description: "10-inch tablet with HD display",
    price: 299.99,
    stock: 25,
    image: "/src/assets/tablet.png"
  },
  {
    name: "Smartphone",
    description: "Latest model smartphone with 5G",
    price: 899.99,
    stock: 15,
    image: "/src/assets/smartphone.png"
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');
    console.log('Current database:', mongoose.connection.db.databaseName);

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data...');

    // Create users using the User model's pre-save middleware
    const createdUsers = await Promise.all(
      users.map(async (userData) => {
        const user = new User(userData);
        return user.save(); // This will trigger the pre-save middleware
      })
    );

    console.log('Users created:');
    createdUsers.forEach(user => {
      console.log(`- ${user.email} (${user.role})`);
    });

    // Seed products
    try {
      const createdProducts = await Product.create(products);
      console.log(`${createdProducts.length} products created successfully`);
    } catch (productError) {
      console.error('Error creating products:', productError);
      throw productError;
    }

    console.log('Database seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
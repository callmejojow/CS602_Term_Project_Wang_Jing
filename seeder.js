const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
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
    name: "External SSD",
    description: "1TB portable solid-state drive",
    price: 159.99,
    stock: 20,
    image: "/src/assets/ssd.png"
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
    name: "Gaming Chair",
    description: "Ergonomic gaming chair with lumbar support",
    price: 299.99,
    stock: 12,
    image: "/src/assets/chair.png"
  },
  {
    name: "USB-C Hub",
    description: "7-in-1 USB-C hub with HDMI",
    price: 49.99,
    stock: 45,
    image: "/src/assets/usb-hub.png"
  },
  {
    name: "Gaming Headset",
    description: "7.1 surround sound gaming headset",
    price: 89.99,
    stock: 30,
    image: "/src/assets/headset.png"
  },
  {
    name: "RAM Kit",
    description: "32GB DDR4 RAM kit (2x16GB)",
    price: 149.99,
    stock: 25,
    image: "/src/assets/ram.png"
  },
  {
    name: "CPU Cooler",
    description: "RGB liquid CPU cooler",
    price: 129.99,
    stock: 15,
    image: "/src/assets/cpu-cooler.png"
  },
  {
    name: "PC Case",
    description: "Mid-tower ATX case with tempered glass",
    price: 89.99,
    stock: 18,
    image: "/src/assets/pc-case.png"
  },
  {
    name: "Power Supply",
    description: "750W 80+ Gold certified PSU",
    price: 119.99,
    stock: 22,
    image: "/src/assets/psu.png"
  },
  {
    name: "Gaming Console",
    description: "Next-gen gaming console with 4K support",
    price: 499.99,
    stock: 10,
    image: "/src/assets/console.png"
  },
  {
    name: "Bluetooth Speaker",
    description: "Portable waterproof bluetooth speaker",
    price: 79.99,
    stock: 40,
    image: "/src/assets/speaker.png"
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
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data...');

    try {
      const hashedUsers = await Promise.all(
        users.map(async (user) => {
          const hashedPassword = await bcrypt.hash(user.password, 10);
          console.log(`Hashed password created for ${user.email}`);
          return {
            ...user,
            password: hashedPassword
          };
        })
      );

      console.log('About to create users:', hashedUsers);
      const createdUsers = await User.create(hashedUsers);
      console.log('Users created successfully:', createdUsers);
    } catch (userError) {
      console.error('Error creating users:', userError);
      throw userError;
    }

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
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const passport = require('./config/passport');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const jwt = require('jsonwebtoken');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));
app.use(passport.initialize());
app.use('/src', express.static('src')); // Serve static files from src directory

// Authentication middleware
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split('Bearer ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    } catch (err) {
      console.error('Token verification failed:', err.message);
    }
  }
  next();
};

app.use(authMiddleware);

// Debug middleware to see all incoming requests
app.use((req, res, next) => {
  console.log('Incoming request:', {
    method: req.method,
    path: req.path,
    query: req.query,
    params: req.params
  });
  next();
});

// Connect to MongoDB
connectDB();

// Routes
app.get('/', (req, res) => {
  res.send('API is running...');
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes); 
app.use('/api/orders', orderRoutes); 

// GraphQL endpoint
app.use('/graphql', graphqlHTTP((req) => ({
  schema: schema,
  rootValue: resolvers,
  graphiql: {
    headerEditorEnabled: true,
    defaultQuery: `# Welcome to Jing's Gizmo Trove API
# First, try logging in:
mutation {
  login(email: "admin@metcs.com", password: "admin123") {
    token
    userId
    role
  }
}

# Then copy the token and add it to HTTP HEADERS:
# {
#   "Authorization": "Bearer your_token_here"
# }
`,
  },
  context: { user: req.user }, // Pass the user from auth middleware to resolvers
})));

// Start Server
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './components/pages/Home';
import ProductDetail from './components/products/ProductDetail';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Cart from './components/cart/Cart';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/layout/Navbar';


function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
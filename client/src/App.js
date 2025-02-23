import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/pages/Home';
import ProductDetail from './components/products/ProductDetail';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Cart from './components/cart/Cart';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/layout/Navbar';
import Profile from './components/profile/Profile';
import OrderDetail from './components/orders/OrderDetail';
import PrivateRoute from './components/common/PrivateRoute';
//import AdminDashboard from './components/admin/AdminDashboard';


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
            <Route 
              path="/profile" 
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/orders/:orderId" 
              element={
                <PrivateRoute>
                  <OrderDetail />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/cart" 
              element={
                <PrivateRoute>
                  <Cart />
                </PrivateRoute>
              } 
            />
            {/* Admin routes */}
            {/* <Route 
              path="/admin/*" 
              element={
                <PrivateRoute adminOnly>
                  <AdminDashboard />
                </PrivateRoute>
              } 
            /> */}
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
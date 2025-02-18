import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './components/pages/Home';  // New component
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProductDetail from './components/products/ProductDetail';
import Cart from './components/cart/Cart';
import OrderList from './components/orders/OrderList';
import OrderDetail from './components/orders/OrderDetail';
import AdminProductForm from './components/products/AdminProductForm';
import PrivateRoute from './components/auth/PrivateRoute';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          
          {/* Protected Routes */}
          <Route path="/cart" element={
            <PrivateRoute>
              <Cart />
            </PrivateRoute>
          } />
          <Route path="/orders" element={
            <PrivateRoute>
              <OrderList />
            </PrivateRoute>
          } />
          <Route path="/orders/:id" element={
            <PrivateRoute>
              <OrderDetail />
            </PrivateRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin/products/new" element={
            <PrivateRoute adminOnly>
              <AdminProductForm />
            </PrivateRoute>
          } />
          <Route path="/admin/products/edit/:id" element={
            <PrivateRoute adminOnly>
              <AdminProductForm />
            </PrivateRoute>
          } />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
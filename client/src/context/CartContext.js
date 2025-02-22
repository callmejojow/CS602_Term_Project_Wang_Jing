import { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/api';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleError = (error, operation) => {
    console.error(`Error during ${operation}:`, error);
    setError(error.response?.data?.message || `Failed to ${operation}`);
    throw error;
  };

  const addToCart = async (productId, quantity = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/cart/add', {
        productId,
        quantity
      });
      setCart(response.data);
      return response.data;
    } catch (error) {
      handleError(error, 'add to cart');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    setLoading(true);
    try {
      console.log('Removing product:', productId); // Debug log
      const response = await axios.delete(`/cart/remove/${productId}`);
      
      console.log('Remove response:', response.data);
      setCart(response.data);
    } catch (error) {
      console.error('Remove error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Updating cart item:', { productId, quantity }); // Debug log
      const response = await axios.put('/cart/update', {
        productId: productId, // Send productId as expected by controller
        quantity: quantity
      });
      
      console.log('Server response:', response.data);
      setCart(response.data);
      return response.data;
    } catch (error) {
      console.error('Update error:', error.response?.data || error);
      const errorMessage = error.response?.data?.message || 'Failed to update quantity';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/cart');
      setCart(response.data);
      return response.data;
    } catch (error) {
      handleError(error, 'fetch cart');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearCart = async () => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete('/cart');
      setCart({ items: [] });
    } catch (error) {
      handleError(error, 'clear cart');
    } finally {
      setLoading(false);
    }
  };

  const getCartItemCount = () => {
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const calculateTotal = (items) => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      error,
      getCart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      calculateTotal,
      getCartItemCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
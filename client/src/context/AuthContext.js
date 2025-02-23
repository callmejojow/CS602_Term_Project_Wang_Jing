import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext(null);

axios.defaults.baseURL = 'http://localhost:3000/api';

export const AuthProvider = ({ children, onLogin }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post('/auth/login', credentials);
      const { token, user: userData } = response.data;
      
      // Set token in localStorage and axios headers
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(userData);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    try {
      console.log('Making signup request to:', '/auth/signup');
      const response = await axios.post('/auth/signup', {
        name,
        email,
        password
      });
      
      console.log('Signup response:', response.data);

      const { token, user: userData } = response.data;
      localStorage.setItem('token', token);
      setUser(userData);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    } catch (error) {
      console.error('Signup error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axios.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('/auth/check');
      setUser(response.data.user);
      // Call the callback function if user is authenticated
      if (response.data.user && onLogin) {
        await onLogin();
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [onLogin]);

  // Hook to check token and restore user session
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // You might want to verify the token here
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      login,
      logout,
      register,
      checkAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
import { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

// You might want to set a base URL for all axios requests
axios.defaults.baseURL = 'http://localhost:3000/api';

export const AuthProvider = ({ children, onLogin }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    try {
      console.log('Attempting login with:', { email, password }); // Debug log
      const response = await axios.post('/auth/login', {
        email,
        password
      });
      console.log('Login response:', response.data); // Debug log

      const { token, user: userData } = response.data;
      localStorage.setItem('token', token);
      setUser(userData);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Call the callback function after successful login
      if (onLogin) await onLogin();
      return response.data;
    } catch (error) {
      console.error('Full error:', error); // Debug log
      console.error('Login error:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Failed to login');
      throw error;
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
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
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
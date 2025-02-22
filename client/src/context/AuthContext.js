import { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

// You might want to set a base URL for all axios requests
axios.defaults.baseURL = 'http://localhost:3000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

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

    } catch (error) {
      console.error('Full error:', error); // Debug log
      console.error('Login error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.error || 'Failed to login');
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

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
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
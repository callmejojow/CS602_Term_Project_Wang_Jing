import { useState, useEffect } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
  Chip,
  Box,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/orders', {
          withCredentials: true
        });
        setOrders(response.data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        setError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'shipped':
        return 'primary';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) return <Typography>Loading orders...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (orders.length === 0) return <Typography>No orders found</Typography>;

  console.log('Auth state:', { user, loading });

  return (
    <List>
      {orders.map((order) => (
        <Box key={order._id}>
          <ListItem
            alignItems="flex-start"
            sx={{
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              py: 2
            }}
          >
            <Box sx={{ flex: 1 }}>
              <ListItemText
                primary={
                  <Typography variant="subtitle1">
                    Order #{order._id.slice(-6)}
                  </Typography>
                }
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="text.primary">
                      Placed on: {new Date(order.createdAt).toLocaleDateString()}
                    </Typography>
                    <br />
                    <Typography component="span" variant="body2">
                      Total: ${order.totalAmount?.toFixed(2)}
                    </Typography>
                  </>
                }
              />
            </Box>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'flex-start', sm: 'center' },
              gap: 2
            }}>
              <Chip
                label={order.status}
                color={getStatusColor(order.status)}
                size="small"
              />
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate(`/orders/${order._id}`)}
              >
                View Details
              </Button>
            </Box>
          </ListItem>
          <Divider component="li" />
        </Box>
      ))}
    </List>
  );
};

export default OrderList;

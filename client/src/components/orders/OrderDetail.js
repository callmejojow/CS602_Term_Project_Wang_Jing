import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar
} from '@mui/material';
import axios from 'axios';

const OrderDetail = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`/orders/${orderId}`);
        setOrder(response.data);
      } catch (error) {
        console.error('Failed to fetch order:', error);
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'warning';
      case 'processing': return 'info';
      case 'shipped': return 'primary';
      case 'delivered': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  if (loading) return <Typography>Loading order details...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!order) return <Typography>Order not found</Typography>;

  return (
    <Container maxWidth="md" sx={{ mt: 12, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Order #{order._id.slice(-6)}
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Typography variant="body1">
                Placed on: {new Date(order.createdAt).toLocaleDateString()}
              </Typography>
            </Grid>
            <Grid item>
              <Chip
                label={order.status}
                color={getStatusColor(order.status)}
              />
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Items
        </Typography>
        <List>
          {order.items.map((item) => (
            <ListItem key={item._id}>
              <ListItemAvatar>
                <Avatar 
                  src={`http://localhost:3000${item.product.image}`}
                  alt={item.product.name}
                  variant="square"
                />
              </ListItemAvatar>
              <ListItemText
                primary={item.product.name}
                secondary={
                  <>
                    <Typography component="span" variant="body2">
                      Quantity: {item.quantity}
                    </Typography>
                    <br />
                  </>
                }
              />
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Typography variant="h6">
            Total: ${order.totalAmount?.toFixed(2)}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default OrderDetail;

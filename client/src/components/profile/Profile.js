import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // TODO: Fetch user's order history
    console.log('Full user object:', user);
  }, [user]);

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar 
            sx={{ 
              width: 100, 
              height: 100, 
              mr: 3,
              bgcolor: 'primary.main'
            }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h4" gutterBottom>
              {user?.name}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ my: 3 }} />
        <Typography variant="h6" gutterBottom>
        Account Type
        </Typography>
        <Grid container spacing={2}>
        <Grid item xs={12}>
            <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
            {user?.role || 'Customer'}
            </Typography>
        </Grid>
        </Grid> 
        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Order History
        </Typography>
        {orders.length > 0 ? (
          <List>
            {orders.map((order) => (
              <ListItem key={order._id}>
                <ListItemText
                  primary={`Order #${order._id}`}
                  secondary={`Placed on ${new Date(order.createdAt).toLocaleDateString()}`}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body1" color="text.secondary">
            No orders yet
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default Profile; 
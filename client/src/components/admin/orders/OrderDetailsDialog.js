import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    List,
    ListItem,
    ListItemText,
    Typography,
    Divider,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem
  } from '@mui/material';
  import { useState } from 'react';
  import axios from 'axios';
  
  const OrderDetailsDialog = ({ open, onClose, order, onStatusUpdate }) => {
    const [status, setStatus] = useState(order?.status || 'pending');
  
    if (!order) return null;
  
    const handleStatusChange = async (event) => {
      try {
        const newStatus = event.target.value;
        await axios.patch(`/orders/${order._id}/status`, { status: newStatus });
        setStatus(newStatus);
        onStatusUpdate();
        onClose();
      } catch (error) {
        console.error('Error updating order status:', error);
      }
    };
  
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle2" gutterBottom>
            Order ID: {order._id}
          </Typography>
          <Typography variant="subtitle2" gutterBottom>
            Customer: {order.user.name}
          </Typography>
          <Typography variant="subtitle2" gutterBottom>
            Date: {new Date(order.createdAt).toLocaleString()}
          </Typography>
  
          <Box sx={{ my: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                label="Status"
                onChange={handleStatusChange}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="processing">Processing</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Box>
  
          <Divider sx={{ my: 2 }} />
  
          <List>
            {order.items.map((item) => (
              <ListItem key={item._id}>
                <ListItemText
                  primary={item.product.name}
                  secondary={`Quantity: ${item.quantity}`}
                />
                <Typography>
                  ${(item.product.price * item.quantity).toFixed(2)}
                </Typography>
              </ListItem>
            ))}
          </List>
  
          <Divider sx={{ my: 2 }} />
  
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Typography variant="h6">
              Total: ${order.totalAmount.toFixed(2)}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  export default OrderDetailsDialog;
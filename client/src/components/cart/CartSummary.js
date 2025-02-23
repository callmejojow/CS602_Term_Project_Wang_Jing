import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Box, 
  Divider,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CartSummary = ({ items, calculateTotal }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const { clearCart } = useCart();
  const navigate = useNavigate();
  
  const subtotal = items.reduce((total, item) => {
    return total + (item.product.price * item.quantity);
  }, 0);

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  const handleCheckout = async () => {
    try {
      setIsProcessing(true);
      setError(null);
      
      await axios.post('/orders');
      setSuccessOpen(true); // Show success message BEFORE clearing cart
      
      // Wait for a moment to show the success message
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await clearCart();
      
    } catch (error) {
      console.error('Failed to create order:', error);
      setError(error.response?.data?.message || 'Failed to create order');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseSuccess = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSuccessOpen(false);
  };

  return (
    <>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Order Summary
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography>Subtotal ({itemCount} items)</Typography>
            <Typography>${subtotal.toFixed(2)}</Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography>Shipping</Typography>
            <Typography>Free</Typography>
          </Box>

          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6">Total</Typography>
            <Typography variant="h6">${subtotal.toFixed(2)}</Typography>
          </Box>
          
          <Button 
            variant="contained" 
            fullWidth 
            size="large"
            onClick={handleCheckout}
            disabled={isProcessing || items.length === 0}
          >
            {isProcessing ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Proceed to Checkout'
            )}
          </Button>
        </CardContent>
      </Card>

      <Snackbar
        open={successOpen}
        autoHideDuration={6000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSuccess} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          Order placed successfully! Thank you for your purchase.
        </Alert>
      </Snackbar>
    </>
  );
};

export default CartSummary;

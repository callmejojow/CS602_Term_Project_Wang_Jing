import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Box, 
  Divider,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CartSummary = ({ items, calculateTotal }) => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const subtotal = items.reduce((total, item) => {
    return total + (item.product.price * item.quantity);
  }, 0);

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Order Summary
        </Typography>
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
          onClick={() => navigate('/checkout')}
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
  );
};

export default CartSummary;

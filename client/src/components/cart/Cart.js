import { useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Box, 
  Paper,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import CartItem from './CartItem';
import CartSummary from './CartSummary';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, loading, error, getCart, updateQuantity, removeFromCart, calculateTotal } = useCart();

  useEffect(() => {
    getCart();
  }, [getCart]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Typography variant="h4" gutterBottom>
        Shopping Cart
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {!cart?.items?.length ? (
            <Paper 
              sx={{ 
                p: 4, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                gap: 2
              }}
            >
              <ShoppingCartIcon sx={{ fontSize: 60, color: 'text.secondary' }} />
              <Typography variant="h6" color="text.secondary">
                Your cart is empty
              </Typography>
              <Typography variant="body1" color="text.secondary" textAlign="center">
                Looks like you haven't added anything to your cart yet.
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => navigate('/')}
                sx={{ mt: 2 }}
              >
                Start Shopping
              </Button>
            </Paper>
          ) : (
            cart.items.map((item) => (
              <CartItem
                key={item._id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
              />
            ))
          )}
        </Grid>

        {cart?.items?.length > 0 && (
          <Grid item xs={12} md={4}>
            <CartSummary 
              items={cart.items} 
              calculateTotal={calculateTotal}
            />
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default Cart;

// @ts-ignore
import { Grid } from '@mui/material';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Paper,
  Divider,
  Stack,
  Alert,
  TextField,
  Snackbar
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      console.log('Fetching product with ID:', id);
      try {
        const response = await axios.get(`http://localhost:3000/api/products/${id}`);
        console.log('Response:', response);
        setProduct(response.data);
      } catch (err) {
        console.error('Detailed error:', err.response || err);
        setError('Failed to fetch product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!product) return <Alert severity="info">Product not found</Alert>;

  const imageUrl = `http://localhost:3000${product.image}`;

  const handleQuantityChange = (event) => {
    const value = parseInt(event.target.value) || 0;
    setQuantity(value);
  };

  const handleAddToCart = async () => {
    try {
      await addToCart(product._id, quantity);
      setShowSuccess(true);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  // Determine if quantity exceeds stock
  const isQuantityInvalid = quantity > product.stock;

  return (
    <Container maxWidth="lg" sx={{ mt: 12, mb: 4 }}>
      <Button 
        onClick={() => navigate(-1)} 
        sx={{ mb: 2 }}
      >
        Back to Products
      </Button>
      
      <Paper elevation={3} sx={{ p: 3 }}>
        <Grid container spacing={4}>
          {/* Product Image */}
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src={imageUrl}
              alt={product.name}
              sx={{
                width: '100%',
                height: 'auto',
                maxHeight: 400,
                objectFit: 'contain',
                display: 'block',
                margin: 'auto'
              }}
            />
          </Grid>

          {/* Product Info */}
          <Grid item xs={12} md={6}>
            <Stack spacing={2}>
              <Typography variant="h4" component="h1">
                {product.name}
              </Typography>
              
              <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
                ${product.price?.toFixed(2)}
              </Typography>

              <Divider />
              
              <Typography 
                variant="body1" 
                color={product.stock > 0 ? 'success.main' : 'error.main'}
                sx={{ fontWeight: 'medium' }}
              >
                {product.stock > 0 ? `${product.stock} units in stock` : 'Out of stock'}
              </Typography>

              <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                {product.description}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <TextField
                  type="number"
                  label="Quantity"
                  value={quantity}
                  onChange={handleQuantityChange}
                  InputProps={{ 
                    inputProps: { min: 1 }
                  }}
                  size="small"
                  sx={{ width: 100 }}
                />
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={handleAddToCart}
                  size="large"
                  disabled={product.stock === 0 || isQuantityInvalid}
                >
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>
              </Box>

              {/* Stock availability message */}
              {isQuantityInvalid ? (
                <Typography variant="body2" color="error">
                  Only {product.stock} items available
                </Typography>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  {product.stock > 0 
                    ? `${product.stock} items in stock`
                    : 'Currently out of stock'
                  }
                </Typography>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Success Message */}
      <Snackbar 
        open={showSuccess} 
        autoHideDuration={3000} 
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowSuccess(false)} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          Product added to cart successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductDetail;

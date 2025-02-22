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
  Alert
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
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

              <Button 
                variant="contained" 
                size="large"
                disabled={product.stock === 0}
                sx={{ mt: 2 }}
              >
                Add to Cart
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ProductDetail;

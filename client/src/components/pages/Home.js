import { useState, useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import SearchBar from '../products/SearchBar';
import ProductList from '../products/ProductList';
import axios from 'axios';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all products on initial load
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 2 }}>
      <Typography variant="h3" gutterBottom align="center">
        Welcome to Tech Store
      </Typography>
      <Typography variant="h6" gutterBottom align="center" color="text.secondary">
        Discover the Latest in Technology
      </Typography>

      <SearchBar onSearchResults={setProducts} />

      {loading ? (
        <Typography align="center">Loading products...</Typography>
      ) : products.length > 0 ? (
        <ProductList products={products} />
      ) : (
        <Typography align="center" color="text.secondary">
          No products found. Try a different search term.
        </Typography>
      )}
    </Container>
  );
};

export default Home;
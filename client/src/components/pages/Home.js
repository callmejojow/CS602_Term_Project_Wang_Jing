import { Box, Container, Typography } from '@mui/material';
import ProductList from '../products/ProductList';

const Home = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Box 
        sx={{ 
          bgcolor: 'primary.main', 
          color: 'white',
          py: 8,
          mb: 4
        }}
      >
        <Container maxWidth="lg">
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 'bold',
              textAlign: 'center' 
            }}
          >
            Welcome to Tech Store
          </Typography>
          <Typography 
            variant="h5" 
            component="h2"
            sx={{ 
              textAlign: 'center',
              opacity: 0.9
            }}
          >
            Discover the Latest in Technology
          </Typography>
        </Container>
      </Box>

      {/* Featured Categories */}
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Typography 
          variant="h4" 
          component="h2" 
          gutterBottom
          sx={{ 
            textAlign: 'center',
            mb: 4
          }}
        >
          Featured Products
        </Typography>
        
        {/* Product List Component */}
        <ProductList />
      </Container>

      {/* Why Choose Us Section */}
      <Box sx={{ bgcolor: 'grey.100', py: 6 }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h4" 
            component="h2" 
            gutterBottom
            sx={{ textAlign: 'center', mb: 4 }}
          >
            Why Choose Us
          </Typography>
          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: '1fr 1fr 1fr'
              },
              gap: 4
            }}
          >
            {[
              {
                title: 'Quality Products',
                description: 'Curated selection of the best tech products'
              },
              {
                title: 'Fast Shipping',
                description: 'Quick and reliable delivery to your doorstep'
              },
              {
                title: 'Secure Shopping',
                description: 'Safe and secure shopping experience'
              }
            ].map((feature, index) => (
              <Box key={index} sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography color="text.secondary">
                  {feature.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
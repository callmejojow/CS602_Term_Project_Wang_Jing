import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getCartItemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); 
  };

  const handleCartClick = (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
    } else {
      navigate('/cart');
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography 
          variant="h6" 
          component={RouterLink} 
          to="/" 
          sx={{ 
            textDecoration: 'none', 
            color: 'inherit',
            mr: 2
          }}
        >
          Jing's Gizmo Trove
        </Typography>

        <Button 
          color="inherit" 
          component={RouterLink} 
          to="/"
          sx={{ mr: 'auto' }}
        >
          Products
        </Button>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton 
            color="inherit" 
            onClick={handleCartClick}
            size="large"
          >
            <Badge badgeContent={user ? getCartItemCount() : 0} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>

          {user ? (
            <>
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/profile"
              >
                {user.name}
              </Button>
              <Button 
                color="inherit" 
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button 
              color="inherit" 
              component={RouterLink} 
              to="/login"
            >
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
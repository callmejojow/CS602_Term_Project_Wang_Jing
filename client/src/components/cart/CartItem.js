import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Box, 
  IconButton, 
  TextField, 
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [quantity, setQuantity] = useState(item.quantity);
  const [error, setError] = useState('');

  const imageUrl = `http://localhost:3000${item.product.image}`;

  const handleQuantityChange = async (e) => {
    const value = parseInt(e.target.value);
    if (!value || value < 1) return;
    
    setQuantity(value);
    setError('');

    // Validate quantity
    if (value > item.product.stock) {
      setError(`Only ${item.product.stock} items available`);
      return;
    }

    // Update cart
    setIsUpdating(true);
    try {
      await onUpdateQuantity(item.product._id, value);
    } catch (error) {
      console.error('Failed to update:', error);
      setQuantity(item.quantity); // Reset to previous quantity
      setError('Failed to update quantity');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <Grid container>
        <Grid item xs={4} sm={3}>
          <CardMedia
            component="img"
            sx={{ height: 140, objectFit: 'contain', p: 1 }}
            image={imageUrl}
            alt={item.product.name}
          />
        </Grid>
        <Grid item xs={8} sm={9}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {item.product.name}
            </Typography>
            <Typography variant="body1" color="primary" gutterBottom>
              ${item.product.price.toFixed(2)}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ position: 'relative' }}>
                  <TextField
                    type="number"
                    size="small"
                    value={quantity}
                    onChange={handleQuantityChange}
                    InputProps={{ 
                      inputProps: { min: 1 }
                    }}
                    sx={{ width: 80 }}
                    disabled={isUpdating}
                  />
                  {isUpdating && (
                    <CircularProgress
                      size={24}
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        marginTop: '-12px',
                        marginLeft: '-12px'
                      }}
                    />
                  )}
                </Box>
                <IconButton 
                  color="error" 
                  onClick={() => setShowConfirmDialog(true)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
              {error && (
                <Typography variant="body2" color="error">
                  {error}
                </Typography>
              )}
            </Box>
          </CardContent>
        </Grid>
      </Grid>

      <Dialog
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
      >
        <DialogTitle>Remove Item</DialogTitle>
        <DialogContent>
          Are you sure you want to remove {item.product.name} from your cart?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmDialog(false)}>Cancel</Button>
          <Button onClick={() => {
            setShowConfirmDialog(false);
            onRemove(item._id);
          }} color="error" autoFocus>
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default CartItem;

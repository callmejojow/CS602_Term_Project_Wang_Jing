import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box
} from '@mui/material';

const OrderSummary = ({ items, total }) => {
  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Order Summary
      </Typography>
      <List>
        {items.map((item) => (
          <ListItem key={item._id} sx={{ py: 1, px: 0 }}>
            <ListItemText
              primary={item.product.name}
              secondary={`Quantity: ${item.quantity}`}
            />
            <Typography variant="body2">
              ${(item.product.price * item.quantity).toFixed(2)}
            </Typography>
          </ListItem>
        ))}
        <Divider sx={{ my: 1 }} />
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Total" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            ${total.toFixed(2)}
          </Typography>
        </ListItem>
      </List>
    </Paper>
  );
};

export default OrderSummary;

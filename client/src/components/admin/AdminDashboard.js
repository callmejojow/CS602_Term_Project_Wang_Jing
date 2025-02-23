import { 
  Box, 
  Drawer, 
  List, 
  ListItemButton,
  ListItemIcon, 
  ListItemText,
  Container
} from '@mui/material';
import { 
  Inventory as InventoryIcon,
  People as PeopleIcon,
  ShoppingCart as OrdersIcon
} from '@mui/icons-material';
import { useState } from 'react';
import ProductManagement from './products/ProductManagement';
import OrderManagement from './orders/OrderManagement';

const AdminDashboard = () => {
  const [selectedMenu, setSelectedMenu] = useState('Products'); // Default to Products
  const drawerWidth = 240;

  const menuItems = [
    { text: 'Products', icon: <InventoryIcon />, component: <ProductManagement /> },
    { text: 'Customers', icon: <PeopleIcon />, component: null }, // Will add later
    { text: 'Orders', icon: <OrdersIcon />, component: <OrderManagement /> }
  ];

  const handleMenuSelect = (menuText) => {
    setSelectedMenu(menuText);
  };

  return (
    <Box sx={{ display: 'flex', pt: 8 }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { 
            width: drawerWidth, 
            boxSizing: 'border-box',
            top: '64px',
            height: 'calc(100% - 64px)',
          },
        }}
      >
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {menuItems.map((item) => (
              <ListItemButton 
                key={item.text}
                onClick={() => handleMenuSelect(item.text)}
                selected={selectedMenu === item.text}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Container>
          {menuItems.find(item => item.text === selectedMenu)?.component}
        </Container>
      </Box>
    </Box>
  );
};

export default AdminDashboard; 
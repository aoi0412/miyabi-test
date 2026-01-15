import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Toolbar,
  Box
} from '@mui/material';
import AlbumIcon from '@mui/icons-material/Album';
import PersonIcon from '@mui/icons-material/Person';
import OfflinePinIcon from '@mui/icons-material/OfflinePin';
import SettingsIcon from '@mui/icons-material/Settings';

const drawerWidth = 240;

interface NavigationProps {
  mobileOpen: boolean;
  onDrawerToggle: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
}

export function Navigation({
  mobileOpen,
  onDrawerToggle,
  onNavigate,
  currentPage
}: NavigationProps) {
  const menuItems = [
    { id: 'albums', label: 'アルバム', icon: <AlbumIcon /> },
    { id: 'artists', label: 'アーティスト', icon: <PersonIcon /> },
    { id: 'offline', label: 'オフライン', icon: <OfflinePinIcon /> },
  ];

  const drawer = (
    <Box>
      <Toolbar>
        <Box sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Miyabi</Box>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              selected={currentPage === item.id}
              onClick={() => {
                onNavigate(item.id);
                onDrawerToggle();
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton
            selected={currentPage === 'settings'}
            onClick={() => {
              onNavigate('settings');
              onDrawerToggle();
            }}
          >
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="設定" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
}

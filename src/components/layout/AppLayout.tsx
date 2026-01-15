import React, { useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Navigation } from './Navigation';
import { Player } from '../player/Player';

interface AppLayoutProps {
  children: React.ReactNode;
  title: string;
  onNavigate: (page: string) => void;
  currentPage: string;
}

const drawerWidth = 240;

export function AppLayout({ children, title, onNavigate, currentPage }: AppLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` }
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            {title}
          </Typography>
        </Toolbar>
      </AppBar>

      <Navigation
        mobileOpen={mobileOpen}
        onDrawerToggle={handleDrawerToggle}
        onNavigate={onNavigate}
        currentPage={currentPage}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          pb: 12
        }}
      >
        <Toolbar />
        {children}
      </Box>

      <Player />
    </Box>
  );
}

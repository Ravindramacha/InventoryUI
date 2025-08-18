import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import MenuBar from './MenuBar';
import DrawerApp from './DrawerApp';

export default function MainLayout() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  React.useEffect(() => {
    if (!isSmallScreen) {
      setDrawerOpen(true);
    }
  }, [isSmallScreen]);


  const toggleDrawer = () => {
    setDrawerOpen((prev) => !prev);
  };

  const handleDrawerClose = () => {
    if (isSmallScreen) setDrawerOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <MenuBar onMenuClick={toggleDrawer} />

      <DrawerApp
        open={drawerOpen}
        onClose={handleDrawerClose}
        isSmallScreen={isSmallScreen}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 6,
          width: '100%',
          transition: 'margin 0.3s',
          // overflowY: 'auto',
          overflowX: 'hidden',
          minWidth: 0,
        }}
      >
        {/* <Box
        component={Paper}
        sx={{
          p: 4,
          bgcolor: '#ffffff',
          pr: 2,
          width: '100%',
          boxSizing: 'border-box',
        }}
      > */}
        <Outlet/>
      {/* </Box> */}
      </Box>
    </Box>
  );
}

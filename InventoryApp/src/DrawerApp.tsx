import { useState } from 'react';
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@mui/material';
import {
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';
import { Collapse } from '@mui/material';

import HomeIcon from '@mui/icons-material/Home';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useNavigate } from 'react-router-dom';

const expandedWidth = 250;
const collapsedWidth = 64;

const menuItems = [
  { text: 'Home', icon: <HomeIcon />, path: '/home' },

  {
    text: 'Products',
    icon: <Inventory2Icon />,
    children: [
      { text: 'View All', path: '/products' },
      { text: 'Categories', path: '/products/categories' },
      { text: 'New Product', path: '/products/new' },
    ],
  },

  {
    text: 'Application',
    icon: <AccountBoxIcon />,
    children: [
      { text: 'New Application', path: '/form' },
      { text: 'Submitted', path: '/form/submitted' },
    ],
  },

  {
    text: 'Dashboard',
    icon: <DashboardIcon />,
    children: [
      { text: 'Analytics', path: '/dashboard/analytics' },
      { text: 'Reports', path: '/dashboard/reports' },
    ],
  },
];



export default function DrawerApp({
  open,
  onClose,
  isSmallScreen,
}: {
  open: boolean;
  onClose: () => void;
  isSmallScreen: boolean; // ✅ this is required
}) {
  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();

  const isExpanded = open;
  const drawerWidth = isExpanded ? expandedWidth : collapsedWidth;

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isSmallScreen && isExpanded) onClose(); // Close temporary drawer on nav
  };

  const drawerVariant = isSmallScreen
    ? isExpanded
      ? 'temporary'
      : 'permanent'
    : 'permanent';

  const drawerOpen = isSmallScreen ? isExpanded : true;

  const toggleSubMenu = (label: string) => {
  setOpenSubMenus((prev) => ({
    ...prev,
    [label]: !prev[label],
  }));
};


  return (
    <Drawer
      variant={drawerVariant}
      open={drawerOpen}
      onClose={isSmallScreen && isExpanded ? onClose : undefined}
      ModalProps={{ keepMounted: true }}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          overflowX: 'hidden',
          transition: 'width 0.3s',
        },
      }}
    >
      <Box sx={{ width: drawerWidth }}>
        <Box sx={(theme) => theme.mixins.toolbar} />
        <List>
          {menuItems.map(({ text, icon, path, children }) => (
  <Box key={text}>
    <ListItem disablePadding sx={{ display: 'block' }}>
      <Tooltip title={!isExpanded ? text : ''} placement="right">
        <ListItemButton
          onClick={() =>
            children ? toggleSubMenu(text) : handleNavigation(path!)
          }
          sx={{
            minHeight: 48,
            justifyContent: isExpanded ? 'initial' : 'center',
            px: 2.5,
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: isExpanded ? 2 : 'auto',
              justifyContent: 'center',
            }}
          >
            {icon}
          </ListItemIcon>
          {isExpanded && (
            <>
              <ListItemText primary={text} />
              {children &&
                (openSubMenus[text] ? <ExpandLess /> : <ExpandMore />)}
            </>
          )}
        </ListItemButton>
      </Tooltip>
    </ListItem>

    {/* Sub-items */}
    {children && (
      <Collapse in={openSubMenus[text]} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {children.map((child) => (
            <ListItemButton
              key={child.text}
              sx={{
                pl: isExpanded ? 6 : 2,
                justifyContent: isExpanded ? 'initial' : 'center',
              }}
              onClick={() => handleNavigation(child.path)}
            >
              {isExpanded && (
                <ListItemText primary={child.text} />
              )}
              {!isExpanded && (
                <Tooltip title={child.text} placement="right">
                  <ListItemText primary={''} />
                </Tooltip>
              )}
            </ListItemButton>
          ))}
        </List>
      </Collapse>
    )}
  </Box>
))}

        </List>
      </Box>
    </Drawer>
  );
}

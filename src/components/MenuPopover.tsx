import React from 'react';
import { Popover, List, ListItemButton, ListItemText } from '@mui/material';

export interface MenuItem {
  label: string;
  onClick: () => void;
}

interface MenuPopoverProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
}

const MenuPopover: React.FC<MenuPopoverProps> = ({ anchorEl, open, onClose, menuItems }) => {
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      container={document.body} // ✅ prevents clipping
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      PaperProps={{
        sx: {
          zIndex: 3000, // ✅ correct place for zIndex
        },
      }}
    >
      <List sx={{ minWidth: 200, p: 0 }}>
        {menuItems.map((item, index) => (
          <ListItemButton
            key={index}
            onClick={() => {
              item.onClick();
              onClose(); // ✅ auto close menu
            }}
          >
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Popover>
  );
};

export default MenuPopover;

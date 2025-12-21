import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const DarkModeToggle = ({ darkMode, onToggle }) => {
  return (
    <Tooltip title={darkMode ? 'Light Mode' : 'Dark Mode'}>
      <IconButton
        onClick={onToggle}
        sx={{
          color: 'text.secondary',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.2)',
            transform: 'rotate(180deg)',
            transition: 'transform 0.3s ease'
          }
        }}
      >
        {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </Tooltip>
  );
};

export default DarkModeToggle;


import React from 'react';
import PropTypes from 'prop-types';
import { Box, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { motion } from 'framer-motion';

const SearchBar = ({ value, onChange }) => {
  return (
    <motion.div
      whileFocus={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <TextField
        fullWidth
        aria-label="Search AI tools"
        placeholder="Search AI tools..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        sx={{
          '& .MuiOutlinedInput-root': {
            background: 'rgba(255, 255, 255, 0.35)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '16px',
            border: '1.5px solid rgba(107, 182, 255, 0.3)',
            boxShadow: '0 8px 32px 0 rgba(107, 182, 255, 0.15)',
            transition: 'all 0.3s ease',
            '&:hover': {
              border: '1.5px solid rgba(107, 182, 255, 0.5)',
              boxShadow: '0 12px 48px 0 rgba(107, 182, 255, 0.25)',
              background: 'rgba(255, 255, 255, 0.4)'
            },
            '&.Mui-focused': {
              border: '2px solid #6BB6FF',
              boxShadow: '0 12px 48px 0 rgba(107, 182, 255, 0.35)',
              background: 'rgba(255, 255, 255, 0.45)'
            },
            '& fieldset': {
              border: 'none'
            }
          },
          '& .MuiInputBase-input': {
            color: 'text.primary',
            fontSize: { xs: '0.95rem', md: '1rem' },
            py: { xs: 1.5, md: 2 }
          },
          '& .MuiInputBase-input::placeholder': {
            color: 'text.secondary',
            opacity: 0.7
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: '#6BB6FF', opacity: 0.8 }} />
            </InputAdornment>
          )
        }}
      />
    </motion.div>
  );
};

SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default React.memo(SearchBar);


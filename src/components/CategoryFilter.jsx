import React from 'react';
import { Box, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { categoryColors } from '../data/tools.js';

const CategoryFilter = ({ categories, selected, onChange }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1.5,
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {categories.map((category, index) => {
        const isSelected = category === selected;
        const categoryColor = category === 'All' 
          ? '#B8E0F2' 
          : categoryColors[category] || categoryColors.Other;

        return (
          <motion.div
            key={category}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Chip
              label={category}
              onClick={() => onChange(category)}
              sx={{
                background: isSelected
                  ? `linear-gradient(135deg, ${categoryColor} 0%, ${categoryColor}ee 100%)`
                  : 'rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: isSelected
                  ? `2px solid ${categoryColor}`
                  : '1.5px solid rgba(255, 255, 255, 0.3)',
                color: isSelected ? 'white' : '#718096',
                fontWeight: isSelected ? 700 : 600,
                fontSize: { xs: '0.8rem', sm: '0.875rem' },
                px: 1.5,
                py: 2.5,
                height: 'auto',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: isSelected
                  ? `0 4px 16px ${categoryColor}50`
                  : '0 4px 16px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  background: isSelected
                    ? `linear-gradient(135deg, ${categoryColor}ff 0%, ${categoryColor} 100%)`
                    : `linear-gradient(135deg, ${categoryColor}30 0%, ${categoryColor}15 100%)`,
                  border: `2px solid ${categoryColor}`,
                  boxShadow: `0 6px 24px ${categoryColor}60`,
                  transform: 'translateY(-2px)',
                  color: isSelected ? 'white' : categoryColor
                }
              }}
            />
          </motion.div>
        );
      })}
    </Box>
  );
};

export default CategoryFilter;


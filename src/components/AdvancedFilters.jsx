import React from 'react';
import PropTypes from 'prop-types';
import { Box, FormControl, InputLabel, Select, MenuItem, Chip, Stack, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const AdvancedFilters = ({ 
  pricingFilter, 
  onPricingChange, 
  sortBy, 
  onSortChange,
  selectedTags,
  onTagToggle,
  availableTags
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          mb: 3,
          p: 2,
          background: 'rgba(255, 255, 255, 0.35)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          border: '1.5px solid rgba(107, 182, 255, 0.3)',
          boxShadow: '0 8px 32px rgba(107, 182, 255, 0.15)'
        }}
      >
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel id="pricing-filter-label">Pricing</InputLabel>
          <Select
            value={pricingFilter}
            label="Pricing"
            labelId="pricing-filter-label"
            aria-label="Filter by pricing model"
            onChange={(e) => onPricingChange(e.target.value)}
            sx={{
              background: 'rgba(255, 255, 255, 0.3)',
              borderRadius: '8px',
              '& .MuiOutlinedInput-notchedOutline': {
                border: '1.5px solid rgba(107, 182, 255, 0.3)'
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                border: '1.5px solid rgba(107, 182, 255, 0.5)'
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                border: '2px solid #6BB6FF'
              }
            }}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Free">Free</MenuItem>
            <MenuItem value="Freemium">Freemium</MenuItem>
            <MenuItem value="Paid">Paid</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel id="sort-by-label">Sort By</InputLabel>
          <Select
            value={sortBy}
            label="Sort By"
            labelId="sort-by-label"
            aria-label="Sort tools"
            onChange={(e) => onSortChange(e.target.value)}
            sx={{
              background: 'rgba(255, 255, 255, 0.3)',
              borderRadius: '8px',
              '& .MuiOutlinedInput-notchedOutline': {
                border: '1.5px solid rgba(107, 182, 255, 0.3)'
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                border: '1.5px solid rgba(107, 182, 255, 0.5)'
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                border: '2px solid #6BB6FF'
              }
            }}
          >
            <MenuItem value="name">Name (A-Z)</MenuItem>
            <MenuItem value="name-desc">Name (Z-A)</MenuItem>
            <MenuItem value="newest">Newest First</MenuItem>
            <MenuItem value="popular">Most Popular</MenuItem>
          </Select>
        </FormControl>

        {availableTags && availableTags.length > 0 && (
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
              Filter by Tags:
            </Typography>
            <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
              {availableTags.slice(0, 10).map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  onClick={() => onTagToggle(tag)}
                  aria-label={`${selectedTags.includes(tag) ? 'Remove' : 'Add'} ${tag} tag filter`}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onTagToggle(tag);
                    }
                  }}
                  sx={{
                    background: selectedTags.includes(tag)
                      ? 'linear-gradient(135deg, rgba(107, 182, 255, 0.4) 0%, rgba(107, 182, 255, 0.25) 100%)'
                      : 'rgba(255, 255, 255, 0.3)',
                    border: selectedTags.includes(tag)
                      ? '1.5px solid #6BB6FF'
                      : '1.5px solid rgba(255, 255, 255, 0.3)',
                    color: selectedTags.includes(tag) ? '#6BB6FF' : 'text.primary',
                    fontWeight: selectedTags.includes(tag) ? 600 : 500,
                    cursor: 'pointer',
                    boxShadow: selectedTags.includes(tag)
                      ? '0 2px 8px rgba(107, 182, 255, 0.3)'
                      : 'none',
                    '&:hover': {
                      background: selectedTags.includes(tag)
                        ? 'linear-gradient(135deg, rgba(107, 182, 255, 0.5) 0%, rgba(107, 182, 255, 0.35) 100%)'
                        : 'rgba(255, 255, 255, 0.4)',
                      border: '1.5px solid #6BB6FF',
                      transform: 'scale(1.05)',
                      boxShadow: '0 4px 12px rgba(107, 182, 255, 0.3)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                />
              ))}
            </Stack>
          </Box>
        )}
      </Box>
    </motion.div>
  );
};

AdvancedFilters.propTypes = {
  pricingFilter: PropTypes.string.isRequired,
  onPricingChange: PropTypes.func.isRequired,
  sortBy: PropTypes.string.isRequired,
  onSortChange: PropTypes.func.isRequired,
  selectedTags: PropTypes.arrayOf(PropTypes.string).isRequired,
  onTagToggle: PropTypes.func.isRequired,
  availableTags: PropTypes.arrayOf(PropTypes.string),
};

AdvancedFilters.defaultProps = {
  availableTags: [],
};

export default React.memo(AdvancedFilters);


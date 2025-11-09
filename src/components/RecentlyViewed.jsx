import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Grid, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import ClearIcon from '@mui/icons-material/Clear';
import ToolCard from './ToolCard';
import { useFavorites } from '../hooks/useFavorites';
import { useRecentlyViewed } from '../hooks/useRecentlyViewed';

const RecentlyViewed = ({ allTools, onToolClick }) => {
  const { recentlyViewed, clearRecent } = useRecentlyViewed();
  const { isFavorite, toggleFavorite } = useFavorites();

  const recentTools = allTools.filter(tool => recentlyViewed.includes(tool.id)).slice(0, 4);

  if (recentTools.length === 0) return null;

  return (
    <Box sx={{ mb: 6 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Recently Viewed
        </Typography>
        <IconButton
          onClick={clearRecent}
          size="small"
          aria-label="Clear recently viewed tools"
          sx={{
            color: 'text.secondary',
            '&:hover': {
              color: 'error.main'
            }
          }}
        >
          <ClearIcon />
        </IconButton>
      </Box>
      <Grid container spacing={3}>
        {recentTools.map((tool, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={tool.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ToolCard
                tool={tool}
                onFavorite={toggleFavorite}
                isFavorite={isFavorite(tool.id)}
                onClick={onToolClick}
              />
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

RecentlyViewed.propTypes = {
  allTools: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  onToolClick: PropTypes.func,
};

RecentlyViewed.defaultProps = {
  onToolClick: undefined,
};

export default React.memo(RecentlyViewed);


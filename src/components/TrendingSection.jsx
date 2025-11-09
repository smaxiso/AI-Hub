import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import ToolCard from './ToolCard';
import { useFavorites } from '../hooks/useFavorites';

const TrendingSection = ({ tools, onToolClick }) => {
  const { isFavorite, toggleFavorite } = useFavorites();

  if (tools.length === 0) return null;

  return (
    <Box sx={{ mb: 6 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          🔥 Trending Tools
        </Typography>
        <Grid container spacing={3}>
          {tools.map((tool, index) => (
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
      </motion.div>
    </Box>
  );
};

export default TrendingSection;


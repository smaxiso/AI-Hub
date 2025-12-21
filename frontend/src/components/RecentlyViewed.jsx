import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Grid, IconButton, Collapse, Paper, Chip, useTheme } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import ClearIcon from '@mui/icons-material/Clear';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import HistoryIcon from '@mui/icons-material/History';
import ToolCard from './ToolCard';
import { useFavorites } from '../hooks/useFavorites';
import { useRecentlyViewed } from '../hooks/useRecentlyViewed';

const RecentlyViewed = ({ allTools, onToolClick = undefined }) => {
  const { recentlyViewed, clearRecent } = useRecentlyViewed();
  const { isFavorite, toggleFavorite } = useFavorites();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  
  // Collapsed by default
  const [isExpanded, setIsExpanded] = useState(false);

  const recentTools = allTools.filter(tool => recentlyViewed.includes(tool.id)).slice(0, 4);

  if (recentTools.length === 0) return null;

  return (
    <Paper
      elevation={0}
      sx={{
        mb: 4,
        p: { xs: 2, sm: 3 },
        background: isDarkMode
          ? 'rgba(255, 255, 255, 0.05)'
          : 'rgba(255, 255, 255, 0.6)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '16px',
        border: `2px dashed ${isDarkMode ? 'rgba(160, 174, 192, 0.3)' : 'rgba(113, 128, 150, 0.3)'}`,
        boxShadow: isDarkMode
          ? '0 4px 20px rgba(0, 0, 0, 0.3)'
          : '0 4px 20px rgba(0, 0, 0, 0.08)',
        transition: 'all 0.3s ease'
      }}
    >
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          cursor: 'pointer',
          userSelect: 'none'
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
          <HistoryIcon sx={{ 
            color: isDarkMode ? '#90CDF4' : '#6BB6FF',
            fontSize: { xs: '1.5rem', sm: '1.75rem' }
          }} />
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600,
              fontSize: { xs: '1rem', sm: '1.25rem' },
              color: isDarkMode ? '#E2E8F0' : '#2D3748'
            }}
          >
            Recently Viewed
          </Typography>
          <Chip 
            label={recentTools.length}
            size="small"
            sx={{
              height: '24px',
              fontSize: '0.75rem',
              fontWeight: 700,
              background: isDarkMode
                ? 'linear-gradient(135deg, #90CDF4 0%, #A78BFA 100%)'
                : 'linear-gradient(135deg, #6BB6FF 0%, #A78BFA 100%)',
              color: 'white'
            }}
          />
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              clearRecent();
            }}
            size="small"
            aria-label="Clear recently viewed tools"
            sx={{
              color: 'text.secondary',
              minWidth: { xs: 36, sm: 40 },
              minHeight: { xs: 36, sm: 40 },
              '&:hover': {
                color: 'error.main',
                background: 'rgba(251, 113, 133, 0.1)'
              }
            }}
          >
            <ClearIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            aria-label={isExpanded ? "Collapse recently viewed" : "Expand recently viewed"}
            sx={{
              color: isDarkMode ? '#90CDF4' : '#6BB6FF',
              minWidth: { xs: 36, sm: 40 },
              minHeight: { xs: 36, sm: 40 },
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease'
            }}
          >
            <ExpandMoreIcon />
          </IconButton>
        </Box>
      </Box>
      
      <Collapse in={isExpanded} timeout={300}>
        <Box sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            {recentTools.map((tool, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={tool.id}>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <ToolCard
                        tool={tool}
                        onFavorite={toggleFavorite}
                        isFavorite={isFavorite(tool.id)}
                        onClick={onToolClick}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Collapse>
    </Paper>
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

export default React.memo(RecentlyViewed);


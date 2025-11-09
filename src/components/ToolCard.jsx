import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Card, CardContent, IconButton, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { categoryColors } from '../data/tools.js';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareButton from './ShareButton';
import { trackToolClick } from '../utils/analytics';

const ToolCard = ({ tool, onFavorite, isFavorite, onClick }) => {
  const categoryColor = categoryColors[tool.category] || categoryColors.Other;

  const handleClick = (e) => {
    e.preventDefault();
    trackToolClick(tool.id, tool.name);
    if (onClick) {
      onClick(tool);
    } else {
      window.open(tool.url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (onFavorite) {
      onFavorite(tool.id);
    }
  };

  return (
    <motion.div
      whileHover={{ 
        y: -8,
        scale: 1.02,
        transition: { duration: 0.3 }
      }}
      whileTap={{ scale: 0.98 }}
      style={{ height: '100%' }}
    >
      <Card
        role="article"
        aria-label={`${tool.name} - ${tool.category} tool`}
        onClick={handleClick}
        onKeyPress={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick(e);
          }
        }}
        tabIndex={0}
        sx={{
          height: '100%',
          background: 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          position: 'relative',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          '&:hover': {
            boxShadow: '0 12px 48px 0 rgba(0, 0, 0, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            '& .action-buttons': {
              opacity: 1
            }
          }
        }}
      >
        {/* Category indicator bar */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${categoryColor} 0%, ${categoryColor}dd 100%)`,
            zIndex: 1
          }}
        />

        {/* New badge */}
        {tool.isNew && (
          <Chip
            label="New"
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              zIndex: 3,
              background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
              color: 'white',
              fontSize: '0.65rem',
              height: '20px',
              fontWeight: 600,
              boxShadow: '0 2px 8px rgba(255, 107, 107, 0.4)'
            }}
          />
        )}

        {/* Action buttons (favorite, share) */}
        <Box
          className="action-buttons"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 3,
            display: 'flex',
            gap: 0.5,
            opacity: 0,
            transition: 'opacity 0.3s ease',
            background: 'rgba(255, 255, 255, 0.35)',
            backdropFilter: 'blur(15px)',
            borderRadius: '12px',
            p: 0.5,
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <IconButton
            size="small"
            onClick={handleFavoriteClick}
            aria-label={isFavorite ? `Remove ${tool.name} from favorites` : `Add ${tool.name} to favorites`}
            sx={{
              color: isFavorite ? '#FF6B9D' : '#718096',
              background: isFavorite ? 'rgba(255, 107, 157, 0.15)' : 'transparent',
              '&:hover': {
                background: isFavorite ? 'rgba(255, 107, 157, 0.25)' : 'rgba(255, 255, 255, 0.3)',
                transform: 'scale(1.1)'
              },
              transition: 'all 0.2s ease'
            }}
          >
            {isFavorite ? (
              <FavoriteIcon fontSize="small" />
            ) : (
              <FavoriteBorderIcon fontSize="small" />
            )}
          </IconButton>
          <ShareButton tool={tool} />
        </Box>

        {/* 3D gradient overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%)',
            pointerEvents: 'none',
            zIndex: 1
          }}
        />

        <CardContent
          sx={{
            width: '100%',
            p: { xs: 2, sm: 2.5, md: 3 },
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}
        >
          {/* Icon */}
          <motion.div
            className="icon-container"
            whileHover={{ rotate: [0, -5, 5, -5, 0] }}
            transition={{ duration: 0.5 }}
            style={{
              marginBottom: '12px',
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              background: 'rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.3s ease'
            }}
          >
            {tool.icon ? (
              <img
                src={tool.icon}
                alt={tool.name}
                loading="lazy"
                decoding="async"
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '8px',
                  objectFit: 'cover'
                }}
              />
            ) : (
              <Box
                sx={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '8px',
                  background: `linear-gradient(135deg, ${categoryColor} 0%, ${categoryColor}dd 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '1.25rem'
                  }}
                >
                  {tool.name.charAt(0)}
                </Typography>
              </Box>
            )}
          </motion.div>

          {/* Tool Name */}
          <Typography
            variant="h6"
            component="h3"
            sx={{
              fontWeight: 600,
              mb: 0.5,
              color: 'text.primary',
              fontSize: { xs: '0.95rem', sm: '1rem', md: '1.1rem' },
              lineHeight: 1.3
            }}
          >
            {tool.name}
          </Typography>

          {/* Description preview - hide on small mobile */}
          {tool.description && (
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                mb: 0.5,
                fontSize: { xs: '0.65rem', sm: '0.7rem' },
                lineHeight: 1.3,
                display: { xs: 'none', sm: '-webkit-box' },
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {tool.description}
            </Typography>
          )}

          {/* Badges row */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 0.5, sm: 0.5 }, justifyContent: 'center', mt: { xs: 0.5, sm: 1 } }}>
            {/* Category Badge */}
            <Chip
              label={tool.category}
              size="small"
              sx={{
                background: `linear-gradient(135deg, ${categoryColor}30 0%, ${categoryColor}15 100%)`,
                border: `1.5px solid ${categoryColor}`,
                fontSize: { xs: '0.65rem', sm: '0.7rem' },
                height: { xs: '20px', sm: '22px' },
                fontWeight: 600,
                color: categoryColor,
                boxShadow: `0 2px 8px ${categoryColor}30`,
                '&:hover': {
                  background: `linear-gradient(135deg, ${categoryColor}40 0%, ${categoryColor}25 100%)`,
                  transform: 'scale(1.05)'
                },
                transition: 'all 0.2s ease'
              }}
            />

            {/* Pricing badge */}
            {tool.pricing && (
              <Chip
                label={tool.pricing}
                size="small"
                sx={{
                  fontSize: { xs: '0.65rem', sm: '0.7rem' },
                  height: { xs: '20px', sm: '22px' },
                  fontWeight: 600,
                  background: tool.pricing === 'Free' 
                    ? 'linear-gradient(135deg, rgba(52, 211, 153, 0.25) 0%, rgba(52, 211, 153, 0.15) 100%)' 
                    : tool.pricing === 'Paid'
                    ? 'linear-gradient(135deg, rgba(251, 113, 133, 0.25) 0%, rgba(251, 113, 133, 0.15) 100%)'
                    : 'linear-gradient(135deg, rgba(107, 182, 255, 0.25) 0%, rgba(107, 182, 255, 0.15) 100%)',
                  border: tool.pricing === 'Free'
                    ? '1.5px solid #34D399'
                    : tool.pricing === 'Paid'
                    ? '1.5px solid #FB7185'
                    : '1.5px solid #6BB6FF',
                  color: tool.pricing === 'Free'
                    ? '#34D399'
                    : tool.pricing === 'Paid'
                    ? '#FB7185'
                    : '#6BB6FF',
                  boxShadow: tool.pricing === 'Free'
                    ? '0 2px 8px rgba(52, 211, 153, 0.3)'
                    : tool.pricing === 'Paid'
                    ? '0 2px 8px rgba(251, 113, 133, 0.3)'
                    : '0 2px 8px rgba(107, 182, 255, 0.3)',
                  '&:hover': {
                    transform: 'scale(1.05)'
                  },
                  transition: 'all 0.2s ease'
                }}
              />
            )}
          </Box>

          {/* External link indicator */}
          <Box
            sx={{
              position: 'absolute',
              bottom: { xs: 8, sm: 12 },
              right: { xs: 8, sm: 12 },
              opacity: 0.6,
              transition: 'opacity 0.3s ease'
            }}
          >
            <OpenInNewIcon
              sx={{
                fontSize: '1rem',
                color: 'text.secondary'
              }}
            />
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

ToolCard.propTypes = {
  tool: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    icon: PropTypes.string,
    description: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    pricing: PropTypes.string,
    useCases: PropTypes.arrayOf(PropTypes.string),
    addedDate: PropTypes.string,
    isNew: PropTypes.bool,
  }).isRequired,
  onFavorite: PropTypes.func,
  isFavorite: PropTypes.bool,
  onClick: PropTypes.func,
};

ToolCard.defaultProps = {
  onFavorite: undefined,
  isFavorite: false,
  onClick: undefined,
};

// Memoize component to prevent unnecessary re-renders
export default React.memo(ToolCard, (prevProps, nextProps) => {
  return (
    prevProps.tool.id === nextProps.tool.id &&
    prevProps.isFavorite === nextProps.isFavorite &&
    prevProps.onClick === nextProps.onClick &&
    prevProps.onFavorite === nextProps.onFavorite
  );
});

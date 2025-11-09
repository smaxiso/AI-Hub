import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';

const EmptyState = ({ 
  icon, 
  title, 
  description, 
  action, 
  actionLabel,
  onAction 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        sx={{
          textAlign: 'center',
          py: 8,
          px: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {icon && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            style={{ marginBottom: '24px' }}
          >
            {icon}
          </motion.div>
        )}
        
        <Typography
          variant="h5"
          component="h2"
          sx={{
            fontWeight: 700,
            mb: 1.5,
            color: 'text.primary',
            fontSize: { xs: '1.5rem', md: '1.75rem' }
          }}
        >
          {title}
        </Typography>
        
        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            mb: 3,
            maxWidth: '500px',
            lineHeight: 1.6
          }}
        >
          {description}
        </Typography>
        
        {(action || (actionLabel && onAction)) && (
          <Box>
            {action || (
              <Button
                variant="contained"
                onClick={onAction}
                sx={{
                  background: 'linear-gradient(135deg, #6BB6FF 0%, #3B82F6 100%)',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  borderRadius: '12px',
                  fontWeight: 600,
                  textTransform: 'none',
                  boxShadow: '0 8px 24px rgba(107, 182, 255, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 32px rgba(107, 182, 255, 0.4)',
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                {actionLabel}
              </Button>
            )}
          </Box>
        )}
      </Box>
    </motion.div>
  );
};

EmptyState.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  action: PropTypes.node,
  actionLabel: PropTypes.string,
  onAction: PropTypes.func,
};

EmptyState.defaultProps = {
  icon: null,
  action: null,
  actionLabel: null,
  onAction: undefined,
};

export default EmptyState;

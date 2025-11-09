import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';

const EmptyState = ({ icon, title, description, action }) => {
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
          px: 2
        }}
      >
        {icon && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            style={{ display: 'inline-block', marginBottom: '24px' }}
          >
            {icon}
          </motion.div>
        )}
        <Typography
          variant="h5"
          sx={{
            mb: 2,
            fontWeight: 600,
            color: 'text.primary'
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mb: 3,
            color: 'text.secondary',
            maxWidth: '500px',
            mx: 'auto'
          }}
        >
          {description}
        </Typography>
        {action && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {action}
          </motion.div>
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
};

EmptyState.defaultProps = {
  icon: null,
  action: null,
};

export default EmptyState;


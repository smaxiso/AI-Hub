import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Skeleton, Box } from '@mui/material';

/**
 * Skeleton loader for tool cards
 * Displays a loading state while tool data is being fetched
 */
const ToolCardSkeleton = ({ count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Card
          key={index}
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
          }}
        >
          {/* Category indicator bar skeleton */}
          <Skeleton
            variant="rectangular"
            height={4}
            sx={{ borderRadius: 0 }}
            animation="wave"
          />

          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
              {/* Icon skeleton */}
              <Skeleton
                variant="rounded"
                width={48}
                height={48}
                sx={{ borderRadius: '8px' }}
                animation="wave"
              />

              <Box sx={{ flex: 1, pt: 0.5 }}>
                {/* Title skeleton */}
                <Skeleton
                  variant="text"
                  width="80%"
                  height={24}
                  animation="wave"
                  sx={{ mb: 0.5 }}
                />
                {/* Category chip skeleton */}
                <Skeleton
                  variant="rounded"
                  width={60}
                  height={24}
                  sx={{ borderRadius: '12px' }}
                  animation="wave"
                />
              </Box>
            </Box>

            {/* Description skeleton */}
            <Box sx={{ mb: 2 }}>
              <Skeleton variant="text" width="100%" height={16} animation="wave" />
              <Skeleton variant="text" width="90%" height={16} animation="wave" />
              <Skeleton variant="text" width="75%" height={16} animation="wave" />
            </Box>

            {/* Tags skeleton */}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
              <Skeleton variant="rounded" width={60} height={24} sx={{ borderRadius: '12px' }} animation="wave" />
              <Skeleton variant="rounded" width={80} height={24} sx={{ borderRadius: '12px' }} animation="wave" />
              <Skeleton variant="rounded" width={70} height={24} sx={{ borderRadius: '12px' }} animation="wave" />
            </Box>

            {/* Action buttons skeleton */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Skeleton variant="circular" width={40} height={40} animation="wave" />
              <Skeleton variant="circular" width={40} height={40} animation="wave" />
            </Box>
          </CardContent>
        </Card>
      ))}
    </>
  );
};

ToolCardSkeleton.propTypes = {
  count: PropTypes.number,
};

/**
 * General skeleton loader component
 * Can be used for various loading states
 */
export const SkeletonLoader = ({ variant = 'card', count = 1, height, width }) => {
  if (variant === 'card') {
    return <ToolCardSkeleton count={count} />;
  }

  if (variant === 'text') {
    return Array.from({ length: count }).map((_, index) => (
      <Skeleton
        key={index}
        variant="text"
        width={width || '100%'}
        height={height || 20}
        animation="wave"
        sx={{ mb: 1 }}
      />
    ));
  }

  if (variant === 'rectangular') {
    return (
      <Skeleton
        variant="rectangular"
        width={width || '100%'}
        height={height || 200}
        animation="wave"
        sx={{ borderRadius: '12px' }}
      />
    );
  }

  if (variant === 'circular') {
    return (
      <Skeleton
        variant="circular"
        width={width || 40}
        height={height || 40}
        animation="wave"
      />
    );
  }

  return <ToolCardSkeleton count={count} />;
};

SkeletonLoader.propTypes = {
  variant: PropTypes.oneOf(['card', 'text', 'rectangular', 'circular']),
  count: PropTypes.number,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default ToolCardSkeleton;

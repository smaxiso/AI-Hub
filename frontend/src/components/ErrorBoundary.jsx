import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
    
    // In production, you could send this to an error reporting service
    // Example: logErrorToService(error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 4,
            background: 'linear-gradient(135deg, #E8F4F8 0%, #D4C5F9 100%)',
          }}
        >
          <Box
            sx={{
              maxWidth: 600,
              textAlign: 'center',
              p: 4,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
            }}
          >
            <ErrorOutlineIcon
              sx={{
                fontSize: 64,
                color: '#FB7185',
                mb: 2,
              }}
            />
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: '#2D3748' }}>
              Something went wrong
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: '#718096' }}>
              We encountered an unexpected error. Don't worry, your data is safe.
            </Typography>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Box
                sx={{
                  mb: 3,
                  p: 2,
                  background: '#F7FAFC',
                  borderRadius: '8px',
                  textAlign: 'left',
                  maxHeight: '200px',
                  overflow: 'auto',
                }}
              >
                <Typography variant="caption" sx={{ fontFamily: 'monospace', color: '#E53E3E' }}>
                  {this.state.error.toString()}
                </Typography>
              </Box>
            )}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="contained"
                onClick={this.handleReset}
                sx={{
                  background: 'linear-gradient(135deg, #6BB6FF 0%, #3B82F6 100%)',
                  color: 'white',
                  px: 3,
                  py: 1.5,
                  borderRadius: '12px',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                  },
                }}
              >
                Try Again
              </Button>
              <Button
                variant="outlined"
                onClick={this.handleReload}
                sx={{
                  borderColor: '#6BB6FF',
                  color: '#6BB6FF',
                  px: 3,
                  py: 1.5,
                  borderRadius: '12px',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: '#3B82F6',
                    background: 'rgba(107, 182, 255, 0.1)',
                  },
                }}
              >
                Reload Page
              </Button>
            </Box>
          </Box>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;


import { createTheme } from '@mui/material/styles';

export const createAppTheme = (darkMode) => {
  return createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: darkMode ? '#90CDF4' : '#B8E0F2',
        light: darkMode ? '#B8E0F2' : '#D4C5F9',
        dark: darkMode ? '#63B3ED' : '#90CDF4',
      },
      secondary: {
        main: darkMode ? '#D4C5F9' : '#D4C5F9',
        light: darkMode ? '#E9D5FF' : '#E9D5FF',
        dark: darkMode ? '#A78BFA' : '#A78BFA',
      },
      background: {
        default: darkMode ? '#1a1a2e' : '#E8F4F8',
        paper: darkMode ? 'rgba(26, 26, 46, 0.8)' : 'rgba(255, 255, 255, 0.25)',
      },
      text: {
        primary: darkMode ? '#E2E8F0' : '#2D3748',
        secondary: darkMode ? '#A0AEC0' : '#718096',
      },
      divider: darkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
    },
    typography: {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
      h1: {
        fontWeight: 700,
      },
      h2: {
        fontWeight: 700,
      },
      h3: {
        fontWeight: 600,
      },
      h4: {
        fontWeight: 600,
      },
      h5: {
        fontWeight: 600,
      },
      h6: {
        fontWeight: 600,
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            background: darkMode
              ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
              : 'linear-gradient(135deg, #E8F4F8 0%, #D4C5F9 50%, #C8F4E0 100%)',
            backgroundAttachment: 'fixed',
            color: darkMode ? '#E2E8F0' : '#2D3748',
            transition: 'background 0.3s ease, color 0.3s ease',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: darkMode
              ? 'rgba(26, 26, 46, 0.8)'
              : 'rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: '12px',
            fontWeight: 600,
          },
          contained: {
            boxShadow: darkMode 
              ? '0 4px 14px rgba(144, 205, 244, 0.3)'
              : '0 4px 14px rgba(184, 224, 242, 0.4)',
            '&:hover': {
              boxShadow: darkMode
                ? '0 6px 20px rgba(144, 205, 244, 0.4)'
                : '0 6px 20px rgba(184, 224, 242, 0.5)',
            },
          },
          outlined: {
            borderWidth: '2px',
            '&:hover': {
              borderWidth: '2px',
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              color: darkMode ? '#E2E8F0' : '#2D3748',
              '& fieldset': {
                borderColor: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.23)',
              },
              '&:hover fieldset': {
                borderColor: darkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.87)',
              },
              '&.Mui-focused fieldset': {
                borderColor: darkMode ? '#90CDF4' : '#B8E0F2',
              },
            },
            '& .MuiInputLabel-root': {
              color: darkMode ? '#A0AEC0' : '#718096',
            },
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: {
            color: darkMode ? '#E2E8F0' : '#2D3748',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.23)',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: darkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.87)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: darkMode ? '#90CDF4' : '#B8E0F2',
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            color: darkMode ? '#E2E8F0' : '#2D3748',
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            color: darkMode ? '#A0AEC0' : '#718096',
            '&.Mui-selected': {
              color: darkMode ? '#90CDF4' : '#B8E0F2',
            },
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            backgroundColor: darkMode
              ? 'rgba(26, 26, 46, 0.95)'
              : 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(30px)',
            WebkitBackdropFilter: 'blur(30px)',
            border: darkMode
              ? '1px solid rgba(255, 255, 255, 0.1)'
              : '1px solid rgba(255, 255, 255, 0.2)',
          },
        },
      },
    },
  });
};


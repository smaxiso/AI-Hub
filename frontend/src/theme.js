import { createTheme } from '@mui/material/styles';

// 1. Define Reusable Glassmorphism Mixins
const getGlassStyles = (mode) => ({
  background: mode === 'dark' 
    ? 'rgba(18, 18, 18, 0.6)' // Dark mode glass floor
    : 'rgba(255, 255, 255, 0.75)', // Light mode glass floor
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)', // Safari support
  border: mode === 'dark'
    ? '1px solid rgba(255, 255, 255, 0.08)'
    : '1px solid rgba(255, 255, 255, 0.4)',
  boxShadow: mode === 'dark'
    ? '0 4px 30px rgba(0, 0, 0, 0.5)'
    : '0 4px 30px rgba(0, 0, 0, 0.1)',
});

export const createAppTheme = (mode) => {
  const modeString = mode ? 'dark' : 'light';
  return createTheme({
    palette: {
      mode: modeString,
      primary: {
        main: '#6366f1', // Vibrant indigo for CTAs
      },
      text: {
        // Force high-contrast absolute values
        primary: modeString === 'dark' ? '#FFFFFF' : '#121212',
        secondary: modeString === 'dark' ? '#A1A1AA' : '#4B5563',
      },
      background: {
        default: modeString === 'dark' ? '#09090b' : '#f3f4f6',
        paper: modeString === 'dark' ? '#18181b' : '#ffffff',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    components: {
      // 2. Global CSS Overrides for the Text-Shadow Safety Net
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            background: modeString === 'dark'
              ? 'linear-gradient(135deg, #09090b 0%, #18181b 50%, #0f3460 100%)'
              : 'linear-gradient(135deg, #f3f4f6 0%, #e2e8f0 50%, #f8fafc 100%)',
            backgroundAttachment: 'fixed',
            // This guarantees WCAG contrast against variable glass backgrounds
            '.glass-text-primary': {
              textShadow: modeString === 'dark' 
                ? '0px 1px 3px rgba(0,0,0,0.8)' // Black shadow protects white text
                : '0px 1px 2px rgba(255,255,255,0.8)', // White shadow protects dark text
            },
          },
        },
      },
      // 3. Inject Glassmorphism directly into Cards and Papers
      MuiCard: {
        styleOverrides: {
          root: {
            ...getGlassStyles(modeString),
            borderRadius: '16px',
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            // Hover micro-interaction for Phase 1
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: modeString === 'dark'
                ? '0 12px 40px rgba(0, 0, 0, 0.7)'
                : '0 12px 40px rgba(0, 0, 0, 0.15)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none', // Disable default MUI elevation overlays
          },
          elevation8: {
            // Apply glass to modals/dialogs (usually high elevation)
            ...getGlassStyles(modeString),
          }
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: '12px',
            fontWeight: 600,
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            ...getGlassStyles(modeString),
            borderRadius: '24px',
          },
        },
      },
    },
  });
};

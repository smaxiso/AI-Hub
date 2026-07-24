import React, { useState, useEffect } from 'react';
import { Button, IconButton, Box, Typography, Slide, Paper, useMediaQuery } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import InstallMobileIcon from '@mui/icons-material/InstallMobile';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import { useTheme } from '../context/ThemeContext';

const PWAInstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const muiTheme = useMuiTheme();
    const { darkMode } = useTheme();
    const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));

    useEffect(() => {
        const handler = (e) => {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);
            
            // Add a slight delay before showing to not overwhelm the user immediately on load
            setTimeout(() => {
                setShowPrompt(true);
            }, 3000);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        // Show the prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {

        } else {

        }

        // We've used the prompt, and can't use it again, throw it away
        setDeferredPrompt(null);
        setShowPrompt(false);
    };

    const handleClose = () => {
        setShowPrompt(false);
    };

    return (
        <Slide direction="up" in={showPrompt} mountOnEnter unmountOnExit>
            <Paper
                elevation={6}
                sx={{
                    position: 'fixed',
                    bottom: isMobile ? 80 : 24, // Above bottom nav on mobile
                    left: 0,
                    right: 0,
                    margin: '0 auto',
                    maxWidth: 400,
                    width: 'calc(100% - 32px)',
                    zIndex: 2000,
                    borderRadius: '16px',
                    overflow: 'hidden',
                    backgroundColor: darkMode ? 'rgba(30, 41, 59, 0.85)' : 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(20px)',
                    border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.05)',
                    boxShadow: darkMode ? '0 10px 40px rgba(0,0,0,0.5)' : '0 10px 40px rgba(0,0,0,0.1)',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                    <Box 
                        sx={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center',
                            width: 48, 
                            height: 48, 
                            borderRadius: '12px',
                            background: darkMode ? 'rgba(144, 205, 244, 0.1)' : 'rgba(25, 118, 210, 0.1)',
                            color: darkMode ? '#90CDF4' : '#1976d2',
                            mr: 2
                        }}
                    >
                        <InstallMobileIcon fontSize="medium" />
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1.2, mb: 0.5 }}>
                            Install TheAIHubX
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.3 }}>
                            Add to your home screen for a faster, native app experience.
                        </Typography>
                    </Box>
                    <IconButton size="small" onClick={handleClose} sx={{ ml: 1, alignSelf: 'flex-start' }}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>
                <Box sx={{ display: 'flex', borderTop: darkMode ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.05)' }}>
                    <Button 
                        fullWidth 
                        onClick={handleClose}
                        sx={{ 
                            borderRadius: 0, 
                            py: 1.5, 
                            color: 'text.secondary',
                            borderRight: darkMode ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.05)'
                        }}
                    >
                        Maybe Later
                    </Button>
                    <Button 
                        fullWidth 
                        onClick={handleInstallClick}
                        sx={{ 
                            borderRadius: 0, 
                            py: 1.5, 
                            fontWeight: 700,
                            color: darkMode ? '#90CDF4' : '#1976d2'
                        }}
                    >
                        Install App
                    </Button>
                </Box>
            </Paper>
        </Slide>
    );
};

export default PWAInstallPrompt;

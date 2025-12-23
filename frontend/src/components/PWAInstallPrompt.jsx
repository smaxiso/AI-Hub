import React, { useState, useEffect } from 'react';
import { Button, Snackbar, Alert, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import InstallMobileIcon from '@mui/icons-material/InstallMobile';

const PWAInstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        const handler = (e) => {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);
            // Update UI to notify the user they can add to home screen
            setShowPrompt(true);
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
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }

        // We've used the prompt, and can't use it again, throw it away
        setDeferredPrompt(null);
        setShowPrompt(false);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setShowPrompt(false);
    };

    return (
        <Snackbar
            open={showPrompt}
            autoHideDuration={10000} // Hide after 10s if ignored
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            sx={{ bottom: { xs: 90, md: 24 } }} // Adjust for mobile nav bar if exists
        >
            <Alert
                onClose={handleClose}
                severity="info"
                icon={<InstallMobileIcon fontSize="inherit" />}
                sx={{
                    width: '100%',
                    bgcolor: 'primary.main',
                    color: 'white',
                    '& .MuiAlert-icon': { color: 'white' },
                    alignItems: 'center'
                }}
                action={
                    <>
                        <Button color="inherit" size="small" onClick={handleInstallClick} sx={{ mr: 1, fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.5)' }}>
                            Install
                        </Button>
                        <IconButton
                            size="small"
                            aria-label="close"
                            color="inherit"
                            onClick={handleClose}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </>
                }
            >
                Install TheAIHubX App for a better experience!
            </Alert>
        </Snackbar>
    );
};

export default PWAInstallPrompt;

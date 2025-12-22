import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogContent, DialogTitle, DialogActions,
    Button, Typography, Box, IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SchoolIcon from '@mui/icons-material/School';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SignupPromptModal = ({ delay = 15000 }) => { // 15 seconds default
    const [open, setOpen] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Don't show if user is already logged in
        if (user) return;

        // Check if modal was already shown in this session
        const hasSeenModal = sessionStorage.getItem('signup_prompt_shown');
        if (hasSeenModal) return;

        const timer = setTimeout(() => {
            setOpen(true);
            sessionStorage.setItem('signup_prompt_shown', 'true');
        }, delay);

        return () => clearTimeout(timer);
    }, [user, delay]);

    const handleClose = () => {
        setOpen(false);
    };

    const handleSignup = () => {
        setOpen(false);
        navigate('/signup');
    };

    const handleLogin = () => {
        setOpen(false);
        navigate('/login');
    };

    if (user) return null;

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 3 }
            }}
        >
            <DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SchoolIcon color="primary" sx={{ fontSize: 32 }} />
                        <Typography variant="h6" fontWeight={700}>
                            Start Your AI Journey
                        </Typography>
                    </Box>
                    <IconButton onClick={handleClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent>
                <Typography variant="body1" sx={{ mb: 3, color: 'text.primary' }}>
                    Dive into our comprehensive <strong>Learning Hub</strong> to master AI tools and concepts. From basics to advanced workflows, we've got you covered.
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                        <SchoolIcon color="primary" sx={{ fontSize: 28 }} />
                        <Box>
                            <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                                Free AI Curriculum
                            </Typography>
                            <Typography variant="body2" color="text.primary" sx={{ opacity: 0.8 }}>
                                Architecture, Prompt Engineering, Agents & more
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                        <TrendingUpIcon color="primary" sx={{ fontSize: 28 }} />
                        <Box>
                            <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                                Hands-On Projects
                            </Typography>
                            <Typography variant="body2" color="text.primary" sx={{ opacity: 0.8 }}>
                                Build real-world applications with step-by-step guides
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                        <EmojiEventsIcon color="primary" sx={{ fontSize: 28 }} />
                        <Box>
                            <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                                Gamified Progress
                            </Typography>
                            <Typography variant="body2" color="text.primary" sx={{ opacity: 0.8 }}>
                                Track your growth and earn badges as you learn
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
                <Button onClick={handleClose} sx={{ mr: 'auto', color: 'text.secondary' }}>
                    Maybe Later
                </Button>
                <Button
                    onClick={() => {
                        setOpen(false);
                        navigate('/learning');
                    }}
                    variant="contained"
                    fullWidth
                    startIcon={<SchoolIcon />}
                    sx={{
                        maxWidth: '240px',
                        fontWeight: 600,
                        py: 1
                    }}
                >
                    Explore Learning Hub
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SignupPromptModal;

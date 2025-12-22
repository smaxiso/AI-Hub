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

const SignupPromptModal = ({ delay = 30000 }) => { // 30 seconds default
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
                            Master AI with AI Hub X
                        </Typography>
                    </Box>
                    <IconButton onClick={handleClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent>
                <Typography variant="body1" sx={{ mb: 3, color: 'text.primary' }}>
                    Sign up for free to access our comprehensive learning platform and unlock exclusive features:
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                        <SchoolIcon color="primary" sx={{ fontSize: 28 }} />
                        <Box>
                            <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                                Structured Learning Paths
                            </Typography>
                            <Typography variant="body2" color="text.primary" sx={{ opacity: 0.8 }}>
                                Progress from beginner to expert across 4 levels
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                        <TrendingUpIcon color="primary" sx={{ fontSize: 28 }} />
                        <Box>
                            <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                                Track Your Progress
                            </Typography>
                            <Typography variant="body2" color="text.primary" sx={{ opacity: 0.8 }}>
                                Monitor your learning journey across all devices
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                        <EmojiEventsIcon color="primary" sx={{ fontSize: 28 }} />
                        <Box>
                            <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                                Earn Points & Achievements
                            </Typography>
                            <Typography variant="body2" color="text.primary" sx={{ opacity: 0.8 }}>
                                Complete quizzes and modules to earn rewards
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
                <Button onClick={handleClose} sx={{ mr: 'auto' }}>
                    Maybe Later
                </Button>
                <Button onClick={handleLogin} variant="outlined">
                    Log In
                </Button>
                <Button onClick={handleSignup} variant="contained">
                    Sign Up Free
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SignupPromptModal;

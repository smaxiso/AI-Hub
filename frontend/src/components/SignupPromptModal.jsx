import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogContent, DialogTitle, DialogActions,
    Button, Typography, Box, IconButton, useTheme, useMediaQuery
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
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

    if (user) return null;

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: isMobile ? 3 : 4,
                    m: isMobile ? 2 : 4,
                    width: isMobile ? 'calc(100% - 32px)' : 'auto',
                    backgroundImage: theme.palette.mode === 'dark'
                        ? 'linear-gradient(145deg, rgba(26, 26, 46, 0.95), rgba(30, 30, 50, 0.98))'
                        : 'linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(240, 245, 250, 0.98))',
                    border: '1px solid',
                    borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                    boxShadow: theme.palette.mode === 'dark'
                        ? '0 20px 40px rgba(0,0,0,0.6)'
                        : '0 20px 40px rgba(0,0,0,0.1)'
                }
            }}
        >
            <DialogTitle sx={{ px: isMobile ? 2 : 4, pt: isMobile ? 3 : 4, pb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <SchoolIcon sx={{
                            fontSize: isMobile ? 28 : 32,
                            color: theme.palette.primary.main,
                            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                        }} />
                        <Typography variant={isMobile ? "h6" : "h5"} fontWeight={700} sx={{ lineHeight: 1.2 }}>
                            Start Your AI Journey
                        </Typography>
                    </Box>
                    <IconButton onClick={handleClose} size="small" sx={{ color: 'text.secondary' }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ px: isMobile ? 2 : 4 }}>
                <Typography variant="body1" sx={{ mb: 3, color: 'text.primary', lineHeight: 1.6 }}>
                    Dive into our comprehensive <strong>Learning Hub</strong> to master AI tools and concepts. From basics to advanced workflows, we've got you covered.
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mb: 1 }}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                        <Box sx={{
                            p: 1,
                            borderRadius: '12px',
                            bgcolor: theme.palette.mode === 'dark' ? 'rgba(144, 205, 244, 0.1)' : 'rgba(25, 118, 210, 0.08)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <SchoolIcon color="primary" sx={{ fontSize: 24 }} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle1" fontWeight={700} color="text.primary" sx={{ mb: 0.5 }}>
                                Free AI Curriculum
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Architecture, Prompt Engineering, Agents & more
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                        <Box sx={{
                            p: 1,
                            borderRadius: '12px',
                            bgcolor: theme.palette.mode === 'dark' ? 'rgba(167, 139, 250, 0.1)' : 'rgba(124, 58, 237, 0.08)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <TrendingUpIcon sx={{ fontSize: 24, color: theme.palette.mode === 'dark' ? '#A78BFA' : '#7C3AED' }} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle1" fontWeight={700} color="text.primary" sx={{ mb: 0.5 }}>
                                Hands-On Projects
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Build real-world applications with step-by-step guides
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                        <Box sx={{
                            p: 1,
                            borderRadius: '12px',
                            bgcolor: theme.palette.mode === 'dark' ? 'rgba(246, 173, 85, 0.1)' : 'rgba(221, 107, 32, 0.08)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <EmojiEventsIcon sx={{ fontSize: 24, color: theme.palette.mode === 'dark' ? '#F6AD55' : '#DD6B20' }} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle1" fontWeight={700} color="text.primary" sx={{ mb: 0.5 }}>
                                Gamified Progress
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Track your growth and earn badges as you learn
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: isMobile ? 2 : 4, pb: isMobile ? 3 : 4, pt: 2, flexDirection: isMobile ? 'column-reverse' : 'row', gap: isMobile ? 2 : 1 }}>
                <Button
                    onClick={handleClose}
                    sx={{
                        mr: isMobile ? 0 : 'auto',
                        width: isMobile ? '100%' : 'auto',
                        color: 'text.secondary',
                        fontWeight: 600
                    }}
                >
                    Maybe Later
                </Button>
                <Button
                    onClick={() => {
                        setOpen(false);
                        navigate('/learning');
                    }}
                    variant="contained"
                    fullWidth={isMobile}
                    startIcon={<SchoolIcon />}
                    sx={{
                        maxWidth: isMobile ? '100%' : '280px',
                        fontWeight: 700,
                        py: 1.5,
                        px: 4,
                        fontSize: '1rem',
                        background: 'linear-gradient(135deg, #6BB6FF 0%, #A78BFA 100%)',
                        color: 'white',
                        boxShadow: '0 8px 20px rgba(107, 182, 255, 0.3)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #5FA5F5 0%, #9061F9 100%)',
                            boxShadow: '0 10px 25px rgba(107, 182, 255, 0.5)',
                            transform: 'translateY(-2px)'
                        },
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                >
                    Explore Learning Hub
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SignupPromptModal;

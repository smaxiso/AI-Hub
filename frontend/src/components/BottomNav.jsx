import React from 'react';
import { Paper, BottomNavigation, BottomNavigationAction, useMediaQuery } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import ExploreIcon from '@mui/icons-material/Explore';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import { useTheme } from '../context/ThemeContext';
import { useTheme as useMuiTheme } from '@mui/material/styles';

const BottomNav = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { darkMode } = useTheme();
    const muiTheme = useMuiTheme();
    const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));

    // Don't show on desktop
    if (!isMobile) return null;

    // Routes where BottomNav should be hidden to maximize screen real estate
    const hiddenRoutes = [
        '/learning/quiz',
        '/learning/module'
    ];
    const isHidden = hiddenRoutes.some(route => location.pathname.startsWith(route));
    if (isHidden) return null;

    // Determine active value
    let value = '/';
    if (location.pathname.startsWith('/learning')) value = '/learning';
    if (location.pathname.startsWith('/profile') || location.pathname.startsWith('/login')) value = '/profile';

    return (
        <Paper
            sx={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 1100, // Above normal content but below modals
                backgroundColor: darkMode
                    ? 'rgba(26, 26, 46, 0.95)'
                    : 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderTop: darkMode
                    ? '1px solid rgba(255, 255, 255, 0.1)'
                    : '1px solid rgba(0, 0, 0, 0.1)',
                paddingBottom: 'env(safe-area-inset-bottom)', // Support for iOS home indicator
            }}
            elevation={3}
        >
            <BottomNavigation
                showLabels
                value={value}
                onChange={(event, newValue) => {
                    if (newValue === '/profile' && !location.pathname.includes('/profile')) {
                        // User might not be logged in, so we just navigate to /profile which is protected and handles redirect to login
                        navigate('/profile');
                    } else {
                        navigate(newValue);
                    }
                }}
                sx={{
                    backgroundColor: 'transparent',
                    height: 60,
                    '& .MuiBottomNavigationAction-root': {
                        color: darkMode ? '#A0AEC0' : '#718096',
                    },
                    '& .Mui-selected': {
                        color: darkMode ? '#90CDF4' : '#1976d2',
                    }
                }}
            >
                <BottomNavigationAction label="Tools" value="/" icon={<ExploreIcon />} aria-label="Browse AI tools" />
                <BottomNavigationAction label="Learn" value="/learning" icon={<SchoolIcon />} aria-label="Learning hub" />
                <BottomNavigationAction label="Profile" value="/profile" icon={<PersonIcon />} aria-label="Your profile" />
            </BottomNavigation>
        </Paper>
    );
};

export default BottomNav;

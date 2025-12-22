import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    AppBar, Toolbar, Typography, Button, Box, IconButton,
    Avatar, Menu, MenuItem, Chip, Divider, Tooltip
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SettingsIcon from '@mui/icons-material/Settings';
import ExploreIcon from '@mui/icons-material/Explore';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useAuth } from '../context/AuthContext';

const Header = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const isLearningPage = location.pathname.startsWith('/learning');
    const isAdminPage = location.pathname.startsWith('/admin');

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        await signOut();
        handleClose();
        navigate('/');
    };

    return (
        <AppBar position="static" elevation={0} sx={{ bgcolor: 'white', borderBottom: '1px solid #e0e0e0' }}>
            <Toolbar sx={{ px: { xs: 2, md: 4 } }}>
                {/* Logo */}
                <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                    <Box
                        component={Link}
                        to="/"
                        sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', mr: 1, cursor: 'pointer' }}
                    >
                        <Box
                            component="img"
                            src="/favicon.svg"
                            alt="AI Hub X Logo"
                            sx={{ width: 32, height: 32 }}
                        />
                    </Box>
                    <Typography
                        variant="h6"
                        component={Link}
                        to="/"
                        sx={{
                            fontWeight: 700,
                            color: 'text.primary',
                            textDecoration: 'none',
                            fontSize: { xs: '1.1rem', md: '1.25rem' }
                        }}
                    >
                        AI Hub X
                    </Typography>
                </Box>

                {/* Navigation */}
                {user ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {/* User Menu */}
                        <Box>
                            <IconButton onClick={handleMenu} sx={{ p: 0 }}>
                                <Avatar
                                    src={user.profile?.avatar_url}
                                    alt={user.profile?.full_name}
                                    sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}
                                >
                                    {user.profile?.full_name?.charAt(0) || user.profile?.username?.charAt(0) || user.email?.charAt(0)}
                                </Avatar>
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                PaperProps={{ sx: { minWidth: 200 } }}
                            >
                                {/* User Info */}
                                <MenuItem disabled sx={{ opacity: '1 !important' }}>
                                    <Box>
                                        <Typography variant="body1" fontWeight={600}>
                                            {user.profile?.username || user.profile?.full_name || 'User'}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {user.email}
                                        </Typography>
                                    </Box>
                                </MenuItem>
                                <Divider />

                                {/* Profile Settings */}
                                <MenuItem onClick={() => { handleClose(); navigate('/profile'); }}>
                                    <SettingsIcon sx={{ mr: 1, fontSize: 20 }} />
                                    Profile Settings
                                </MenuItem>

                                {/* Context-aware Navigation */}
                                {isLearningPage ? (
                                    <MenuItem onClick={() => { handleClose(); window.open('/', '_blank'); }}>
                                        <ExploreIcon sx={{ mr: 1, fontSize: 20 }} />
                                        AI Hub Marketplace
                                    </MenuItem>
                                ) : (
                                    <MenuItem onClick={() => { handleClose(); navigate('/learning'); }}>
                                        <MenuBookIcon sx={{ mr: 1, fontSize: 20 }} />
                                        Learning Hub
                                    </MenuItem>
                                )}

                                {/* Admin Dashboard (if admin/owner) */}
                                {(user.role === 'admin' || user.role === 'owner') && !isAdminPage && (
                                    <MenuItem onClick={() => { handleClose(); window.open('/admin', '_blank'); }}>
                                        <DashboardIcon sx={{ mr: 1, fontSize: 20 }} />
                                        Admin Dashboard
                                    </MenuItem>
                                )}

                                <Divider />
                                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                            </Menu>
                        </Box>
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        {/* Mobile: Icon only */}
                        <Tooltip title="Start Learning AI">
                            <IconButton
                                component={Link}
                                to="/learning"
                                sx={{
                                    display: { xs: 'inline-flex', sm: 'none' },
                                    bgcolor: '#e3f2fd',
                                    color: 'text.primary',
                                    boxShadow: 1,
                                    border: '1px solid',
                                    borderColor: 'rgba(0, 0, 0, 0.1)',
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        bgcolor: '#bbdefb',
                                        transform: 'scale(1.05) translateY(-2px)',
                                        boxShadow: 3
                                    },
                                    '&:active': {
                                        transform: 'scale(0.95) translateY(1px)',
                                        boxShadow: 1
                                    }
                                }}
                            >
                                <MenuBookIcon />
                            </IconButton>
                        </Tooltip>

                        {/* Desktop: Full Button */}
                        <Tooltip title="Browse our AI Learning Modules">
                            <Button
                                component={Link}
                                to="/learning"
                                variant="outlined"
                                sx={{
                                    display: { xs: 'none', sm: 'inline-flex' },
                                    transition: 'all 0.2s',
                                    '&:hover': { transform: 'translateY(-2px)', boxShadow: 2 },
                                    '&:active': { transform: 'translateY(1px)', boxShadow: 1 }
                                }}
                            >
                                Learning Hub
                            </Button>
                        </Tooltip>

                        {/* Mobile: Login Icon */}
                        <Tooltip title="Sign In to your Account">
                            <IconButton
                                component={Link}
                                to="/login"
                                sx={{
                                    display: { xs: 'inline-flex', sm: 'none' },
                                    bgcolor: '#e3f2fd',
                                    color: 'text.primary',
                                    boxShadow: 1,
                                    border: '1px solid',
                                    borderColor: 'rgba(0, 0, 0, 0.1)',
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        bgcolor: '#bbdefb',
                                        transform: 'scale(1.05) translateY(-2px)',
                                        boxShadow: 3
                                    },
                                    '&:active': {
                                        transform: 'scale(0.95) translateY(1px)',
                                        boxShadow: 1
                                    }
                                }}
                            >
                                <LoginIcon />
                            </IconButton>
                        </Tooltip>

                        {/* Desktop: Login Button */}
                        <Tooltip title="Login to save your progress">
                            <Button
                                component={Link}
                                to="/login"
                                variant="contained"
                                startIcon={<LoginIcon />}
                                size="medium"
                                sx={{
                                    display: { xs: 'none', sm: 'inline-flex' },
                                    transition: 'all 0.2s',
                                    '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 },
                                    '&:active': { transform: 'translateY(1px)', boxShadow: 1 }
                                }}
                            >
                                Login
                            </Button>
                        </Tooltip>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Header;

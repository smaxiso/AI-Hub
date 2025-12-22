import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    AppBar, Toolbar, Typography, Button, Box, IconButton,
    Avatar, Menu, MenuItem, Chip
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useAuth } from '../context/AuthContext';

const Header = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState(null);

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
                    <SchoolIcon sx={{ fontSize: 32, color: 'primary.main', mr: 1 }} />
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
                        <Button
                            component={Link}
                            to="/learning"
                            variant="outlined"
                            sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
                        >
                            Learning
                        </Button>

                        {/* User Menu */}
                        <Box>
                            <IconButton onClick={handleMenu} sx={{ p: 0 }}>
                                <Avatar
                                    src={user.profile?.avatar_url}
                                    alt={user.profile?.full_name}
                                    sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}
                                >
                                    {user.profile?.full_name?.charAt(0) || user.email?.charAt(0)}
                                </Avatar>
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                            >
                                <MenuItem disabled>
                                    <Box>
                                        <Typography variant="body2" fontWeight={600}>
                                            {user.profile?.full_name || 'User'}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {user.email}
                                        </Typography>
                                    </Box>
                                </MenuItem>
                                <MenuItem onClick={() => { handleClose(); navigate('/learning'); }}>
                                    Learning Hub
                                </MenuItem>
                                {user.role === 'admin' || user.role === 'owner' ? (
                                    <MenuItem onClick={() => { handleClose(); navigate('/admin'); }}>
                                        Admin Dashboard
                                    </MenuItem>
                                ) : null}
                                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                            </Menu>
                        </Box>
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            component={Link}
                            to="/login"
                            startIcon={<LoginIcon />}
                            sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
                        >
                            Login
                        </Button>
                        <Button
                            component={Link}
                            to="/signup"
                            variant="contained"
                            startIcon={<PersonAddIcon />}
                        >
                            Sign Up
                        </Button>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Header;

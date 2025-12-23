import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Button, Container, Grid, Card, CardContent, IconButton, Chip, Tabs, Tab, Paper, TextField, Badge,
    Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Snackbar, Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ManageUsers from './ManageUsers';
import CommunitySuggestions from './CommunitySuggestions';
import { supabase } from '../../supabaseClient';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const Dashboard = () => {
    const { signOut, user } = useAuth();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const tabValue = parseInt(searchParams.get('tab') || '0', 10);

    const handleTabChange = (event, newValue) => {
        setSearchParams({ tab: newValue });
    };

    const [tools, setTools] = useState([]);
    const [filteredTools, setFilteredTools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState(null);
    const [pendingCount, setPendingCount] = useState(0);

    // Dialog & Feedback State
    const [deleteDialog, setDeleteDialog] = useState({ open: false, toolId: null });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Search, Filter & Sort State
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortBy, setSortBy] = useState('name_asc');

    useEffect(() => {
        fetchTools();
        fetchUserRole();
    }, []);

    useEffect(() => {
        if (userRole === 'owner') {
            fetchPendingUsers();
        }
    }, [userRole]);

    useEffect(() => {
        filterAndSortTools();
    }, [searchTerm, selectedCategory, sortBy, tools]);

    // Periodic role check for session invalidation
    useEffect(() => {
        const roleCheckInterval = setInterval(async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                const { data } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
                if (data?.role === 'pending') {
                    showSnackbar('Your access has been revoked. Logging out...', 'warning');
                    setTimeout(() => signOut(), 2000);
                }
            }
        }, 5000);

        return () => clearInterval(roleCheckInterval);
    }, [signOut]);

    const filterAndSortTools = () => {
        let temp = [...tools];

        if (selectedCategory !== 'All') {
            temp = temp.filter(t => t.category === selectedCategory);
        }
        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            temp = temp.filter(t =>
                t.name.toLowerCase().includes(lower) ||
                t.description.toLowerCase().includes(lower)
            );
        }

        temp.sort((a, b) => {
            if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
            if (sortBy === 'name_desc') return b.name.localeCompare(a.name);
            if (sortBy === 'newest') return new Date(b.created_at) - new Date(a.created_at);
            return 0;
        });

        setFilteredTools(temp);
    };

    const fetchUserRole = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            const { data } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
            setUserRole(data?.role);
        }
    };

    const fetchPendingUsers = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch(`${API_URL}/admin/users`, {
                headers: { 'Authorization': `Bearer ${session?.access_token}` }
            });
            if (res.ok) {
                const data = await res.json();
                const pending = data.filter(u => u.role === 'pending').length;
                setPendingCount(pending);
            }
        } catch (err) {
            console.error('Error fetching pending users:', err);
        }
    };

    const refreshPendingCount = () => {
        fetchPendingUsers();
    };

    const fetchTools = async () => {
        try {
            const res = await fetch(`${API_URL}/tools`);
            const data = await res.json();
            setTools(data);
            setFilteredTools(data);
        } catch (err) {
            console.error(err);
            showSnackbar('Failed to fetch tools', 'error');
        } finally {
            setLoading(false);
        }
    };

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleDeleteClick = (id) => {
        setDeleteDialog({ open: true, toolId: id });
    };

    const handleCloseDeleteDialog = () => {
        setDeleteDialog({ open: false, toolId: null });
    };

    const confirmDelete = async () => {
        const id = deleteDialog.toolId;
        handleCloseDeleteDialog();

        try {
            const { data: { session } } = await supabase.auth.getSession();

            const res = await fetch(`${API_URL}/tools/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${session?.access_token}`
                }
            });

            if (res.ok) {
                const newTools = tools.filter(t => t.id !== id);
                setTools(newTools);
                showSnackbar('Tool deleted successfully');
            } else {
                throw new Error('Failed to delete tool');
            }
        } catch (err) {
            console.error(err);
            showSnackbar('Error deleting tool', 'error');
        }
    };

    const categories = ['All', ...new Set(tools.map(t => t.category))];

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', pb: 8 }}>
            <Box sx={{ bgcolor: '#fff', boxShadow: 1, py: 2, mb: 4 }}>
                <Container maxWidth="xl" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h5" fontWeight="bold" sx={{ fontSize: { xs: '1.2rem', md: '1.5rem' } }}>
                        Admin
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {userRole && (
                            <Chip
                                label={userRole.toUpperCase()}
                                color="primary"
                                variant="outlined"
                                size="small"
                                sx={{ display: { xs: 'none', md: 'flex' } }}
                            />
                        )}
                        <Button
                            startIcon={<OpenInNewIcon />}
                            component="a"
                            href="/"
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ display: { xs: 'none', md: 'flex' }, textTransform: 'none' }}
                        >
                            Open App
                        </Button>
                        <IconButton
                            component="a"
                            href="/"
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ display: { xs: 'flex', md: 'none' } }}
                            color="primary"
                        >
                            <OpenInNewIcon />
                        </IconButton>
                        <Button onClick={() => navigate('/admin/profile')} sx={{ textTransform: 'none', minWidth: 'auto' }}>
                            <PersonIcon sx={{ display: { xs: 'block', md: 'none' }, color: 'text.primary' }} />
                            <Typography variant="caption" sx={{ color: 'text.primary', mr: 1, display: { xs: 'none', md: 'block' } }}>
                                {user?.email}
                            </Typography>
                        </Button>
                        <Button
                            startIcon={<LogoutIcon />}
                            onClick={() => signOut()}
                            sx={{ display: { xs: 'none', md: 'flex' } }}
                        >
                            Logout
                        </Button>
                        <IconButton
                            onClick={() => signOut()}
                            sx={{ display: { xs: 'flex', md: 'none' } }}
                            color="primary"
                        >
                            <LogoutIcon />
                        </IconButton>
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="xl">
                {userRole === 'owner' && (
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                        <Tabs
                            value={tabValue}
                            onChange={handleTabChange}
                            variant="scrollable"
                            scrollButtons
                            allowScrollButtonsMobile
                            sx={{
                                [`& .MuiTabs-scrollButtons`]: {
                                    '&.Mui-disabled': { opacity: 0.3 },
                                },
                            }}
                        >
                            <Tab label="Tools" />
                            <Tab label={
                                <Badge badgeContent={pendingCount} color="error">
                                    <Box sx={{ pr: 1.5 }}>Manage Users</Box>
                                </Badge>
                            } />
                            <Tab label="Community" />
                        </Tabs>
                    </Box>
                )}

                {tabValue === 0 && (
                    <>
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { md: 'center' }, gap: 2, mb: 4 }}>
                            <Typography variant="h4" sx={{ fontSize: { xs: '1.8rem', md: '2.1rem' } }}>
                                Tools ({filteredTools.length})
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => navigate('/admin/tool/new')}
                                fullWidth={true}
                                sx={{ maxWidth: { md: '200px' } }}
                            >
                                Add New Tool
                            </Button>
                        </Box>

                        <Paper sx={{ p: 2, mb: 4 }}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        placeholder="Search tools..."
                                        variant="outlined"
                                        size="small"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6} md={2}>
                                    <TextField
                                        select
                                        fullWidth
                                        size="small"
                                        label="Sort By"
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        SelectProps={{ native: true }}
                                    >
                                        <option value="name_asc">Name (A-Z)</option>
                                        <option value="name_desc">Name (Z-A)</option>
                                        <option value="newest">Newest First</option>
                                    </TextField>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                        {categories.map(cat => (
                                            <Chip
                                                key={cat}
                                                label={cat}
                                                onClick={() => setSelectedCategory(cat)}
                                                color={selectedCategory === cat ? 'primary' : 'default'}
                                                variant={selectedCategory === cat ? 'filled' : 'outlined'}
                                                clickable
                                            />
                                        ))}
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>

                        <Grid container spacing={3}>
                            {filteredTools.map(tool => (
                                <Grid item xs={12} md={6} lg={4} key={tool.id}>
                                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                                <Typography variant="h6" noWrap sx={{ maxWidth: '70%' }}>{tool.name}</Typography>
                                                <Chip label={tool.category} size="small" />
                                            </Box>
                                            <Typography variant="body2" color="text.secondary" sx={{
                                                display: '-webkit-box',
                                                WebkitLineClamp: 3,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                mb: 2
                                            }}>
                                                {tool.description}
                                            </Typography>
                                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 'auto' }}>
                                                <IconButton size="small" onClick={() => navigate(`/admin/tool/${tool.id}`)}>
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton size="small" color="error" onClick={() => handleDeleteClick(tool.id)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </>
                )}

                {tabValue === 1 && userRole === 'owner' && (
                    <ManageUsers onUpdate={refreshPendingCount} />
                )}

                {tabValue === 2 && userRole === 'owner' && (
                    <CommunitySuggestions />
                )}

            </Container>

            <Dialog
                open={deleteDialog.open}
                onClose={handleCloseDeleteDialog}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
            >
                <DialogTitle id="delete-dialog-title">
                    Delete Tool?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description">
                        Are you sure you want to delete this tool? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={confirmDelete} color="error" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Dashboard;

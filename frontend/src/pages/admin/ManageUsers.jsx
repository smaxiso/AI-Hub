import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Button, Chip, IconButton, CircularProgress,
    Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
    Snackbar, Alert
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabaseClient';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const ManageUsers = ({ onUpdate }) => {
    const { user } = useAuth(); // AuthContext user
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    // Dialog & Feedback State
    const [confirmDialog, setConfirmDialog] = useState({ open: false, type: '', userId: null, newRole: null });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch(`${API_URL}/admin/users`, {
                headers: {
                    'Authorization': `Bearer ${session?.access_token}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (err) {
            console.error(err);
            showSnackbar('Failed to fetch users', 'error');
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

    const openConfirmDialog = (type, userId, newRole = null) => {
        setConfirmDialog({ open: true, type, userId, newRole });
    };

    const closeConfirmDialog = () => {
        setConfirmDialog({ ...confirmDialog, open: false });
    };

    const processAction = async () => {
        const { type, userId, newRole } = confirmDialog;
        closeConfirmDialog();
        setActionLoading(userId);

        try {
            const { data: { session } } = await supabase.auth.getSession();

            if (type === 'update') {
                const res = await fetch(`${API_URL}/admin/users/${userId}/role`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${session?.access_token}`
                    },
                    body: JSON.stringify({ role: newRole })
                });

                if (res.ok) {
                    setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
                    showSnackbar(`User role updated to ${newRole}`);
                    if (onUpdate) onUpdate(); // Refresh badge count
                } else {
                    throw new Error('Failed to update role');
                }
            } else if (type === 'reject') {
                const res = await fetch(`${API_URL}/admin/users/${userId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${session?.access_token}`
                    }
                });

                if (res.ok) {
                    setUsers(users.filter(u => u.id !== userId));
                    showSnackbar('User request rejected and deleted');
                    if (onUpdate) onUpdate(); // Refresh badge count
                } else {
                    throw new Error('Failed to reject user');
                }
            }
        } catch (err) {
            console.error(err);
            showSnackbar(err.message, 'error');
        } finally {
            setActionLoading(null);
        }
    };

    const getStatusColor = (role) => {
        switch (role) {
            case 'owner': return 'secondary';
            case 'admin': return 'success';
            case 'pending': return 'warning';
            default: return 'default';
        }
    };

    if (loading) return <CircularProgress />;

    return (
        <Box>
            <Typography variant="h5" gutterBottom>User Management</Typography>

            {/* Desktop View: Table */}
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <TableContainer sx={{ maxHeight: 440 }}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Username</TableCell>
                                    <TableCell>Role</TableCell>
                                    <TableCell>Date Joined</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map((u) => (
                                    <TableRow key={u.id} hover>
                                        <TableCell>{u.email}</TableCell>
                                        <TableCell>{u.full_name || '-'}</TableCell>
                                        <TableCell>{u.username || '-'}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={u.role.toUpperCase()}
                                                color={getStatusColor(u.role)}
                                                size="small"
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell>{new Date(u.created_at).toLocaleDateString()}</TableCell>
                                        <TableCell align="right">
                                            {u.role === 'pending' && (
                                                <>
                                                    <Button
                                                        size="small"
                                                        color="success"
                                                        startIcon={<CheckCircleIcon />}
                                                        onClick={() => openConfirmDialog('update', u.id, 'admin')}
                                                        disabled={actionLoading === u.id}
                                                        sx={{ mr: 1 }}
                                                    >
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        size="small"
                                                        color="error"
                                                        startIcon={<CancelIcon />}
                                                        onClick={() => openConfirmDialog('reject', u.id)}
                                                        disabled={actionLoading === u.id}
                                                    >
                                                        Reject
                                                    </Button>
                                                </>
                                            )}
                                            {u.role === 'admin' && (
                                                <Button
                                                    size="small"
                                                    color="warning"
                                                    onClick={() => openConfirmDialog('update', u.id, 'pending')}
                                                    disabled={actionLoading === u.id}
                                                >
                                                    Revoke
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Box>

            {/* Mobile View: Cards */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 2 }}>
                {users.map((u) => (
                    <Paper key={u.id} elevation={2} sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                                {u.username || 'No Username'}
                            </Typography>
                            <Chip
                                label={u.role.toUpperCase()}
                                color={getStatusColor(u.role)}
                                size="small"
                                variant="outlined"
                            />
                        </Box>

                        <Typography variant="body2" color="text.secondary">
                            {u.full_name || 'No Name'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {u.email}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Joined: {new Date(u.created_at).toLocaleDateString()}
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 1, mt: 1, justifyContent: 'flex-end' }}>
                            {u.role === 'pending' && (
                                <>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        color="success"
                                        startIcon={<CheckCircleIcon />}
                                        onClick={() => openConfirmDialog('update', u.id, 'admin')}
                                        disabled={actionLoading === u.id}
                                    >
                                        Approve
                                    </Button>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        color="error"
                                        startIcon={<CancelIcon />}
                                        onClick={() => openConfirmDialog('reject', u.id)}
                                        disabled={actionLoading === u.id}
                                    >
                                        Reject
                                    </Button>
                                </>
                            )}
                            {u.role === 'admin' && (
                                <Button
                                    size="small"
                                    variant="outlined"
                                    color="warning"
                                    onClick={() => openConfirmDialog('update', u.id, 'pending')}
                                    disabled={actionLoading === u.id}
                                >
                                    Revoke
                                </Button>
                            )}
                        </Box>
                    </Paper>
                ))}
            </Box>

            {/* Confirmation Dialog */}
            <Dialog
                open={confirmDialog.open}
                onClose={closeConfirmDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {confirmDialog.type === 'reject' ? 'Reject User?' : 'Update User Role?'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {confirmDialog.type === 'reject'
                            ? "Are you sure you want to REJECT and DELETE this user? This action cannot be undone."
                            : `Are you sure you want to change this user's role to '${confirmDialog.newRole?.toUpperCase()}'?`
                        }
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeConfirmDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={processAction} color={confirmDialog.type === 'reject' ? 'error' : 'primary'} autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar Feedback */}
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ManageUsers;

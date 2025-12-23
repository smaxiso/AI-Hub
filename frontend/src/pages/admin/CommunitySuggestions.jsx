import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Chip, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
    Accordion, AccordionSummary, AccordionDetails, Tooltip, CircularProgress, Alert,
    Card, CardContent, CardActions, Grid
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ArticleIcon from '@mui/icons-material/Article';
import BuildIcon from '@mui/icons-material/Build';
import QuizIcon from '@mui/icons-material/Quiz';
import FeedbackIcon from '@mui/icons-material/Feedback';
import { supabase } from '../../supabaseClient';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const CommunitySuggestions = () => {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusUpdating, setStatusUpdating] = useState(null); // id of item being updated

    useEffect(() => {
        fetchSuggestions();
    }, []);

    const fetchSuggestions = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch(`${API_URL}/community/suggestions`, {
                headers: {
                    'Authorization': `Bearer ${session?.access_token}`
                }
            });
            if (!res.ok) throw new Error('Failed to fetch suggestions');
            const data = await res.json();
            setSuggestions(data);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        setStatusUpdating(id);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch(`${API_URL}/community/suggestions/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.access_token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (!res.ok) throw new Error('Failed to update status');

            // Update local state
            setSuggestions(suggestions.map(s =>
                s.id === id ? { ...s, status: newStatus } : s
            ));
        } catch (err) {
            console.error(err);
            alert('Error updating status');
        } finally {
            setStatusUpdating(null);
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'tool': return <BuildIcon color="primary" />;
            case 'quiz_question': return <QuizIcon color="secondary" />;
            case 'feedback': return <FeedbackIcon color="action" />;
            default: return <ArticleIcon />;
        }
    };

    const getStatusChip = (status, type) => {
        let color = 'default';
        if (status === 'approved') color = 'success';
        if (status === 'rejected') color = 'error';
        if (status === 'pending') color = 'warning';

        let label = status.toUpperCase();
        if (status === 'pending') label = 'NEW';
        if (type === 'feedback') {
            if (status === 'approved') label = 'REVIEWED'; // or ACKNOWLEDGED/SEEN
            if (status === 'rejected') label = 'DISMISSED';
        }

        return <Chip label={label} color={color} size="small" />;
    };

    const renderContentPreview = (suggestion) => {
        return (
            <Accordion elevation={0} sx={{ '&:before': { display: 'none' } }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ p: 0, minHeight: 0 }}>
                    <Typography variant="body2" color="primary" sx={{ textDecoration: 'underline' }}>
                        View Content
                    </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                    <Box sx={{ overflowX: 'auto', maxHeight: '300px' }}>
                        <pre style={{ margin: 0, fontSize: '0.75rem', fontFamily: 'monospace' }}>
                            {JSON.stringify(suggestion.content, null, 2)}
                        </pre>
                    </Box>
                </AccordionDetails>
            </Accordion>
        );
    };

    if (loading) return <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress /></Box>;
    if (error) return <Alert severity="error">{error}</Alert>;

    const renderMobileView = () => (
        <Grid container spacing={2}>
            {suggestions.map((row) => (
                <Grid item xs={12} key={row.id}>
                    <Card variant="outlined">
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {getTypeIcon(row.type)}
                                    <Typography variant="subtitle1" sx={{ textTransform: 'capitalize', fontWeight: 'bold' }}>
                                        {row.type.replace('_', ' ')}
                                    </Typography>
                                </Box>
                                {getStatusChip(row.status, row.type)}
                            </Box>

                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                <strong>User:</strong> {row.profiles?.username || 'Unknown'} <br />
                                <Typography variant="caption">({row.profiles?.full_name || row.user_id.substring(0, 8) + '...'})</Typography>
                            </Typography>

                            <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 2 }}>
                                {new Date(row.created_at).toLocaleDateString()}
                            </Typography>

                            {renderContentPreview(row)}
                        </CardContent>
                        <CardActions sx={{ justifyContent: 'flex-end', gap: 1 }}>
                            {row.status === 'pending' && (
                                <>
                                    <Button
                                        size="small"
                                        color="success"
                                        variant="outlined"
                                        startIcon={<CheckIcon />}
                                        onClick={() => handleStatusUpdate(row.id, 'approved')}
                                        disabled={statusUpdating === row.id}
                                    >
                                        {row.type === 'feedback' ? 'Read' : 'Approve'}
                                    </Button>
                                    <Button
                                        size="small"
                                        color="error"
                                        variant="outlined"
                                        startIcon={<CloseIcon />}
                                        onClick={() => handleStatusUpdate(row.id, 'rejected')}
                                        disabled={statusUpdating === row.id}
                                    >
                                        {row.type === 'feedback' ? 'Dismiss' : 'Reject'}
                                    </Button>
                                </>
                            )}
                            {row.status !== 'pending' && (
                                <Button
                                    size="small"
                                    variant="text"
                                    color="inherit"
                                    onClick={() => handleStatusUpdate(row.id, 'pending')}
                                >
                                    Reset Status
                                </Button>
                            )}
                        </CardActions>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );

    const renderDesktopView = () => (
        <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader aria-label="sticky table">
                <TableHead>
                    <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>User</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Content</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {suggestions.map((row) => (
                        <TableRow key={row.id} hover>
                            <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                {new Date(row.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                                <Box>
                                    <Typography variant="body2" fontWeight="bold">
                                        {row.profiles?.username || 'Unknown'}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {row.profiles?.full_name || row.user_id.substring(0, 8) + '...'}
                                    </Typography>
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {getTypeIcon(row.type)}
                                    <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                                        {row.type.replace('_', ' ')}
                                    </Typography>
                                </Box>
                            </TableCell>
                            <TableCell sx={{ maxWidth: 300 }}>
                                {renderContentPreview(row)}
                            </TableCell>
                            <TableCell>{getStatusChip(row.status, row.type)}</TableCell>
                            <TableCell align="right">
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                    {row.status === 'pending' && (
                                        <>
                                            <Tooltip title={row.type === 'feedback' ? "Mark as Read" : "Approve"}>
                                                <IconButton
                                                    color="success"
                                                    size="small"
                                                    onClick={() => handleStatusUpdate(row.id, 'approved')}
                                                    disabled={statusUpdating === row.id}
                                                >
                                                    <CheckIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title={row.type === 'feedback' ? "Dismiss" : "Reject"}>
                                                <IconButton
                                                    color="error"
                                                    size="small"
                                                    onClick={() => handleStatusUpdate(row.id, 'rejected')}
                                                    disabled={statusUpdating === row.id}
                                                >
                                                    <CloseIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </>
                                    )}
                                    {row.status !== 'pending' && (
                                        <Button
                                            size="small"
                                            variant="text"
                                            color="inherit"
                                            onClick={() => handleStatusUpdate(row.id, 'pending')}
                                        >
                                            Reset
                                        </Button>
                                    )}
                                </Box>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );

    if (loading) return <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress /></Box>;
    if (error) return <Alert severity="error">{error}</Alert>;
    if (suggestions.length === 0) return <Alert severity="info">No suggestions found.</Alert>;

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden', bgcolor: 'transparent', boxShadow: 'none' }}>
            {/* Desktop View */}
            <Box sx={{ display: { xs: 'none', md: 'block' }, bgcolor: '#fff', borderRadius: 1, boxShadow: 1 }}>
                {renderDesktopView()}
            </Box>

            {/* Mobile View */}
            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                {renderMobileView()}
            </Box>
        </Paper>
    );
};

export default CommunitySuggestions;

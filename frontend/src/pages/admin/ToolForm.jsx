
import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Paper, Container, Grid, MenuItem, Alert, CircularProgress, Snackbar } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const CATEGORIES = ['Chat', 'Image', 'Video', 'Coding', 'Audio', 'Agent', 'Other'];
const PRICING = ['Free', 'Freemium', 'Paid'];

const ToolForm = ({ isEditing }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        url: '',
        category: 'Chat',
        description: '',
        tags: '',
        pricing: 'Freemium',
        icon: '',
        use_cases: ''
    });

    const [loading, setLoading] = useState(isEditing);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [duplicateCheck, setDuplicateCheck] = useState({ checking: false, exists: false, tool: null });

    useEffect(() => {
        if (isEditing && id) {
            fetchTool();
        }
    }, [isEditing, id]);

    const fetchTool = async () => {
        try {
            const res = await fetch(`${API_URL}/tools`);
            const tools = await res.json();
            const tool = tools.find(t => t.id === id);

            if (tool) {
                setFormData({
                    ...tool,
                    tags: Array.isArray(tool.tags) ? tool.tags.join(', ') : tool.tags,
                    use_cases: Array.isArray(tool.use_cases) ? tool.use_cases.join(', ') : tool.use_cases || ''
                });
            } else {
                setError('Tool not found');
            }
        } catch (err) {
            setError('Failed to fetch tool details');
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    // Debounced duplicate check
    useEffect(() => {
        if (!formData.url || isEditing) return; // Skip check when editing existing tool

        const timeoutId = setTimeout(async () => {
            setDuplicateCheck({ checking: true, exists: false, tool: null });

            try {
                const res = await fetch(`${API_URL}/tools/check-duplicate?url=${encodeURIComponent(formData.url)}`);
                const data = await res.json();

                if (data.exists) {
                    setDuplicateCheck({ checking: false, exists: true, tool: data.tool });
                } else {
                    setDuplicateCheck({ checking: false, exists: false, tool: null });
                }
            } catch (err) {
                console.error('Error checking duplicate:', err);
                setDuplicateCheck({ checking: false, exists: false, tool: null });
            }
        }, 800); // 800ms debounce

        return () => clearTimeout(timeoutId);
    }, [formData.url, isEditing]);

    const handleImageUpload = async (event) => {
        try {
            setUploading(true);
            const file = event.target.files[0];
            if (!file) return;

            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('tool-logos')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('tool-logos')
                .getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, icon: publicUrl }));
        } catch (error) {
            console.error('Error uploading image:', error);
            setSnackbar({ open: true, message: 'Error uploading image!', severity: 'error' });
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        // Prevent submission if duplicate exists (only for new tools)
        if (!isEditing && duplicateCheck.exists) {
            setError('This tool URL already exists in the database. Please use a different URL.');
            setSubmitting(false);
            return;
        }

        // Format arrays
        const payload = {
            ...formData,
            tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
            use_cases: formData.use_cases.split(',').map(t => t.trim()).filter(Boolean),
            added_date: isEditing ? formData.added_date : new Date().toISOString().split('T')[0]
        };

        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            const url = isEditing ? `${API_URL}/tools/${id}` : `${API_URL}/tools`;
            const method = isEditing ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error('Failed to save tool');

            navigate('/admin');
        } catch (err) {
            setError(err.message);
            setSubmitting(false);
        }
    };

    if (loading) return <Box p={4}><CircularProgress /></Box>;

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', pb: 8, pt: 4 }}>
            <Container maxWidth="md">
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        {isEditing ? 'Edit Tool' : 'Add New Tool'}
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Description"
                                    multiline
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Category"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                >
                                    {CATEGORIES.map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Pricing"
                                    value={formData.pricing}
                                    onChange={(e) => setFormData({ ...formData, pricing: e.target.value })}
                                >
                                    {PRICING.map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Website URL"
                                    value={formData.url}
                                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                    required
                                    error={duplicateCheck.exists}
                                    helperText={duplicateCheck.checking ? 'Checking for duplicates...' : ''}
                                />
                                {duplicateCheck.exists && duplicateCheck.tool && (
                                    <Alert severity="warning" sx={{ mt: 1 }}>
                                        <Typography variant="subtitle2" fontWeight="bold">
                                            ⚠️ This tool already exists!
                                        </Typography>
                                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                                            <strong>Name:</strong> {duplicateCheck.tool.name}<br />
                                            <strong>Category:</strong> {duplicateCheck.tool.category}<br />
                                            <strong>Added:</strong> {duplicateCheck.tool.added_date}
                                        </Typography>
                                    </Alert>
                                )}
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Logo / Icon
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                    {formData.icon && (
                                        <Box
                                            component="img"
                                            src={formData.icon}
                                            sx={{ width: 64, height: 64, borderRadius: 2, objectFit: 'cover' }}
                                        />
                                    )}
                                    <Button
                                        variant="outlined"
                                        component="label"
                                        disabled={uploading}
                                    >
                                        {uploading ? 'Uploading...' : 'Upload Image'}
                                        <input
                                            type="file"
                                            hidden
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                        />
                                    </Button>
                                    <TextField
                                        label="Or Paste Icon URL"
                                        size="small"
                                        fullWidth
                                        value={formData.icon || ''}
                                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                        helperText="Provide a direct image URL or upload one"
                                    />
                                </Box>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Tags (comma separated)"
                                    value={formData.tags}
                                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                    helperText="e.g. coding, analytics, video"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Use Cases (comma separated)"
                                    value={formData.use_cases}
                                    onChange={(e) => setFormData({ ...formData, use_cases: e.target.value })}
                                    helperText="e.g. Writing Emails, Code Generation"
                                />
                            </Grid>

                            <Grid item xs={12} sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                <Button onClick={() => navigate('/admin')}>
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    disabled={submitting}
                                >
                                    {submitting ? 'Saving...' : 'Save Tool'}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </Container>

            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ToolForm;

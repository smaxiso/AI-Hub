import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Container, Paper, Typography, TextField, Button,
    Alert, Avatar, Grid, Divider, Card, CardContent,
    LinearProgress
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SaveIcon from '@mui/icons-material/Save';
import Header from '../../components/Header';
import AvatarUpload from '../../components/AvatarUpload';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabaseClient';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const Profile = () => {
    const { user, refreshUser } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        full_name: '',
        username: '',
        avatar_url: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [progress, setProgress] = useState(null);

    useEffect(() => {
        if (user?.profile) {
            setFormData({
                full_name: user.profile.full_name || '',
                username: user.profile.username || '',
                avatar_url: user.profile.avatar_url || ''
            });
        }
        fetchProgress();
    }, [user]);

    const fetchProgress = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch(`${API_URL}/learning/progress`, {
                headers: { 'Authorization': `Bearer ${session.access_token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setProgress(data);
            }
        } catch (err) {
            console.error('Error fetching progress:', err);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const { error: updateError } = await supabase
                .from('profiles')
                .update({
                    full_name: formData.full_name,
                    username: formData.username,
                    avatar_url: formData.avatar_url
                })
                .eq('id', user.id);

            if (updateError) throw updateError;

            // Refresh user data
            await refreshUser();
            setSuccess('Profile updated successfully!');
        } catch (err) {
            setError(err.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        navigate('/login');
        return null;
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', pb: 8 }}>
            <Header />

            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
                    Profile Settings
                </Typography>

                <Grid container spacing={3}>
                    {/* Profile Info */}
                    <Grid item xs={12} md={8}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ mb: 3 }}>
                                Personal Information
                            </Typography>

                            {error && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {error}
                                </Alert>
                            )}

                            {success && (
                                <Alert severity="success" sx={{ mb: 2 }}>
                                    {success}
                                </Alert>
                            )}

                            <form onSubmit={handleSubmit}>
                                <AvatarUpload
                                    currentAvatarUrl={formData.avatar_url}
                                    userId={user.id}
                                    onUploadComplete={(newUrl) => {
                                        setFormData({ ...formData, avatar_url: newUrl });
                                        refreshUser();
                                    }}
                                />

                                <TextField
                                    label="Full Name"
                                    name="full_name"
                                    fullWidth
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    sx={{ mb: 2 }}
                                />

                                <TextField
                                    label="Username"
                                    name="username"
                                    fullWidth
                                    value={formData.username}
                                    onChange={handleChange}
                                    sx={{ mb: 2 }}
                                    helperText="Your unique username"
                                />

                                <TextField
                                    label="Email"
                                    fullWidth
                                    value={user.email}
                                    disabled
                                    sx={{ mb: 2 }}
                                    helperText="Email cannot be changed"
                                />

                                <TextField
                                    label="Avatar URL"
                                    name="avatar_url"
                                    fullWidth
                                    value={formData.avatar_url}
                                    onChange={handleChange}
                                    sx={{ mb: 3 }}
                                    helperText="URL to your profile picture"
                                />

                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    size="large"
                                    disabled={loading}
                                    startIcon={<SaveIcon />}
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </form>
                        </Paper>
                    </Grid>

                    {/* Learning Progress */}
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    Learning Stats
                                </Typography>

                                {progress ? (
                                    <Box>
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Total Points
                                            </Typography>
                                            <Typography variant="h4" color="primary.main">
                                                {progress.total_points || 0}
                                            </Typography>
                                        </Box>

                                        <Divider sx={{ my: 2 }} />

                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                Current Level
                                            </Typography>
                                            <Typography variant="h6">
                                                {progress.current_level || 'Beginner'}
                                            </Typography>
                                            <LinearProgress
                                                variant="determinate"
                                                value={(progress.modules_completed_at_level / 5) * 100 || 0}
                                                sx={{ mt: 1 }}
                                            />
                                            <Typography variant="caption" color="text.secondary">
                                                {progress.modules_completed_at_level || 0} / 5 modules completed
                                            </Typography>
                                        </Box>

                                        <Divider sx={{ my: 2 }} />

                                        <Box>
                                            <Typography variant="body2" color="text.secondary">
                                                Modules Completed
                                            </Typography>
                                            <Typography variant="h6">
                                                {progress.completed_modules?.length || 0}
                                            </Typography>
                                        </Box>

                                        <Button
                                            variant="outlined"
                                            fullWidth
                                            sx={{ mt: 2 }}
                                            onClick={() => navigate('/learning')}
                                        >
                                            Continue Learning
                                        </Button>
                                    </Box>
                                ) : (
                                    <Typography variant="body2" color="text.secondary">
                                        No learning progress yet. Start learning to earn points!
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>

                        <Card sx={{ mt: 2 }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    Account Info
                                </Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    <strong>Role:</strong> {user.role}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    <strong>Joined:</strong> {new Date(user.created_at).toLocaleDateString()}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Profile;

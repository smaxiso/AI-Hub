import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Container, Paper, Typography, TextField, Button,
    Alert, Grid, Divider, Card, CardContent,
    LinearProgress, Snackbar
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import Header from '../../components/Header';
import AvatarUpload from '../../components/AvatarUpload';
import Badge from '../../components/learning/Badge';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabaseClient';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const Profile = () => {
    const { user, refreshUser } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        full_name: '',
        username: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [progress, setProgress] = useState(null);
    const [badges, setBadges] = useState([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        if (user?.profile) {
            setFormData({
                full_name: user.profile.full_name || '',
                username: user.profile.username || ''
            });
        }
        fetchProgress();
    }, [user]);

    const fetchProgress = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();

            // 1. Fetch Learning Progress
            const res = await fetch(`${API_URL}/learning/progress`, {
                headers: { 'Authorization': `Bearer ${session.access_token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setProgress(data);
            }

            // 2. Fetch Gamification Data
            const gamRes = await fetch(`${API_URL}/gamification/progress`, {
                headers: { 'Authorization': `Bearer ${session.access_token}` }
            });
            if (gamRes.ok) {
                const gamData = await gamRes.json();
                setBadges(gamData.badges || []);
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
                    username: formData.username
                })
                .eq('id', user.id);

            if (updateError) throw updateError;

            await refreshUser();
            setSuccess('Profile updated successfully!');
            setSnackbar({ open: true, message: 'Profile updated successfully!', severity: 'success' });
        } catch (err) {
            setError(err.message || 'Failed to update profile');
            setSnackbar({ open: true, message: err.message || 'Failed to update profile', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarSuccess = async (url) => {
        await refreshUser();
        setSnackbar({ open: true, message: 'Avatar updated successfully!', severity: 'success' });
    };

    const handleAvatarError = (errorMsg) => {
        setSnackbar({ open: true, message: errorMsg, severity: 'error' });
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
                    <Grid item xs={12} md={8}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ mb: 3 }}>
                                Personal Information
                            </Typography>

                            {error && (
                                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                                    {error}
                                </Alert>
                            )}

                            {success && (
                                <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
                                    {success}
                                </Alert>
                            )}

                            <AvatarUpload
                                currentAvatar={user.profile?.avatar_url}
                                userId={user.id}
                                onUploadSuccess={handleAvatarSuccess}
                                onUploadError={handleAvatarError}
                            />

                            <Divider sx={{ my: 3 }} />

                            <form onSubmit={handleSubmit}>
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
                                    sx={{ mb: 3 }}
                                    helperText="Email cannot be changed"
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

                    <Grid item xs={12} md={4}>
                        {/* Badges Section */}
                        <Card sx={{ mb: 3 }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    Recent Badges <Typography variant="caption" sx={{ color: 'text.secondary' }}>({badges.length})</Typography>
                                </Typography>

                                {badges.length > 0 ? (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {badges.map((badge, index) => (
                                            <Badge key={index} achievement={badge} />
                                        ))}
                                    </Box>
                                ) : (
                                    <Typography variant="body2" color="text.secondary">
                                        No badges earned yet. Complete modules and quizzes to earn them!
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>

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
                                                {progress.completed_modules?.length || 0} modules completed
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

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Profile;

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Box, Container, Paper, Typography, TextField, Button,
    Alert, InputAdornment, IconButton, CircularProgress
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import SchoolIcon from '@mui/icons-material/School';
import { supabase } from '../../supabaseClient';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const Signup = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            // Call learner signup endpoint
            const res = await fetch(`${API_URL}/auth/signup-learner`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    full_name: formData.fullName,
                    username: formData.username
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Signup failed');
            }

            // If auto-login successful, refresh session
            if (data.session) {
                await supabase.auth.setSession(data.session);
            }

            // Redirect to learning hub
            navigate('/learning', { replace: true });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            py: 4
        }}>
            <Container maxWidth="sm">
                <Paper elevation={24} sx={{ p: { xs: 3, md: 4 }, borderRadius: 3 }}>
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <SchoolIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                            Start Learning
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Create your account and begin your AI journey
                        </Typography>
                    </Box>

                    <form onSubmit={handleSubmit}>
                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}

                        <TextField
                            label="Full Name"
                            name="fullName"
                            fullWidth
                            required
                            value={formData.fullName}
                            onChange={handleChange}
                            sx={{ mb: 2 }}
                            autoComplete="name"
                        />

                        <TextField
                            label="Username"
                            name="username"
                            fullWidth
                            required
                            value={formData.username}
                            onChange={handleChange}
                            sx={{ mb: 2 }}
                            autoComplete="username"
                            helperText="Choose a unique username"
                        />

                        <TextField
                            label="Email"
                            name="email"
                            type="email"
                            fullWidth
                            required
                            value={formData.email}
                            onChange={handleChange}
                            sx={{ mb: 2 }}
                            autoComplete="email"
                        />

                        <TextField
                            label="Password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            fullWidth
                            required
                            value={formData.password}
                            onChange={handleChange}
                            sx={{ mb: 2 }}
                            autoComplete="new-password"
                            helperText="At least 6 characters"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />

                        <TextField
                            label="Confirm Password"
                            name="confirmPassword"
                            type={showPassword ? 'text' : 'password'}
                            fullWidth
                            required
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            sx={{ mb: 3 }}
                            autoComplete="new-password"
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            size="large"
                            disabled={loading}
                            sx={{ mb: 2, py: 1.5 }}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Create Account'}
                        </Button>

                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                                Already have an account?{' '}
                                <Link to="/login" style={{ color: '#667eea', textDecoration: 'none', fontWeight: 600 }}>
                                    Log In
                                </Link>
                            </Typography>
                        </Box>
                    </form>
                </Paper>

                <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Button
                        component={Link}
                        to="/"
                        sx={{ color: 'white' }}
                    >
                        ← Back to Home
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default Signup;

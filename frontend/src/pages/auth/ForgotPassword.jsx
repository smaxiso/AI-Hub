import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Box, Container, Paper, Typography, TextField, Button,
    Alert, CircularProgress
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import EmailIcon from '@mui/icons-material/Email';
import { supabase } from '../../supabaseClient';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });
            if (resetError) throw resetError;
            setSent(true);
        } catch (err) {
            setError(err.message || 'Failed to send reset link');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}>
            <Container maxWidth="sm">
                <Paper elevation={24} sx={{ p: { xs: 3, md: 4 }, borderRadius: 3 }}>
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <SchoolIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                            Reset Password
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Enter your email and we'll send you a reset link
                        </Typography>
                    </Box>

                    {sent ? (
                        <Box sx={{ textAlign: 'center', py: 2 }}>
                            <EmailIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                Check your email
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                We sent a password reset link to <strong>{email}</strong>. Click the link in the email to set a new password.
                            </Typography>
                            <Button
                                variant="outlined"
                                component={Link}
                                to="/login"
                                sx={{ mt: 1 }}
                            >
                                Back to Login
                            </Button>
                        </Box>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            {error && (
                                <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
                            )}

                            <TextField
                                label="Email Address"
                                type="email"
                                fullWidth
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                sx={{ mb: 2 }}
                                autoComplete="email"
                                placeholder="you@example.com"
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                size="large"
                                disabled={loading}
                                sx={{ mb: 2, py: 1.5 }}
                            >
                                {loading ? <CircularProgress size={24} /> : 'Send Reset Link'}
                            </Button>

                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="body2" color="text.secondary">
                                    Remember your password?{' '}
                                    <Link to="/login" style={{ color: '#667eea', textDecoration: 'none', fontWeight: 600 }}>
                                        Log In
                                    </Link>
                                </Typography>
                            </Box>
                        </form>
                    )}
                </Paper>
            </Container>
        </Box>
    );
};

export default ForgotPassword;

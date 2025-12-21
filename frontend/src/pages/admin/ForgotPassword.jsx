
import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Alert, Link } from '@mui/material';
import { supabase } from '../../supabaseClient';
import { Link as RouterLink } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ type: '', text: '' });

    const handleReset = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg({ type: '', text: '' });

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/admin/reset-password`,
            });
            if (error) throw error;
            setMsg({ type: 'success', text: 'Password reset link sent! Check your email.' });
        } catch (err) {
            setMsg({ type: 'error', text: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
            }}
        >
            <Paper
                elevation={10}
                sx={{
                    p: 4,
                    maxWidth: 400,
                    width: '100%',
                    borderRadius: 2,
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
            >
                <Typography variant="h5" gutterBottom sx={{ color: '#fff', textAlign: 'center', mb: 3 }}>
                    Reset Password
                </Typography>

                {msg.text && <Alert severity={msg.type} sx={{ mb: 2 }}>{msg.text}</Alert>}

                <form onSubmit={handleReset}>
                    <TextField
                        label="Enter your email"
                        variant="standard"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        InputLabelProps={{ style: { color: '#ccc' } }}
                        sx={{
                            input: { color: '#fff' },
                            '& .MuiInput-underline:before': { borderBottomColor: 'rgba(255,255,255,0.3)' },
                            '& .MuiInput-underline:hover:before': { borderBottomColor: '#fff !important' },
                            '& .MuiInput-underline:after': { borderBottomColor: '#6BB6FF' },
                        }}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        disabled={loading}
                        sx={{ mt: 3, mb: 2, background: 'linear-gradient(90deg, #6BB6FF 0%, #A78BFA 100%)' }}
                    >
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </Button>

                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Link component={RouterLink} to="/admin/login" sx={{ color: '#ccc', textDecoration: 'none' }}>
                            Back to Login
                        </Link>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
};

export default ForgotPassword;

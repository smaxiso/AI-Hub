
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Box, Button, TextField, Typography, Paper, Alert, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { supabase } from '../../supabaseClient';

const Login = () => {
    const { signIn, signOut } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [pendingUser, setPendingUser] = useState(false);

    const from = location.state?.from?.pathname || '/admin';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setPendingUser(false);

        try {
            let loginEmail = email;

            // Check if input is a username (no @ symbol)
            if (!email.includes('@')) {
                // Query database to get email from username
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('email, role')
                    .eq('username', email)
                    .single();

                if (!profile) {
                    setError('Username not found');
                    setLoading(false);
                    return;
                }

                loginEmail = profile.email;

                // Check if user is pending BEFORE login attempt
                if (profile.role === 'pending') {
                    setPendingUser(true);
                    setError(null);
                    setLoading(false);
                    return;
                }
            }

            // Attempt login with email
            const { error: signInError } = await signIn({ email: loginEmail, password });

            if (signInError) {
                // Check if it's because user is still pending
                if (signInError.message.includes('Email not confirmed')) {
                    setPendingUser(true);
                    setError(null);
                } else {
                    setError(signInError.message);
                }
                setLoading(false);
            } else {
                // Check role after successful login
                const { data: { session } } = await supabase.auth.getSession();
                if (session) {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('role')
                        .eq('id', session.user.id)
                        .single();

                    if (profile?.role === 'pending') {
                        await signOut();
                        setPendingUser(true);
                        setError(null);
                        setLoading(false);
                        return;
                    }
                }
                navigate(from, { replace: true });
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('An error occurred during login');
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
                <Typography variant="h4" gutterBottom sx={{ color: '#fff', textAlign: 'center', mb: 3 }}>
                    Admin Login
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {pendingUser && (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" fontWeight="bold">Account Pending Approval</Typography>
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                            Your profile is waiting for owner approval. Once approved, you'll be able to access the admin portal.
                        </Typography>
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Email or Username"
                        variant="standard"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        InputLabelProps={{
                            style: { color: '#ccc' },
                            shrink: email ? true : undefined
                        }}
                        sx={{
                            input: { color: '#fff' },
                            '& .MuiInput-underline:before': { borderBottomColor: 'rgba(255,255,255,0.3)' },
                            '& .MuiInput-underline:hover:before': { borderBottomColor: '#fff !important' },
                            '& .MuiInput-underline:after': { borderBottomColor: '#6BB6FF' },
                        }}
                    />
                    <TextField
                        label="Password"
                        variant="standard"
                        type={showPassword ? 'text' : 'password'}
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        InputLabelProps={{
                            style: { color: '#ccc' },
                            shrink: password ? true : undefined
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                        sx={{ color: '#ccc' }}
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                        sx={{
                            input: { color: '#fff' },
                            '& .MuiInput-underline:before': { borderBottomColor: 'rgba(255,255,255,0.3)' },
                            '& .MuiInput-underline:hover:before': { borderBottomColor: '#fff !important' },
                            '& .MuiInput-underline:after': { borderBottomColor: '#6BB6FF' },
                        }}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                        <Link to="/admin/forgot-password" style={{ color: '#aaa', fontSize: '0.875rem', textDecoration: 'none' }}>
                            Forgot Password?
                        </Link>
                    </Box>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        disabled={loading}
                        sx={{ mt: 3, mb: 2, background: 'linear-gradient(90deg, #6BB6FF 0%, #A78BFA 100%)' }}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </Button>

                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Link to="/admin/signup" style={{ color: '#ccc', textDecoration: 'none' }}>
                            Need an account? Request Access
                        </Link>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
};

export default Login;

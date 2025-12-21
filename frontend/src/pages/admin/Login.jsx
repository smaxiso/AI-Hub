
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Box, Button, TextField, Typography, Paper, Alert, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Login = () => {
    const { signIn } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const from = location.state?.from?.pathname || '/admin';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await signIn({ email, password });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            navigate(from, { replace: true });
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

                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Email"
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

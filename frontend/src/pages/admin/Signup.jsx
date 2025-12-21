
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Button, TextField, Typography, Paper, Alert, Container } from '@mui/material';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        full_name: '',
        username: ''
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Username Check State
    const [usernameStatus, setUsernameStatus] = useState(null); // 'checking' | 'available' | 'taken' | null

    const checkUsername = async (username) => {
        if (!username || username.length < 3) {
            setUsernameStatus(null);
            return;
        }

        setUsernameStatus('checking');
        try {
            const res = await fetch(`${API_URL}/auth/check-username?username=${username}`);
            const data = await res.json();
            if (res.ok) {
                setUsernameStatus(data.available ? 'available' : 'taken');
            }
        } catch (err) {
            console.error('Error checking username:', err);
            setUsernameStatus(null);
        }
    };

    // Debounce username check
    React.useEffect(() => {
        const timer = setTimeout(() => {
            checkUsername(formData.username);
        }, 500);
        return () => clearTimeout(timer);
    }, [formData.username]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (usernameStatus === 'taken') return;

        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`${API_URL}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Signup failed');

            setSuccess(true);
            setTimeout(() => navigate('/admin/login'), 3000);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const getUsernameHelperText = () => {
        if (usernameStatus === 'checking') return 'Checking availability...';
        if (usernameStatus === 'available') return '✅ Username available';
        if (usernameStatus === 'taken') return '❌ Username taken';
        if (formData.username && formData.username.length < 3) return 'Username must be at least 3 chars';
        return '';
    };

    const getUsernameColor = () => {
        if (usernameStatus === 'available') return 'success';
        if (usernameStatus === 'taken') return 'error';
        return 'primary';
    };

    if (success) {
        return (
            <Container maxWidth="sm" sx={{ mt: 8 }}>
                <Alert severity="success">
                    Account request submitted successfully! <br />
                    Please wait for the Owner to approve your account. <br />
                    Redirecting to login...
                </Alert>
            </Container>
        );
    }

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
                    Request Access
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Full Name"
                        variant="standard"
                        fullWidth
                        margin="normal"
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        required
                        InputLabelProps={{ style: { color: '#ccc' } }}
                        sx={{
                            input: { color: '#fff' },
                            '& .MuiInput-underline:before': { borderBottomColor: 'rgba(255,255,255,0.3)' },
                            '& .MuiInput-underline:hover:before': { borderBottomColor: '#fff !important' },
                            '& .MuiInput-underline:after': { borderBottomColor: '#6BB6FF' },
                        }}
                    />
                    <TextField
                        label="Username"
                        variant="standard"
                        fullWidth
                        margin="normal"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        required
                        error={usernameStatus === 'taken'}
                        helperText={getUsernameHelperText()}
                        FormHelperTextProps={{ sx: { color: usernameStatus === 'available' ? '#4caf50' : (usernameStatus === 'taken' ? '#f44336' : '#ccc') } }}
                        InputLabelProps={{ style: { color: '#ccc' } }}
                        sx={{
                            input: { color: '#fff' },
                            '& .MuiInput-underline:before': { borderBottomColor: 'rgba(255,255,255,0.3)' },
                            '& .MuiInput-underline:hover:before': { borderBottomColor: '#fff !important' },
                            '& .MuiInput-underline:after': { borderBottomColor: '#6BB6FF' },
                        }}
                    />
                    <TextField
                        label="Email"
                        variant="standard"
                        fullWidth
                        margin="normal"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        InputLabelProps={{ style: { color: '#ccc' } }}
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
                        type="password"
                        fullWidth
                        margin="normal"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                        disabled={loading || usernameStatus === 'taken' || usernameStatus === 'checking'}
                        sx={{ mt: 3, mb: 2, background: 'linear-gradient(90deg, #6BB6FF 0%, #A78BFA 100%)' }}
                    >
                        {loading ? 'Submitting...' : 'Sign Up'}
                    </Button>

                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Link to="/admin/login" style={{ color: '#ccc', textDecoration: 'none' }}>
                            Already have an account? Login
                        </Link>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
};

export default Signup;

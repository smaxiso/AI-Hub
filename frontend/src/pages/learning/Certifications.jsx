import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Container, Typography, Grid, Skeleton, Alert, Button, LinearProgress
} from '@mui/material';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabaseClient';
import Header from '../../components/Header';
import CertificateCard from '../../components/learning/CertificateCard';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const Certifications = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [certifications, setCertifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [checking, setChecking] = useState(false);
    const [checkResult, setCheckResult] = useState(null);

    useEffect(() => { fetchCertifications(); }, [user]);

    const fetchCertifications = async () => {
        try {
            const headers = {};
            if (user) {
                const { data: { session } } = await supabase.auth.getSession();
                if (session) headers['Authorization'] = `Bearer ${session.access_token}`;
            }
            const res = await fetch(`${API_URL}/certifications`, { headers });
            if (res.ok) setCertifications(await res.json());
            else setError('Failed to load certifications');
        } catch (err) {
            setError('Failed to load certifications');
        } finally { setLoading(false); }
    };

    const handleCheckCertifications = async () => {
        if (!user) return navigate('/login');
        setChecking(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch(`${API_URL}/certifications/check`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${session.access_token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setCheckResult(data);
                if (data.awarded?.length > 0) fetchCertifications();
            }
        } catch (err) {
            console.error('Check error:', err);
        } finally { setChecking(false); }
    };

    const earnedCount = certifications.filter(c => c.earned).length;
    const totalPoints = certifications.filter(c => c.earned).reduce((sum, c) => sum + c.points_awarded, 0);

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', pb: 8 }}>
            <Header />

            {/* Hero */}
            <Box sx={{
                py: { xs: 3, md: 4 },
                background: 'linear-gradient(135deg, #FF6B35 0%, #F7C948 100%)',
                color: 'white'
            }}>
                <Container maxWidth="xl">
                    <Button startIcon={<ArrowBackIcon />} sx={{ color: 'white', mb: 1 }} onClick={() => navigate('/learning')}>
                        Back to Learning
                    </Button>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <WorkspacePremiumIcon sx={{ fontSize: { xs: 32, md: 40 } }} />
                        <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', md: '2rem' }, fontWeight: 700 }}>
                            Certifications
                        </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ opacity: 0.9, mb: 2 }}>
                        Complete all modules in a level to earn your certificate. Each certification awards bonus points.
                    </Typography>
                    {user && (
                        <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                            <Box>
                                <Typography variant="h5" sx={{ fontWeight: 700 }}>{earnedCount}/4</Typography>
                                <Typography variant="caption">Certificates Earned</Typography>
                            </Box>
                            <Box>
                                <Typography variant="h5" sx={{ fontWeight: 700 }}>{totalPoints.toLocaleString()}</Typography>
                                <Typography variant="caption">Bonus Points</Typography>
                            </Box>
                            <LinearProgress
                                variant="determinate"
                                value={(earnedCount / 4) * 100}
                                sx={{ flexGrow: 1, height: 8, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.2)', '& .MuiLinearProgress-bar': { bgcolor: 'white' } }}
                            />
                        </Box>
                    )}
                </Container>
            </Box>

            <Container maxWidth="xl" sx={{ mt: { xs: 2, md: 4 } }}>
                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                {checkResult?.awarded?.length > 0 && (
                    <Alert severity="success" sx={{ mb: 3 }}>
                        🎉 Congratulations! You earned: {checkResult.awarded.map(a => a.name).join(', ')}
                    </Alert>
                )}

                {user && (
                    <Box sx={{ mb: 3, textAlign: 'right' }}>
                        <Button variant="outlined" onClick={handleCheckCertifications} disabled={checking}>
                            {checking ? 'Checking...' : 'Check Eligibility'}
                        </Button>
                    </Box>
                )}

                {loading ? (
                    <Grid container spacing={3}>
                        {[1, 2, 3, 4].map(i => (
                            <Grid item xs={12} sm={6} key={i}>
                                <Skeleton variant="rectangular" height={250} sx={{ borderRadius: 2 }} />
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Grid container spacing={3}>
                        {certifications.map(cert => (
                            <Grid item xs={12} sm={6} key={cert.id}>
                                <CertificateCard certification={cert} />
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>
        </Box>
    );
};

export default Certifications;

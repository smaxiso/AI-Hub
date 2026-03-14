import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Container, Typography, Card, CardContent, Chip, Skeleton,
    Alert, Button, Divider
} from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import SchoolIcon from '@mui/icons-material/School';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import Header from '../../components/Header';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const LEVEL_COLORS = {
    beginner: { main: '#4CAF50', gradient: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)' },
    intermediate: { main: '#2196F3', gradient: 'linear-gradient(135deg, #2196F3 0%, #42A5F5 100%)' },
    advanced: { main: '#FF9800', gradient: 'linear-gradient(135deg, #FF9800 0%, #FFA726 100%)' },
    expert: { main: '#9C27B0', gradient: 'linear-gradient(135deg, #9C27B0 0%, #AB47BC 100%)' }
};

const CertificateVerify = () => {
    const { certNumber } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const verify = async () => {
            try {
                const res = await fetch(`${API_URL}/certifications/verify/${certNumber}`);
                const json = await res.json();
                if (!res.ok || !json.valid) {
                    setError(json.error || 'Certificate not found');
                } else {
                    setData(json);
                }
            } catch (err) {
                setError('Verification failed. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        verify();
    }, [certNumber]);

    const colors = data ? (LEVEL_COLORS[data.certification.level] || LEVEL_COLORS.beginner) : LEVEL_COLORS.beginner;

    if (loading) {
        return (
            <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
                <Header />
                <Container maxWidth="sm" sx={{ pt: 8 }}>
                    <Skeleton variant="rounded" height={400} sx={{ borderRadius: 3 }} />
                </Container>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
                <Header />
                <Container maxWidth="sm" sx={{ pt: 8, textAlign: 'center' }}>
                    <ErrorOutlineIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>Invalid Certificate</Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        {error}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Certificate ID: <code>{certNumber}</code>
                    </Typography>
                    <Button variant="contained" onClick={() => navigate('/')}>Go Home</Button>
                </Container>
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', pb: 8 }}>
            <Header />
            <Container maxWidth="sm" sx={{ pt: { xs: 4, md: 8 } }}>
                {/* Verified badge */}
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <VerifiedIcon sx={{ fontSize: 48, color: colors.main, mb: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: colors.main }}>
                        Verified Certificate
                    </Typography>
                </Box>

                <Card sx={{ borderRadius: 3, overflow: 'hidden', border: `2px solid ${colors.main}` }}>
                    {/* Certificate header */}
                    <Box sx={{
                        background: colors.gradient, color: 'white',
                        py: 3, px: 3, textAlign: 'center'
                    }}>
                        <WorkspacePremiumIcon sx={{ fontSize: 48, mb: 1 }} />
                        <Typography variant="h5" sx={{ fontWeight: 700 }}>
                            {data.certification.name}
                        </Typography>
                        <Chip
                            label={`${data.certification.level} Level`}
                            size="small"
                            sx={{ mt: 1, bgcolor: 'rgba(255,255,255,0.25)', color: 'white', fontWeight: 600, textTransform: 'capitalize' }}
                        />
                    </Box>

                    <CardContent sx={{ p: 3 }}>
                        {/* Holder */}
                        <Typography variant="overline" color="text.secondary">Awarded To</Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                            {data.holder_name}
                        </Typography>

                        <Divider sx={{ my: 2 }} />

                        {/* Details */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CalendarTodayIcon fontSize="small" color="action" />
                                <Typography variant="body2">
                                    Issued: {new Date(data.earned_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <SchoolIcon fontSize="small" color="action" />
                                <Typography variant="body2">
                                    Average Score: {data.score_average}%
                                </Typography>
                            </Box>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        {/* Certificate number */}
                        <Box sx={{ bgcolor: '#f8f9fa', borderRadius: 2, p: 2, textAlign: 'center' }}>
                            <Typography variant="caption" color="text.secondary">Certificate ID</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600, fontFamily: 'monospace', letterSpacing: 1 }}>
                                {data.certificate_number}
                            </Typography>
                        </Box>

                        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                            {data.certification.description}
                        </Typography>
                    </CardContent>
                </Card>

                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 3 }}>
                    Issued by TheAIHubX Learning Platform
                </Typography>
            </Container>
        </Box>
    );
};

export default CertificateVerify;

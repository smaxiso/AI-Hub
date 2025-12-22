import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Container, Typography, Button, Card, CardContent,
    List, ListItem, ListItemIcon, ListItemText, Chip,
    Skeleton, Alert, Paper
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import QuizIcon from '@mui/icons-material/Quiz';
import TimerIcon from '@mui/icons-material/Timer';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import { supabase } from '../../supabaseClient';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const ModuleDetail = () => {
    const { moduleId } = useParams();
    const navigate = useNavigate();
    const [module, setModule] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
        fetchModule();
        checkCompletion();
    }, [moduleId]);

    const fetchModule = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/learning/modules/${moduleId}`);
            if (!res.ok) throw new Error('Module not found');
            const data = await res.json();
            setModule(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const checkCompletion = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const res = await fetch(`${API_URL}/learning/progress`, {
                headers: { 'Authorization': `Bearer ${session.access_token}` }
            });
            if (res.ok) {
                const progress = await res.json();
                setIsCompleted(progress.completed_modules?.includes(moduleId));
            }
        } catch (err) {
            console.error('Error checking completion:', err);
        }
    };

    const handleStartQuiz = () => {
        navigate(`/learning/quiz/${moduleId}`);
    };

    const handleSelfReport = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch(`${API_URL}/learning/complete/${moduleId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({
                    completion_type: 'self_reported',
                    time_spent_minutes: module.estimated_duration_minutes
                })
            });

            if (res.ok) {
                setIsCompleted(true);
                alert('Module marked as complete! +25 points');
            }
        } catch (err) {
            console.error('Error completing module:', err);
        }
    };

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Skeleton variant="text" width="60%" height={60} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" height={200} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" height={300} />
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Alert severity="error">{error}</Alert>
                <Button onClick={() => navigate('/learning')} sx={{ mt: 2 }}>
                    Back to Learning Hub
                </Button>
            </Container>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', pb: 8 }}>
            {/* Header */}
            <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 3 }}>
                <Container maxWidth="md">
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/learning')}
                        sx={{ color: 'white', mb: 2 }}
                    >
                        Back to Learning
                    </Button>
                    <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', md: '2rem' }, fontWeight: 700, mb: 1 }}>
                        {module?.title}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip
                            label={module?.level}
                            size="small"
                            sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                        />
                        <Chip
                            icon={<TimerIcon />}
                            label={`${module?.estimated_duration_minutes} min`}
                            size="small"
                            sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                        />
                        {isCompleted && (
                            <Chip
                                icon={<CheckCircleOutlineIcon />}
                                label="Completed"
                                size="small"
                                color="success"
                            />
                        )}
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="md" sx={{ mt: { xs: 2, md: 4 } }}>
                {/* Description */}
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <EmojiObjectsIcon color="primary" />
                            About This Module
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            {module?.description}
                        </Typography>
                    </CardContent>
                </Card>

                {/* Learning Objectives */}
                {module?.learning_objectives && module.learning_objectives.length > 0 && (
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Learning Objectives
                            </Typography>
                            <List>
                                {module.learning_objectives.map((objective, idx) => (
                                    <ListItem key={idx} dense>
                                        <ListItemIcon>
                                            <CheckCircleOutlineIcon color="primary" />
                                        </ListItemIcon>
                                        <ListItemText primary={objective} />
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                )}

                {/* Action Buttons */}
                {!isCompleted && (
                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Complete This Module
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Take the quiz (90% to pass) or mark as self-completed
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                            <Button
                                variant="contained"
                                size="large"
                                fullWidth
                                startIcon={<QuizIcon />}
                                onClick={handleStartQuiz}
                            >
                                Take Quiz (50 pts)
                            </Button>
                            <Button
                                variant="outlined"
                                size="large"
                                fullWidth
                                onClick={handleSelfReport}
                            >
                                Mark Complete (25 pts)
                            </Button>
                        </Box>
                    </Paper>
                )}

                {isCompleted && (
                    <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#e8f5e9' }}>
                        <CheckCircleOutlineIcon color="success" sx={{ fontSize: 64, mb: 2 }} />
                        <Typography variant="h6" color="success.main" sx={{ mb: 1 }}>
                            Module Completed!
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Great job! You can retake the quiz anytime to improve your score.
                        </Typography>
                        <Button
                            variant="outlined"
                            color="success"
                            onClick={handleStartQuiz}
                        >
                            Retake Quiz
                        </Button>
                    </Paper>
                )}
            </Container>
        </Box>
    );
};

export default ModuleDetail;

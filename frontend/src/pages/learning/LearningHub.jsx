import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Box, Container, Typography, Grid, Card, CardContent, Button,
    LinearProgress, Chip, Tab, Tabs, Skeleton, Alert
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockIcon from '@mui/icons-material/Lock';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabaseClient';
import Header from '../../components/Header';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const LEVELS = [
    { id: 'beginner', label: 'Beginner', color: '#4CAF50' },
    { id: 'intermediate', label: 'Intermediate', color: '#2196F3' },
    { id: 'advanced', label: 'Advanced', color: '#FF9800' },
    { id: 'expert', label: 'Expert', color: '#9C27B0' }
];

const LearningHub = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [progressLoading, setProgressLoading] = useState(true);
    const [progress, setProgress] = useState(null);
    const [modules, setModules] = useState([]);
    const [selectedLevel, setSelectedLevel] = useState('beginner');
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch modules for all users (logged in or not)
        fetchModules();
    }, [selectedLevel]);

    useEffect(() => {
        // Only fetch progress for logged-in users
        if (user?.id) {
            fetchProgress();
        } else {
            setProgressLoading(false);
        }
    }, [user?.id]);

    // Refetch progress when navigating back from a module page
    useEffect(() => {
        // Check if we're coming from a module detail page
        const isFromModulePage = location.key && sessionStorage.getItem('lastVisitedModule');

        if (isFromModulePage && user?.id) {
            // Refetch only progress to update completion status
            fetchProgress();
            sessionStorage.removeItem('lastVisitedModule'); // Clear flag
        }
    }, [location.key]);

    useEffect(() => {
        if (progress?.current_level) {
            setSelectedLevel(progress.current_level);
        }
    }, [progress]);

    const fetchProgress = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch(`${API_URL}/learning/progress`, {
                headers: { 'Authorization': `Bearer ${session?.access_token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setProgress(data);
            } else {
                console.error('Failed to fetch progress');
                setProgress(null);
            }
        } catch (error) {
            console.error('Error fetching progress:', error);
            setProgress(null);
        } finally {
            setProgressLoading(false);
        }
    };

    const fetchModules = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/learning/modules?level=${selectedLevel}`);
            if (res.ok) {
                const data = await res.json();
                setModules(Array.isArray(data) ? data : []);
            } else {
                console.error('Failed to fetch modules');
                setModules([]);
            }
        } catch (err) {
            console.error('Error fetching modules:', err);
            setError('Failed to load modules');
            setModules([]);
        } finally {
            setLoading(false);
        }
    };

    const calculateLevelProgress = (level) => {
        if (!progress) return 0;
        const levelModules = modules.filter(m => m.level === level);
        if (levelModules.length === 0) return 0;
        const completedCount = levelModules.filter(m =>
            progress.completed_modules?.includes(m.id)
        ).length;
        return (completedCount / levelModules.length) * 100;
    };

    const isModuleUnlocked = (module) => {
        if (!progress) return module.order_index === 1;

        // Strict Linear Locking: Unlock only if the IMMEDIATELY preceding module is complete
        if (module.order_index === 1) return true;

        // Find the previous module in the same level
        // (Assuming modules are sorted by order_index, which the backend ensures)
        const previousModule = modules.find(m => m.order_index === module.order_index - 1);

        if (!previousModule) return false; // Should not happen if data is correct

        return progress.completed_modules?.includes(previousModule.id);
    };

    const handleModuleClick = (module) => {
        if (isModuleUnlocked(module)) {
            navigate(`/learning/module/${module.id}`);
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', pb: 8 }}>
            <Header />
            {/* Header */}
            <Box sx={{
                bgcolor: 'primary.main',
                color: 'white',
                py: { xs: 3, md: 4 },
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}>
                <Container maxWidth="xl">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <SchoolIcon sx={{ fontSize: { xs: 32, md: 40 } }} />
                        <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', md: '2rem' }, fontWeight: 700 }}>
                            AI Learning Path
                        </Typography>
                    </Box>

                    {progress && (
                        <Box>
                            <Typography variant="body1" sx={{ mb: 1, opacity: 0.9 }}>
                                Level: {progress.current_level.charAt(0).toUpperCase() + progress.current_level.slice(1)} •
                                Points: {progress.total_points} ⭐
                            </Typography>
                            <LinearProgress
                                variant="determinate"
                                value={calculateLevelProgress(progress.current_level)}
                                sx={{
                                    height: 8,
                                    borderRadius: 4,
                                    bgcolor: 'rgba(255,255,255,0.2)',
                                    '& .MuiLinearProgress-bar': { bgcolor: 'white' }
                                }}
                            />
                            <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                                {Math.round(calculateLevelProgress(progress.current_level))}% Complete
                            </Typography>
                        </Box>
                    )}
                </Container>
            </Box>

            <Container maxWidth="xl" sx={{ mt: { xs: 2, md: 4 } }}>
                {/* Level Tabs */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                    <Tabs
                        value={selectedLevel}
                        onChange={(e, val) => setSelectedLevel(val)}
                        variant="scrollable"
                        scrollButtons="auto"
                        allowScrollButtonsMobile
                    >
                        {LEVELS.map(level => (
                            <Tab
                                key={level.id}
                                value={level.id}
                                label={level.label}
                                icon={
                                    progress?.current_level === level.id ?
                                        <TrendingUpIcon fontSize="small" /> : null
                                }
                                iconPosition="start"
                            />
                        ))}
                    </Tabs>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
                )}

                {/* Modules Grid */}
                {loading || progressLoading ? (
                    <Grid container spacing={2}>
                        {[1, 2, 3, 4].map(i => (
                            <Grid item xs={12} sm={6} md={4} key={i}>
                                <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 2 }} />
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Grid container spacing={2}>
                        {modules.map(module => {
                            const unlocked = isModuleUnlocked(module);
                            const completed = progress?.completed_modules?.includes(module.id);

                            // Find completion details for score
                            const completionRecord = progress?.completions?.find(c => c.module_id === module.id);
                            const score = completionRecord?.quiz_score;

                            return (
                                <Grid item xs={12} sm={6} md={4} key={module.id}>
                                    <Card
                                        sx={{
                                            height: '100%',
                                            cursor: unlocked ? 'pointer' : 'not-allowed',
                                            opacity: unlocked ? 1 : 0.6,
                                            transition: 'all 0.3s',
                                            border: completed ? '2px solid #4CAF50' : 'none',
                                            '&:hover': unlocked ? {
                                                transform: 'translateY(-4px)',
                                                boxShadow: 6
                                            } : {}
                                        }}
                                        onClick={() => handleModuleClick(module)}
                                    >
                                        <CardContent>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                                <Chip
                                                    label={`Module ${module.order_index}`}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: LEVELS.find(l => l.id === module.level)?.color,
                                                        color: 'white'
                                                    }}
                                                />
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    {completed && score !== undefined && (
                                                        <Chip
                                                            label={`Score: ${score}%`}
                                                            size="small"
                                                            color={score >= 90 ? "success" : "warning"}
                                                            variant="outlined"
                                                            sx={{ fontWeight: 'bold' }}
                                                        />
                                                    )}
                                                    {completed ? (
                                                        <CheckCircleIcon color="success" />
                                                    ) : !unlocked ? (
                                                        <LockIcon color="disabled" />
                                                    ) : null}
                                                </Box>
                                            </Box>

                                            <Typography variant="h6" sx={{ mb: 1, fontSize: { xs: '1rem', md: '1.25rem' } }}>
                                                {module.title}
                                            </Typography>

                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                {module.description}
                                            </Typography>

                                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                                                <Chip
                                                    label={`${module.estimated_duration_minutes} min`}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                                {module.learning_objectives?.length > 0 && (
                                                    <Chip
                                                        label={`${module.learning_objectives.length} objectives`}
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                )}
                                            </Box>

                                            {unlocked && !completed && (
                                                <Button
                                                    variant="contained"
                                                    fullWidth
                                                    startIcon={<PlayArrowIcon />}
                                                    sx={{ mt: 'auto' }}
                                                >
                                                    Start Learning
                                                </Button>
                                            )}

                                            {completed && (
                                                <Button
                                                    variant="outlined"
                                                    fullWidth
                                                    startIcon={<EmojiEventsIcon />}
                                                    sx={{ mt: 'auto' }}
                                                >
                                                    Review Module
                                                </Button>
                                            )}

                                            {!unlocked && (
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                    sx={{ display: 'block', textAlign: 'center', mt: 2 }}
                                                >
                                                    Complete previous modules to unlock
                                                </Typography>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>
                )}

                {!loading && modules.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <SchoolIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">
                            No modules available for this level yet
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Check back soon for new content!
                        </Typography>
                    </Box>
                )}
            </Container>
        </Box>
    );
};

export default LearningHub;

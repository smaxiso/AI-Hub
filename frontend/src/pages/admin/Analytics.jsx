import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Grid, Card, CardContent, Skeleton, Alert,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Chip, LinearProgress, Divider
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import BuildIcon from '@mui/icons-material/Build';
import SchoolIcon from '@mui/icons-material/School';
import QuizIcon from '@mui/icons-material/Quiz';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import StarIcon from '@mui/icons-material/Star';
import { supabase } from '../../supabaseClient';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const LEVEL_COLORS = {
    beginner: '#4CAF50', intermediate: '#2196F3',
    advanced: '#FF9800', expert: '#9C27B0'
};

const StatCard = ({ icon, label, value, color = 'primary.main', sub }) => (
    <Card sx={{ height: '100%' }}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ bgcolor: `${color}15`, borderRadius: 2, p: 1.5, display: 'flex' }}>
                {React.cloneElement(icon, { sx: { fontSize: 32, color } })}
            </Box>
            <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1.2 }}>{value}</Typography>
                <Typography variant="body2" color="text.secondary">{label}</Typography>
                {sub && <Typography variant="caption" color="text.secondary">{sub}</Typography>}
            </Box>
        </CardContent>
    </Card>
);

const BarChart = ({ data, label, color = '#2196F3' }) => {
    if (!data || Object.keys(data).length === 0) return <Typography variant="body2" color="text.secondary">No data yet</Typography>;
    const max = Math.max(...Object.values(data), 1);
    const sorted = Object.entries(data).sort((a, b) => b[1] - a[1]);
    return (
        <Box>
            <Typography variant="subtitle2" sx={{ mb: 1.5 }}>{label}</Typography>
            {sorted.map(([key, val]) => (
                <Box key={key} sx={{ mb: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.3 }}>
                        <Typography variant="caption" sx={{ textTransform: 'capitalize' }}>{key}</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>{val}</Typography>
                    </Box>
                    <LinearProgress
                        variant="determinate"
                        value={(val / max) * 100}
                        sx={{ height: 8, borderRadius: 4, bgcolor: '#f0f0f0',
                            '& .MuiLinearProgress-bar': { bgcolor: LEVEL_COLORS[key] || color, borderRadius: 4 } }}
                    />
                </Box>
            ))}
        </Box>
    );
};

const MiniTrend = ({ data, label }) => {
    if (!data || Object.keys(data).length === 0) return <Typography variant="body2" color="text.secondary">No recent activity</Typography>;
    const sorted = Object.entries(data).sort((a, b) => a[0].localeCompare(b[0]));
    const max = Math.max(...sorted.map(([, v]) => v), 1);
    const total = sorted.reduce((s, [, v]) => s + v, 0);
    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle2">{label}</Typography>
                <Chip label={`${total} total`} size="small" variant="outlined" />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: 60 }}>
                {sorted.map(([day, val]) => (
                    <Box key={day} sx={{
                        flex: 1, bgcolor: 'primary.main', borderRadius: '2px 2px 0 0',
                        height: `${(val / max) * 100}%`, minHeight: 2, opacity: 0.7,
                        '&:hover': { opacity: 1 }, transition: 'opacity 0.2s'
                    }} title={`${day}: ${val}`} />
                ))}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                <Typography variant="caption" color="text.secondary">{sorted[0]?.[0]?.slice(5)}</Typography>
                <Typography variant="caption" color="text.secondary">{sorted[sorted.length - 1]?.[0]?.slice(5)}</Typography>
            </Box>
        </Box>
    );
};

const Analytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                const res = await fetch(`${API_URL}/admin/analytics`, {
                    headers: { 'Authorization': `Bearer ${session?.access_token}` }
                });
                if (!res.ok) throw new Error('Failed to fetch analytics');
                setData(await res.json());
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) return (
        <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
                {[...Array(8)].map((_, i) => (
                    <Grid item xs={6} md={3} key={i}><Skeleton variant="rounded" height={100} /></Grid>
                ))}
            </Grid>
        </Box>
    );

    if (error) return <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>;
    if (!data) return null;

    const { overview, users_by_role, tools_by_category, completions_by_level, popular_modules,
        quiz_stats, level_distribution, streak_stats, leaderboard, signup_trend, completion_trend } = data;

    return (
        <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Platform Analytics</Typography>

            {/* Overview Stats */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={6} md={3}>
                    <StatCard icon={<BuildIcon />} label="Tools" value={overview.total_tools} color="#2196F3" />
                </Grid>
                <Grid item xs={6} md={3}>
                    <StatCard icon={<PeopleIcon />} label="Users" value={overview.total_users} color="#4CAF50" />
                </Grid>
                <Grid item xs={6} md={3}>
                    <StatCard icon={<SchoolIcon />} label="Modules" value={overview.total_modules} color="#FF9800" />
                </Grid>
                <Grid item xs={6} md={3}>
                    <StatCard icon={<EmojiEventsIcon />} label="Completions" value={overview.total_completions} color="#9C27B0" />
                </Grid>
                <Grid item xs={6} md={3}>
                    <StatCard icon={<QuizIcon />} label="Quiz Attempts" value={overview.total_quiz_attempts} color="#F44336" />
                </Grid>
                <Grid item xs={6} md={3}>
                    <StatCard icon={<WorkspacePremiumIcon />} label="Certifications" value={overview.total_certifications_earned} color="#E91E63" />
                </Grid>
                <Grid item xs={6} md={3}>
                    <StatCard icon={<StarIcon />} label="Badges Earned" value={overview.total_badges_earned} color="#FF5722" />
                </Grid>
                <Grid item xs={6} md={3}>
                    <StatCard icon={<LightbulbIcon />} label="Suggestions" value={overview.total_suggestions} color="#607D8B" />
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                {/* Tools by Category */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ p: 2.5, height: '100%' }}>
                        <BarChart data={tools_by_category} label="Tools by Category" color="#2196F3" />
                    </Card>
                </Grid>

                {/* Users by Role */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ p: 2.5, height: '100%' }}>
                        <BarChart data={users_by_role} label="Users by Role" color="#4CAF50" />
                    </Card>
                </Grid>

                {/* Completions by Level */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ p: 2.5, height: '100%' }}>
                        <BarChart data={completions_by_level} label="Completions by Level" />
                    </Card>
                </Grid>

                {/* Learner Level Distribution */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ p: 2.5, height: '100%' }}>
                        <BarChart data={level_distribution} label="Learner Level Distribution" />
                    </Card>
                </Grid>

                {/* Quiz Stats */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ p: 2.5 }}>
                        <Typography variant="subtitle2" sx={{ mb: 2 }}>Quiz Performance</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main' }}>{quiz_stats.pass_rate}%</Typography>
                                <Typography variant="body2" color="text.secondary">Pass Rate</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="h3" sx={{ fontWeight: 700, color: 'secondary.main' }}>{quiz_stats.avg_score}%</Typography>
                                <Typography variant="body2" color="text.secondary">Avg Score</Typography>
                            </Grid>
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-around' }}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>{quiz_stats.total_attempts}</Typography>
                                <Typography variant="caption" color="text.secondary">Attempts</Typography>
                            </Box>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, color: '#4CAF50' }}>{quiz_stats.passed}</Typography>
                                <Typography variant="caption" color="text.secondary">Passed</Typography>
                            </Box>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, color: '#F44336' }}>{quiz_stats.failed}</Typography>
                                <Typography variant="caption" color="text.secondary">Failed</Typography>
                            </Box>
                        </Box>
                    </Card>
                </Grid>

                {/* Streak Stats */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ p: 2.5 }}>
                        <Typography variant="subtitle2" sx={{ mb: 2 }}>
                            <WhatshotIcon sx={{ fontSize: 18, mr: 0.5, verticalAlign: 'text-bottom', color: '#FF9800' }} />
                            Streak Stats
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={4} sx={{ textAlign: 'center' }}>
                                <Typography variant="h4" sx={{ fontWeight: 700, color: '#FF9800' }}>{streak_stats.active_streaks}</Typography>
                                <Typography variant="caption" color="text.secondary">Active</Typography>
                            </Grid>
                            <Grid item xs={4} sx={{ textAlign: 'center' }}>
                                <Typography variant="h4" sx={{ fontWeight: 700, color: '#F44336' }}>{streak_stats.max_streak}</Typography>
                                <Typography variant="caption" color="text.secondary">Max Streak</Typography>
                            </Grid>
                            <Grid item xs={4} sx={{ textAlign: 'center' }}>
                                <Typography variant="h4" sx={{ fontWeight: 700, color: '#2196F3' }}>{streak_stats.avg_streak}</Typography>
                                <Typography variant="caption" color="text.secondary">Avg Streak</Typography>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>

                {/* Trends */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ p: 2.5 }}>
                        <MiniTrend data={signup_trend} label="Signups (Last 30 Days)" />
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card sx={{ p: 2.5 }}>
                        <MiniTrend data={completion_trend} label="Completions (Last 30 Days)" />
                    </Card>
                </Grid>

                {/* Popular Modules */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ p: 2.5 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
                            <TrendingUpIcon sx={{ fontSize: 18, mr: 0.5, verticalAlign: 'text-bottom' }} />
                            Popular Modules
                        </Typography>
                        {popular_modules.length === 0 ? (
                            <Typography variant="body2" color="text.secondary">No completions yet</Typography>
                        ) : (
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Module</TableCell>
                                            <TableCell>Level</TableCell>
                                            <TableCell align="right">Completions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {popular_modules.map((m) => (
                                            <TableRow key={m.id}>
                                                <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {m.title}
                                                </TableCell>
                                                <TableCell>
                                                    <Chip label={m.level} size="small"
                                                        sx={{ bgcolor: `${LEVEL_COLORS[m.level]}20`, color: LEVEL_COLORS[m.level], fontWeight: 600, textTransform: 'capitalize' }} />
                                                </TableCell>
                                                <TableCell align="right">{m.count}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </Card>
                </Grid>

                {/* Leaderboard */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ p: 2.5 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
                            <EmojiEventsIcon sx={{ fontSize: 18, mr: 0.5, verticalAlign: 'text-bottom', color: '#FFD700' }} />
                            Top Learners
                        </Typography>
                        {leaderboard.length === 0 ? (
                            <Typography variant="body2" color="text.secondary">No learner data yet</Typography>
                        ) : (
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>#</TableCell>
                                            <TableCell>User</TableCell>
                                            <TableCell>Level</TableCell>
                                            <TableCell align="right">Points</TableCell>
                                            <TableCell align="right">Modules</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {leaderboard.map((l, i) => (
                                            <TableRow key={l.user_id}>
                                                <TableCell>{i + 1}</TableCell>
                                                <TableCell sx={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {l.user_id.slice(0, 8)}...
                                                </TableCell>
                                                <TableCell>
                                                    <Chip label={l.level || 'N/A'} size="small"
                                                        sx={{ bgcolor: `${LEVEL_COLORS[l.level] || '#999'}20`, color: LEVEL_COLORS[l.level] || '#999', fontWeight: 600, textTransform: 'capitalize' }} />
                                                </TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 600 }}>{l.total_points}</TableCell>
                                                <TableCell align="right">{l.modules_completed}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Analytics;

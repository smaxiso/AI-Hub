import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Box, Container, Typography, Chip, Button, Skeleton, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LaunchIcon from '@mui/icons-material/Launch';
import { useTheme } from '../context/ThemeContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export default function ToolDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { theme } = useTheme();
    const [tool, setTool] = useState(null);
    const [loading, setLoading] = useState(true);
    const [relatedTools, setRelatedTools] = useState([]);

    useEffect(() => {
        const fetchTool = async () => {
            try {
                // Fetch all tools and find by ID (no single-tool endpoint exists)
                const res = await fetch(`${API_URL}/tools?pageSize=1000`);
                const json = await res.json();
                const data = json.data || json;
                const found = data.find(t => t.id === id);
                setTool(found || null);

                // Fetch related tools
                if (found) {
                    try {
                        const relRes = await fetch(`${API_URL}/tools/${id}/related`);
                        if (relRes.ok) {
                            const relData = await relRes.json();
                            setRelatedTools(relData);
                        }
                    } catch (e) { /* non-critical */ }
                }
            } catch (err) {
                console.error('Failed to fetch tool:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchTool();
    }, [id]);

    // Update page title for SEO
    useEffect(() => {
        if (tool) {
            document.title = `${tool.name} - AI Tool | TheAIHubX`;
            // Update meta description
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) metaDesc.setAttribute('content', tool.description || `${tool.name} - ${tool.category} AI tool`);
        }
        return () => { document.title = 'TheAIHubX - Discover, Compare, and Master AI Tools'; };
    }, [tool]);

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 3 }} />
                <Skeleton width="60%" height={40} sx={{ mt: 2 }} />
                <Skeleton width="80%" height={24} sx={{ mt: 1 }} />
            </Container>
        );
    }

    if (!tool) {
        return (
            <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="h5" gutterBottom>Tool not found</Typography>
                <Button component={Link} to="/" variant="contained">Back to Tools</Button>
            </Container>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', py: 4, background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
            : 'linear-gradient(135deg, #E8F4F8 0%, #D4C5F9 50%, #C8F4E0 100%)' }}>
            <Container maxWidth="md">
                {/* Back button */}
                <IconButton onClick={() => navigate(-1)} sx={{ mb: 2 }} aria-label="Go back">
                    <ArrowBackIcon />
                </IconButton>

                {/* Tool card */}
                <Box sx={{
                    p: 4,
                    borderRadius: 4,
                    background: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.7)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid',
                    borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.5)',
                }}>
                    {/* Header */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                        {tool.icon && (
                            <img
                                src={tool.icon}
                                alt={`${tool.name} icon`}
                                width={56}
                                height={56}
                                style={{ borderRadius: 12, objectFit: 'cover' }}
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                        )}
                        <Box>
                            <Typography variant="h4" fontWeight={700}>{tool.name}</Typography>
                            <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                                <Chip label={tool.category} size="small" color="primary" />
                                <Chip label={tool.pricing} size="small" variant="outlined" />
                                {tool.isNew && <Chip label="New" size="small" color="success" />}
                            </Box>
                        </Box>
                    </Box>

                    {/* Description */}
                    {tool.description && (
                        <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7 }}>
                            {tool.description}
                        </Typography>
                    )}

                    {/* Tags */}
                    {tool.tags && tool.tags.length > 0 && (
                        <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {tool.tags.map(tag => (
                                <Chip key={tag} label={tag} size="small" variant="outlined" />
                            ))}
                        </Box>
                    )}

                    {/* Use cases */}
                    {tool.use_cases && tool.use_cases.length > 0 && (
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle2" gutterBottom>Use Cases</Typography>
                            {tool.use_cases.map((uc, i) => (
                                <Typography key={i} variant="body2" sx={{ ml: 1 }}>• {uc}</Typography>
                            ))}
                        </Box>
                    )}

                    {/* CTA */}
                    <Button
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="contained"
                        size="large"
                        endIcon={<LaunchIcon />}
                        sx={{ borderRadius: 3 }}
                    >
                        Visit {tool.name}
                    </Button>
                </Box>

                {/* Related tools */}
                {relatedTools.length > 0 && (
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h6" gutterBottom>Similar Tools</Typography>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            {relatedTools.map(rt => (
                                <Chip
                                    key={rt.id}
                                    label={rt.name}
                                    component={Link}
                                    to={`/tool/${rt.id}`}
                                    clickable
                                    variant="outlined"
                                />
                            ))}
                        </Box>
                    </Box>
                )}
            </Container>
        </Box>
    );
}

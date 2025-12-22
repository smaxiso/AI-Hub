import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import {
    Box, Container, Typography, Button, Paper, Chip, LinearProgress,
    Card, CardContent, TextField, Alert, IconButton, Fade, Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import SendIcon from '@mui/icons-material/Send';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { supabase } from '../../supabaseClient';
import Header from '../../components/Header';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// --- Custom Components (Memoized/Defined Outside to prevent re-creation) ---

const KeyTakeaway = ({ children }) => (
    <Paper
        elevation={0}
        sx={{
            p: 3,
            my: 4,
            bgcolor: 'rgba(33, 150, 243, 0.08)',
            borderLeft: '4px solid #2196f3',
            borderRadius: 2
        }}
    >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, color: '#1976d2' }}>
            <LightbulbIcon sx={{ mr: 1 }} />
            <Typography variant="subtitle1" fontWeight="bold">Key Takeaway</Typography>
        </Box>
        <Typography variant="body1" color="text.primary" component="div">
            {children}
        </Typography>
    </Paper>
);

const FlashCard = ({ value }) => {
    const [flipped, setFlipped] = useState(false);
    const parts = value.split('---').map(s => s.trim());
    const front = parts[0] || "Front";
    const back = parts[1] || "Back";

    return (
        <Box sx={{ my: 4, perspective: '1000px', cursor: 'pointer', height: 280 }} onClick={() => setFlipped(!flipped)}>
            <Box sx={{
                position: 'relative',
                width: '100%',
                height: '100%',
                textAlign: 'center',
                transition: 'transform 0.6s',
                transformStyle: 'preserve-3d',
                transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}>
                {/* Front */}
                <Paper sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backfaceVisibility: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 3,
                    bgcolor: 'primary.main',
                    color: 'white',
                    borderRadius: 4,
                    overflowY: 'auto'
                }}>
                    <TipsAndUpdatesIcon sx={{ fontSize: 40, mb: 2, opacity: 0.8, flexShrink: 0 }} />
                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{
                            wordBreak: 'break-word',
                            whiteSpace: 'pre-wrap',
                            maxWidth: '100%',
                            lineHeight: 1.4
                        }}
                    >
                        {front}
                    </Typography>
                    <Typography variant="caption" sx={{ mt: 2, opacity: 0.6, flexShrink: 0 }}>(Click to flip)</Typography>
                </Paper>

                {/* Back */}
                <Paper sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 3,
                    bgcolor: '#4CAF50',
                    color: 'white',
                    borderRadius: 4,
                    overflowY: 'auto'
                }}>
                    <Typography
                        variant="body1"
                        sx={{
                            wordBreak: 'break-word',
                            whiteSpace: 'pre-wrap',
                            maxWidth: '100%',
                            lineHeight: 1.5
                        }}
                    >
                        {back}
                    </Typography>
                    <Button
                        size="small"
                        sx={{ mt: 2, color: 'white', borderColor: 'white', minWidth: 'fit-content', flexShrink: 0 }}
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                    >
                        Flip Back
                    </Button>
                </Paper>
            </Box>
        </Box>
    );
};

const InteractivePrompt = ({ value }) => {
    const [input, setInput] = useState('');
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSend = (e) => {
        e.stopPropagation(); // Prevent event bubbling
        if (!input.trim()) return;
        setLoading(true);
        setTimeout(() => {
            setResponse(`AI Output for: "${input}"\n\nHere is a simulated response demonstrating how the AI would interpret your prompt.`);
            setLoading(false);
        }, 1500);
    };

    return (
        <Paper elevation={3} sx={{ my: 4, p: 3, borderRadius: 3, border: '1px solid #e0e0e0', maxWidth: '100%', overflow: 'hidden' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AutoAwesomeIcon sx={{ color: 'secondary.main', mr: 1 }} />
                <Typography variant="h6">Try it yourself!</Typography>
            </Box>
            <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                    mb: 2,
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-wrap'
                }}
            >
                {value || "Enter a prompt below to see how an AI might respond."}
            </Typography>

            <TextField
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                placeholder="Type your prompt here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                sx={{ mb: 2, bgcolor: '#f9f9f9' }}
                onClick={(e) => e.stopPropagation()}
            />

            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                <Button
                    variant="contained"
                    color="secondary"
                    endIcon={<SendIcon />}
                    onClick={handleSend}
                    disabled={!input || loading}
                    sx={{ minWidth: 'fit-content' }}
                >
                    {loading ? 'Generating...' : 'Run Prompt'}
                </Button>
            </Box>

            {response && (
                <Fade in={true}>
                    <Box sx={{ mt: 3, p: 2, bgcolor: '#f0f4f8', borderRadius: 2, borderLeft: '4px solid #9c27b0', overflowX: 'auto' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>AI Response</Typography>
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                            {response}
                        </Typography>
                    </Box>
                </Fade>
            )}
        </Paper>
    );
};

// --- Main Component ---

const ModuleDetail = () => {
    const { moduleId } = useParams();
    const navigate = useNavigate();
    const [module, setModule] = useState(null);
    const [completion, setCompletion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [scrollProgress, setScrollProgress] = useState(0);

    // Memoize Markdown components map to prevent re-renders causing state loss
    const renderers = React.useMemo(() => ({
        code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const lang = match ? match[1] : '';
            const content = String(children).replace(/\n$/, '');

            if (!inline && lang === 'flashcard') return <FlashCard value={content} />;
            if (!inline && lang === 'interactive') return <InteractivePrompt value={content} />;

            return !inline ? (
                <Box sx={{ bgcolor: '#282c34', color: '#abb2bf', p: 3, borderRadius: 2, my: 3, overflowX: 'auto', fontFamily: 'monospace', fontSize: '0.9em' }}>
                    <pre><code className={className} {...props}>{children}</code></pre>
                </Box>
            ) : (
                <code className={className} {...props} style={{ backgroundColor: '#f0f0f0', padding: '2px 6px', borderRadius: '4px', fontSize: '0.9em' }}>
                    {children}
                </code>
            );
        },
        blockquote({ node, children }) { return <KeyTakeaway>{children}</KeyTakeaway>; },
        h1: ({ children }) => <Typography variant="h3" fontWeight="bold" sx={{ mt: 6, mb: 3, color: '#1a1a1a', fontSize: { xs: '2rem', md: '3rem' } }}>{children}</Typography>,
        h2: ({ children }) => <Typography variant="h4" fontWeight="bold" sx={{ mt: 5, mb: 2, color: '#2c3e50', fontSize: { xs: '1.75rem', md: '2.125rem' } }}>{children}</Typography>,
        h3: ({ children }) => <Typography variant="h5" fontWeight="bold" sx={{ mt: 4, mb: 2, color: '#34495e', fontSize: { xs: '1.4rem', md: '1.5rem' } }}>{children}</Typography>,
        // Fix: Use component="div" to avoid <p> inside <p> warning
        p: ({ children }) => <Typography variant="body1" component="div" sx={{ mb: 3, fontSize: '1.15rem', lineHeight: 1.8 }}>{children}</Typography>,
        ul: ({ children }) => <ul style={{ paddingLeft: '24px', marginBottom: '24px' }}>{children}</ul>,
        ol: ({ children }) => <ol style={{ paddingLeft: '24px', marginBottom: '24px' }}>{children}</ol>,
        li: ({ children }) => <li style={{ marginBottom: '12px', paddingLeft: '4px' }}><Typography variant="body1" component="span" sx={{ fontSize: '1.1rem' }}>{children}</Typography></li>,
    }), []);

    useEffect(() => {
        fetchModuleData();
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [moduleId]);

    const handleScroll = () => {
        const totalScroll = document.documentElement.scrollTop;
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scroll = `${totalScroll / windowHeight}`;
        setScrollProgress(Number(scroll) * 100);
    };

    const fetchModuleData = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();

            // 1. Fetch Module Details
            const modRes = await fetch(`${API_URL}/learning/modules/${moduleId}`, {
                headers: { 'Authorization': `Bearer ${session?.access_token}` }
            });

            // 2. Fetch User Progress (to check completion)
            const progRes = await fetch(`${API_URL}/learning/progress`, {
                headers: { 'Authorization': `Bearer ${session?.access_token}` }
            });

            if (modRes.ok) {
                const modData = await modRes.json();
                setModule(modData);
            }

            if (progRes.ok) {
                const progData = await progRes.json();
                // Check if this module is in completions
                const isDone = progData.completions?.find(c => c.module_id === moduleId);
                setCompletion(isDone);
            }

        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Container sx={{ py: 10, textAlign: 'center' }}><Typography>Loading content...</Typography></Container>;
    }

    if (!module) return null;

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#ffffff', pb: 10 }}>
            {/* Reading Progress Bar */}
            <LinearProgress
                variant="determinate"
                value={scrollProgress}
                sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1100, height: 4 }}
            />

            <Header />

            {/* Hero Section */}
            <Box sx={{ bgcolor: '#f8f9fa', py: { xs: 4, md: 8 }, borderBottom: '1px solid #e0e0e0' }}>
                <Container maxWidth="md">
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/learning')}
                        sx={{ mb: 3 }}
                    >
                        Back to Hub
                    </Button>
                    <Chip label={`Module ${module.order_index}`} color="primary" sx={{ mb: 2 }} />
                    <Typography
                        variant="h2"
                        fontWeight="800"
                        sx={{
                            mb: 2,
                            color: '#1a1a1a',
                            fontSize: { xs: '2rem', md: '3.5rem' }
                        }}
                    >
                        {module.title}
                    </Typography>
                    <Typography
                        variant="h6"
                        color="text.secondary"
                        sx={{
                            mb: 4,
                            maxWidth: '800px',
                            lineHeight: 1.6,
                            fontSize: { xs: '1.1rem', md: '1.25rem' }
                        }}
                    >
                        {module.description}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <Button
                            variant="contained"
                            size="large"
                            endIcon={<PlayArrowIcon />}
                            onClick={() => {
                                const el = document.getElementById('content-start');
                                el?.scrollIntoView({ behavior: 'smooth' });
                            }}
                        >
                            Start Reading
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            color={completion ? "success" : "primary"}
                            onClick={() => navigate(`/learning/quiz/${moduleId}`)}
                        >
                            {completion ? "Retake Quiz" : "Take Quiz"}
                        </Button>
                    </Box>
                </Container>
            </Box>

            {/* Content Section */}
            <Container maxWidth="md" sx={{ mt: 8 }} id="content-start">
                <Box sx={{ typography: 'body1', fontSize: '1.2rem', lineHeight: 1.8, color: '#333' }}>
                    <ReactMarkdown components={renderers}>
                        {module.content || "*Content coming soon...*"}
                    </ReactMarkdown>
                </Box>

                <Divider sx={{ my: 8 }} />

                {/* Completion Section */}
                <Paper elevation={0} sx={{ p: { xs: 3, md: 6 }, textAlign: 'center', bgcolor: '#f8f9fa', borderRadius: 4 }}>
                    <CheckCircleIcon sx={{ fontSize: 64, color: completion ? '#4CAF50' : '#bdbdbd', mb: 2 }} />
                    <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: '1.75rem', md: '2.125rem' } }}>
                        {completion ? "Module Completed!" : "Ready to Verify?"}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                        {completion
                            ? (completion.quiz_score >= 100
                                ? "You scored a perfect 100%! Great job mastering this module."
                                : `You scored ${completion.quiz_score}%. Want to improve your score?`)
                            : "You've completed the reading material. Test your knowledge to unlock the next module!"
                        }
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        color={completion ? "secondary" : "success"}
                        onClick={() => navigate(`/learning/quiz/${moduleId}`)}
                        sx={{ px: 5, py: 1.5, fontSize: '1.1rem' }}
                    >
                        {completion ? "Retake Quiz" : "Take the Quiz"}
                    </Button>
                </Paper>
            </Container>
        </Box>
    );
};

export default ModuleDetail;

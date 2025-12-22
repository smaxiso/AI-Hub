import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Container, Typography, Button, Card, CardContent,
    Radio, RadioGroup, FormControlLabel, FormControl,
    LinearProgress, Alert, Paper, Chip, List, ListItem, ListItemText
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { supabase } from '../../supabaseClient';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const Quiz = () => {
    const { moduleId } = useParams();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [results, setResults] = useState(null);
    const [selectedOption, setSelectedOption] = useState('');

    useEffect(() => {
        fetchQuiz();
    }, [moduleId]);

    const fetchQuiz = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch(`${API_URL}/learning/quiz/${moduleId}?count=10`, {
                headers: { 'Authorization': `Bearer ${session.access_token}` }
            });
            const data = await res.json();
            setQuestions(data);
        } catch (err) {
            console.error('Error fetching quiz:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        if (selectedOption) {
            setAnswers({
                ...answers,
                [questions[currentQuestion].id]: selectedOption
            });
            setSelectedOption('');

            if (currentQuestion < questions.length - 1) {
                setCurrentQuestion(currentQuestion + 1);
            } else {
                submitQuiz();
            }
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
            setSelectedOption(answers[questions[currentQuestion - 1].id] || '');
        }
    };

    const submitQuiz = async () => {
        try {
            setSubmitting(true);
            const formattedAnswers = Object.entries(answers).map(([questionId, selectedOption]) => ({
                question_id: questionId,
                selected_option: selectedOption
            }));

            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch(`${API_URL}/learning/quiz/${moduleId}/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({ answers: formattedAnswers })
            });

            const data = await res.json();
            setResults(data);
        } catch (err) {
            console.error('Error submitting quiz:', err);
            alert('Error submitting quiz. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const progress = ((currentQuestion + 1) / questions.length) * 100;

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
                <Typography>Loading quiz...</Typography>
            </Container>
        );
    }

    if (results) {
        return (
            <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', py: 4 }}>
                <Container maxWidth="md">
                    <Paper sx={{ p: { xs: 2, md: 4 }, textAlign: 'center' }}>
                        {results.passed ? (
                            <EmojiEventsIcon sx={{ fontSize: 80, color: '#4CAF50', mb: 2 }} />
                        ) : (
                            <CancelIcon sx={{ fontSize: 80, color: '#f44336', mb: 2 }} />
                        )}

                        <Typography variant="h4" sx={{ mb: 1, color: results.passed ? '#4CAF50' : '#f44336' }}>
                            {results.passed ? 'Congratulations!' : 'Keep Trying!'}
                        </Typography>

                        <Typography variant="h2" sx={{ mb: 1, fontWeight: 700 }}>
                            {results.score}%
                        </Typography>

                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                            {results.correct_count} of {results.total_questions} correct
                        </Typography>

                        {results.passed ? (
                            <Alert severity="success" sx={{ mb: 3 }}>
                                <Typography variant="h6">Module Completed! +50 Points</Typography>
                                <Typography variant="body2">
                                    Great job! You've mastered this module.
                                </Typography>
                            </Alert>
                        ) : (
                            <Box>
                                <Alert severity="info" sx={{ mb: 3 }}>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        You need 90% to pass. Review these topics and try again:
                                    </Typography>
                                    <List dense>
                                        {results.failed_topics?.map((topic, idx) => (
                                            <ListItem key={idx}>
                                                <ListItemText primary={`• ${topic}`} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Alert>
                            </Box>
                        )}

                        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                            <Button
                                variant={results.passed ? "outlined" : "contained"}
                                fullWidth
                                onClick={() => navigate(`/learning/module/${moduleId}`)}
                            >
                                Back to Module
                            </Button>
                            {!results.passed && (
                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={() => {
                                        setResults(null);
                                        setCurrentQuestion(0);
                                        setAnswers({});
                                        setSelectedOption('');
                                        fetchQuiz();
                                    }}
                                >
                                    Retake Quiz
                                </Button>
                            )}
                            <Button
                                variant="outlined"
                                fullWidth
                                onClick={() => navigate('/learning')}
                            >
                                Learning Hub
                            </Button>
                        </Box>
                    </Paper>
                </Container>
            </Box>
        );
    }

    const question = questions[currentQuestion];

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', pb: 8 }}>
            {/* Header with Progress */}
            <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 3 }}>
                <Container maxWidth="md">
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate(`/learning/module/${moduleId}`)}
                        sx={{ color: 'white', mb: 2 }}
                    >
                        Exit Quiz
                    </Button>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">
                            Question {currentQuestion + 1} of {questions.length}
                        </Typography>
                        <Chip
                            label={`${Math.round(progress)}%`}
                            sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                        />
                    </Box>
                    <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{
                            height: 8,
                            borderRadius: 4,
                            bgcolor: 'rgba(255,255,255,0.2)',
                            '& .MuiLinearProgress-bar': { bgcolor: 'white' }
                        }}
                    />
                </Container>
            </Box>

            <Container maxWidth="md" sx={{ mt: { xs: 2, md: 4 } }}>
                <Card>
                    <CardContent sx={{ p: { xs: 2, md: 4 } }}>
                        {/* Question */}
                        <Typography variant="h5" sx={{ mb: 3, fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
                            {question.question_text}
                        </Typography>

                        {/* Options */}
                        <FormControl component="fieldset" fullWidth>
                            <RadioGroup
                                value={selectedOption}
                                onChange={(e) => setSelectedOption(e.target.value)}
                            >
                                {question.options.map((option, idx) => (
                                    <Paper
                                        key={idx}
                                        elevation={selectedOption === option.text ? 4 : 1}
                                        sx={{
                                            mb: 2,
                                            cursor: 'pointer',
                                            border: selectedOption === option.text ? '2px solid #1976d2' : 'none',
                                            transition: 'all 0.2s'
                                        }}
                                        onClick={() => setSelectedOption(option.text)}
                                    >
                                        <FormControlLabel
                                            value={option.text}
                                            control={<Radio />}
                                            label={option.text}
                                            sx={{
                                                width: '100%',
                                                m: 0,
                                                p: 2,
                                                '& .MuiFormControlLabel-label': {
                                                    fontSize: { xs: '0.95rem', md: '1rem' }
                                                }
                                            }}
                                        />
                                    </Paper>
                                ))}
                            </RadioGroup>
                        </FormControl>

                        {/* Navigation */}
                        <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                            <Button
                                onClick={handlePrevious}
                                disabled={currentQuestion === 0}
                                fullWidth
                                variant="outlined"
                            >
                                Previous
                            </Button>
                            <Button
                                onClick={handleNext}
                                disabled={!selectedOption}
                                fullWidth
                                variant="contained"
                            >
                                {currentQuestion === questions.length - 1 ? 'Submit' : 'Next'}
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

export default Quiz;

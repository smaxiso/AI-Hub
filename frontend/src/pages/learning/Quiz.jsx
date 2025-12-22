import React, { useState, useEffect, useMemo } from 'react';
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
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { supabase } from '../../supabaseClient';
import Header from '../../components/Header';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const Quiz = () => {
    const { moduleId } = useParams();
    const navigate = useNavigate();

    // Core Data
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    // Quiz State
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [results, setResults] = useState(null);

    // History & Progress Tracking
    // Structure: { [questionId]: { attempts: number, status: 'unanswered'|'correct'|'incorrect_retry'|'incorrect_final', selectedOption: string, isLocked: boolean } }
    const [quizHistory, setQuizHistory] = useState({});

    // Derived State for Current Question
    const currentQuestion = questions[currentQuestionIndex];
    const currentHistory = currentQuestion ? (quizHistory[currentQuestion.id] || {
        attempts: 0,
        status: 'unanswered',
        selectedOption: '',
        isLocked: false
    }) : null;

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

    // Live Score Calculation
    const liveStats = useMemo(() => {
        const totalAnswered = Object.values(quizHistory).filter(h => h.isLocked).length;
        const totalCorrect = Object.values(quizHistory).filter(h => h.status === 'correct').length;
        const percentage = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
        return { totalAnswered, totalCorrect, percentage };
    }, [quizHistory]);

    const handleOptionSelect = (value) => {
        if (currentHistory.isLocked) return;

        setQuizHistory(prev => ({
            ...prev,
            [currentQuestion.id]: {
                ...currentHistory,
                selectedOption: value
            }
        }));
    };

    const handleCheck = () => {
        if (!currentHistory.selectedOption) return;

        const selectedOptObj = currentQuestion.options.find(opt => opt.text === currentHistory.selectedOption);
        const isCorrect = selectedOptObj?.is_correct || false;

        let newStatus = currentHistory.status;
        let newIsLocked = currentHistory.isLocked;
        let newAttempts = currentHistory.attempts + 1;

        if (isCorrect) {
            newStatus = 'correct';
            newIsLocked = true;
        } else {
            // Incorrect Logic
            if (newAttempts >= 2) {
                newStatus = 'incorrect_final'; // 2nd fail -> Locked
                newIsLocked = true;
            } else {
                newStatus = 'incorrect_retry'; // 1st fail -> Retry allowed
                newIsLocked = false;
            }
        }

        setQuizHistory(prev => ({
            ...prev,
            [currentQuestion.id]: {
                ...currentHistory,
                attempts: newAttempts,
                status: newStatus,
                isLocked: newIsLocked
            }
        }));
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            submitQuiz();
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const submitQuiz = async () => {
        try {
            setSubmitting(true);
            // Format answers for backend: Only send final locked answers
            const formattedAnswers = Object.entries(quizHistory).map(([qId, state]) => ({
                question_id: qId,
                selected_option: state.selectedOption
            }));

            // We need to ensure we send answers for ALL questions, even if some weren't "locked" properly (though UI strictly enforces it now)
            // But let's act on the ones we have history for.

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

    const progress = (currentQuestionIndex / questions.length) * 100;

    // -- Sub-Renderers --

    const renderFeedback = () => {
        if (currentHistory.status === 'unanswered') return null;

        if (currentHistory.status === 'correct') {
            return (
                <Alert severity="success" icon={<CheckCircleIcon />} sx={{ mt: 2, mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold">Correct!</Typography>
                    {currentQuestion.explanation && (
                        <Typography variant="body2" sx={{ mt: 1 }}>{currentQuestion.explanation}</Typography>
                    )}
                </Alert>
            );
        }

        if (currentHistory.status === 'incorrect_retry') {
            return (
                <Alert severity="warning" icon={<HelpOutlineIcon />} sx={{ mt: 2, mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold">Not quite right.</Typography>
                    <Typography variant="body2">That's incorrect. You have one more chance to select the correct answer!</Typography>
                </Alert>
            );
        }

        if (currentHistory.status === 'incorrect_final') {
            // Find correct answer to show
            const correctOpt = currentQuestion.options.find(opt => opt.is_correct);
            return (
                <Alert severity="error" icon={<CancelIcon />} sx={{ mt: 2, mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold">Incorrect.</Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        The correct answer was: <strong>{correctOpt?.text}</strong>
                    </Typography>
                    {currentQuestion.explanation && (
                        <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>{currentQuestion.explanation}</Typography>
                    )}
                </Alert>
            );
        }
    };

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
                <Typography>Loading quiz...</Typography>
            </Container>
        );
    }

    if (questions.length === 0 && !results) {
        return (
            <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', py: 4 }}>
                <Header />
                <Container maxWidth="md">
                    <Paper sx={{ p: 4, textAlign: 'center' }}>
                        <Typography variant="h6" color="text.secondary">No quiz questions available for this module yet.</Typography>
                        <Button variant="contained" onClick={() => navigate(`/learning/module/${moduleId}`)} sx={{ mt: 2 }}>Back to Module</Button>
                    </Paper>
                </Container>
            </Box>
        );
    }

    if (results) {
        return (
            <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', py: 4 }}>
                <Header />
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
                            </Alert>
                        ) : (
                            <Box>
                                <Alert severity="info" sx={{ mb: 3 }}>
                                    <Typography variant="body2" sx={{ mb: 1 }}>You need 90% to pass. Review these topics:</Typography>
                                    <List dense>
                                        {results.failed_topics?.map((topic, idx) => (
                                            <ListItem key={idx}><ListItemText primary={`• ${topic}`} /></ListItem>
                                        ))}
                                    </List>
                                </Alert>
                            </Box>
                        )}

                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                            <Button variant="outlined" onClick={() => navigate(`/learning/module/${moduleId}`)}>Back to Module</Button>
                            {!results.passed && (
                                <Button variant="contained" onClick={() => {
                                    setResults(null); setCurrentQuestionIndex(0); setQuizHistory({}); fetchQuiz();
                                }}>Retake Quiz</Button>
                            )}
                        </Box>
                    </Paper>
                </Container>
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', pb: 8 }}>
            <Header />
            {/* Header with Progress & Live Score */}
            <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 3 }}>
                <Container maxWidth="md">
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(`/learning/module/${moduleId}`)} sx={{ color: 'white' }}>
                            Exit
                        </Button>
                        <Chip
                            icon={<EmojiEventsIcon style={{ color: '#FFD700' }} />}
                            label={`Correct: ${liveStats.totalCorrect} | Accuracy: ${liveStats.percentage}%`}
                            sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 'bold' }}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body2">Question {currentQuestionIndex + 1} of {questions.length}</Typography>
                        <Typography variant="body2">{Math.round(progress)}% Complete</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.2)', '& .MuiLinearProgress-bar': { bgcolor: 'white' } }} />
                </Container>
            </Box>

            <Container maxWidth="md" sx={{ mt: { xs: 2, md: 4 } }}>
                <Card>
                    <CardContent sx={{ p: { xs: 2, md: 4 } }}>
                        <Typography variant="h5" sx={{ mb: 3 }}>{currentQuestion.question_text}</Typography>

                        <FormControl component="fieldset" fullWidth>
                            <RadioGroup value={currentHistory.selectedOption} onChange={(e) => handleOptionSelect(e.target.value)}>
                                {currentQuestion.options.map((option, idx) => {
                                    // Visual State Logic
                                    const isSelected = currentHistory.selectedOption === option.text;
                                    let borderColor = isSelected ? '#1976d2' : 'transparent';
                                    let bgColor = 'inherit';

                                    if (currentHistory.status === 'correct' && isSelected) {
                                        borderColor = '#4CAF50';
                                        bgColor = 'rgba(76, 175, 80, 0.08)';
                                    } else if (currentHistory.status === 'incorrect_final') {
                                        if (isSelected) { borderColor = '#f44336'; bgColor = 'rgba(244, 67, 54, 0.08)'; }
                                        if (option.is_correct) { borderColor = '#4CAF50'; bgColor = 'rgba(76, 175, 80, 0.08)'; } // Show correct one
                                    } else if (currentHistory.status === 'incorrect_retry' && isSelected) {
                                        borderColor = '#f44336'; // Warning red
                                    }

                                    return (
                                        <Paper key={idx} elevation={isSelected ? 4 : 1} sx={{
                                            mb: 2, cursor: currentHistory.isLocked ? 'default' : 'pointer',
                                            border: `2px solid ${borderColor}`,
                                            bgcolor: bgColor,
                                            transition: 'all 0.2s',
                                            opacity: (currentHistory.isLocked && !isSelected && !option.is_correct) ? 0.5 : 1
                                        }} onClick={() => handleOptionSelect(option.text)}>
                                            <FormControlLabel
                                                value={option.text} control={<Radio />} label={option.text}
                                                sx={{ width: '100%', m: 0, p: 2 }}
                                            />
                                        </Paper>
                                    );
                                })}
                            </RadioGroup>
                        </FormControl>

                        {renderFeedback()}

                        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                            <Button onClick={handlePrevious} disabled={currentQuestionIndex === 0} fullWidth variant="outlined" startIcon={<ArrowBackIcon />}>
                                Previous
                            </Button>

                            {!currentHistory.isLocked ? (
                                <Button onClick={handleCheck} disabled={!currentHistory.selectedOption} fullWidth variant="contained" size="large">
                                    {currentHistory.status === 'incorrect_retry' ? 'Check Again' : 'Check Answer'}
                                </Button>
                            ) : (
                                <Button onClick={handleNext} fullWidth variant="contained" color={currentQuestionIndex === questions.length - 1 ? "success" : "primary"} size="large">
                                    {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                                </Button>
                            )}
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

export default Quiz;

import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Typography,
    Box,
    Snackbar,
    Alert,
    useTheme
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const FeedbackModal = ({ open, onClose, defaultType = 'feedback' }) => {
    const { session } = useAuth();
    const theme = useTheme();
    const [type, setType] = useState(defaultType);
    const [content, setContent] = useState(''); // Simple text for feedback

    // For Tool Suggestions
    const [toolName, setToolName] = useState('');
    const [toolUrl, setToolUrl] = useState('');

    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

    const handleSubmit = async () => {
        setLoading(true);
        try {
            let submissionContent = {};
            if (type === 'tool') {
                if (!toolName || !toolUrl) {
                    throw new Error('Name and URL are required');
                }
                submissionContent = { name: toolName, url: toolUrl, description: content };
            } else {
                if (!content) throw new Error('Content is required');
                submissionContent = { text: content };
            }

            const res = await fetch(`${API_URL}/community/suggest`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.access_token}`
                },
                body: JSON.stringify({
                    type,
                    content: submissionContent
                })
            });

            if (!res.ok) throw new Error('Failed to submit');

            setToast({ open: true, message: 'Thanks for your contribution!', severity: 'success' });
            setTimeout(() => {
                onClose();
                // Reset form
                setContent('');
                setToolName('');
                setToolUrl('');
            }, 1000);

        } catch (error) {
            setToast({ open: true, message: error.message || 'Submission failed', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        backgroundImage: theme.palette.mode === 'dark'
                            ? 'linear-gradient(145deg, rgba(26, 26, 46, 0.95), rgba(30, 30, 50, 0.98))'
                            : 'linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(240, 245, 250, 0.98))',
                        border: '1px solid',
                        borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                        boxShadow: theme.palette.mode === 'dark'
                            ? '0 20px 40px rgba(0,0,0,0.6)'
                            : '0 20px 40px rgba(0,0,0,0.1)',
                        borderRadius: 3
                    }
                }}
            >
                <DialogTitle>Contribute to AI Hub</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2, p: 1 }}>
                        <FormControl fullWidth variant="outlined" sx={{ bgcolor: 'rgba(255,255,255,0.05)' }}>
                            <InputLabel>Type</InputLabel>
                            <Select
                                value={type}
                                label="Type"
                                onChange={(e) => setType(e.target.value)}
                            >
                                <MenuItem value="feedback">General Feedback</MenuItem>
                                <MenuItem value="tool">Suggest a Tool</MenuItem>
                                <MenuItem value="quiz_question">Suggest Quiz Question</MenuItem>
                            </Select>
                        </FormControl>

                        {type === 'tool' && (
                            <>
                                <TextField
                                    label="Tool Name"
                                    value={toolName}
                                    onChange={(e) => setToolName(e.target.value)}
                                    fullWidth
                                    variant="outlined"
                                    sx={{ bgcolor: 'rgba(255,255,255,0.05)' }}
                                />
                                <TextField
                                    label="Tool URL"
                                    value={toolUrl}
                                    onChange={(e) => setToolUrl(e.target.value)}
                                    fullWidth
                                    variant="outlined"
                                    sx={{ bgcolor: 'rgba(255,255,255,0.05)' }}
                                />
                            </>
                        )}

                        <TextField
                            label={type === 'tool' ? "Description (Optional)" : "Your Feedback/Question"}
                            multiline
                            rows={4}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            fullWidth
                            variant="outlined"
                            sx={{ bgcolor: 'rgba(255,255,255,0.05)' }}
                            placeholder={type === 'quiz_question' ? "Example: What is a transformer? Option A: ... Option B: ..." : ""}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="inherit">Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained" disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={toast.open}
                autoHideDuration={6000}
                onClose={() => setToast({ ...toast, open: false })}
            >
                <Alert severity={toast.severity}>{toast.message}</Alert>
            </Snackbar>
        </>
    );
};

export default FeedbackModal;

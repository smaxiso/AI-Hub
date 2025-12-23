import React from 'react';
import { Box, Container, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import MagicPrompt from '../../components/MagicPrompt';

const MagicPromptTool = () => {
    const navigate = useNavigate();

    return (
        <Box sx={{ minHeight: '100vh', py: 4, bgcolor: '#f5f5f5' }}>
            <Container maxWidth="md">
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/')}
                    sx={{ mb: 3 }}
                >
                    Back to Home
                </Button>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Box sx={{ width: '100%', maxWidth: '800px' }}>
                        {/* Pass empty onClose or handle navigation */}
                        <MagicPrompt onClose={() => navigate('/')} />
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default MagicPromptTool;

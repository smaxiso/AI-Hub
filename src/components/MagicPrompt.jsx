import React, { useRef } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Box, TextField, Button, Typography, Paper, Fade, IconButton, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SmartToyIcon from '@mui/icons-material/SmartToy';

const MagicPrompt = ({ onClose }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  
  // Persistent state for form and prompt
  const [formData, setFormData] = useLocalStorage('magicPromptForm', {
    role: '',
    task: '',
    context: '',
    constraints: ''
  });
  const [generatedPrompt, setGeneratedPrompt] = useLocalStorage('magicPromptGenerated', '');
  const modalRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generate = () => {
    const prompt = `Act as a ${formData.role || 'Expert'}. ${formData.context ? `Context: ${formData.context}` : ''} Your task is to ${formData.task}. ${formData.constraints ? `Constraints: ${formData.constraints}` : ''}`;
    setGeneratedPrompt(prompt);
  };

  // 3. BETTER INPUT STYLING
  const inputStyle = {
    '& .MuiFilledInput-root': {
      backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.4)',
      borderRadius: '12px',
      border: '1px solid',
      borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
      transition: 'all 0.3s ease',
      '&:before, &:after': { display: 'none' }, // Remove ugly bottom lines
      '&:hover': {
        backgroundColor: isDarkMode ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.6)',
        borderColor: 'rgba(107, 182, 255, 0.5)',
      },
      '&.Mui-focused': {
        backgroundColor: isDarkMode ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.8)',
        borderColor: '#6BB6FF',
        boxShadow: '0 0 0 3px rgba(107, 182, 255, 0.2)'
      }
    },
    '& .MuiInputLabel-root': {
      color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
      '&.Mui-focused': { color: '#6BB6FF' }
    },
    '& .MuiFilledInput-input': {
        paddingTop: '12px',
        paddingBottom: '12px'
    }
  };

  return (
    // 2. POLISHED MODAL UI (Glass container)
    <Paper 
      ref={modalRef}
      elevation={24}
      sx={{ 
        p: 4,
        background: isDarkMode 
          ? 'linear-gradient(145deg, rgba(30, 30, 40, 0.9) 0%, rgba(20, 20, 30, 0.95) 100%)'
          : 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(240,245,255,0.95) 100%)',
        backdropFilter: 'blur(40px)',
        border: '1px solid',
        borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.6)',
        borderRadius: '24px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
      }}
    >
      {/* Decorator Circle */}
      <Box sx={{
        position: 'absolute', top: -50, right: -50, width: 150, height: 150, borderRadius: '50%',
        background: 'linear-gradient(135deg, #FFB020 0%, transparent 70%)', opacity: 0.2, filter: 'blur(30px)'
      }}/>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, justifyContent: 'space-between', position: 'relative', zIndex: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ 
            p: 1, borderRadius: '12px', 
            background: 'linear-gradient(135deg, #FFB020 0%, #FF8E53 100%)',
            boxShadow: '0 4px 12px rgba(255, 176, 32, 0.3)',
            display: 'flex'
          }}>
            <AutoAwesomeIcon sx={{ color: 'white' }} />
          </Box>
          <Typography variant="h5" fontWeight="700" sx={{ 
            background: isDarkMode 
              ? 'linear-gradient(90deg, #fff, #ccc)' 
              : 'linear-gradient(90deg, #2D3748, #4A5568)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Magic Prompt
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <TextField 
          label="Role (Who is the AI?)" 
          placeholder="e.g. Senior React Developer, Expert Copywriter"
          name="role" 
          variant="filled"
          value={formData.role}
          onChange={handleChange}
          sx={inputStyle}
          InputProps={{ disableUnderline: true }}
        />
        
        <TextField 
          label="Task (What should it do?)" 
          placeholder="e.g. Write a high-converting landing page headline"
          name="task" 
          variant="filled"
          value={formData.task}
          onChange={handleChange}
          sx={inputStyle}
          InputProps={{ disableUnderline: true }}
        />

        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <TextField 
            label="Context" 
            placeholder="e.g. For a SaaS product..."
            name="context" 
            variant="filled"
            fullWidth
            value={formData.context}
            onChange={handleChange}
            sx={inputStyle}
            InputProps={{ disableUnderline: true }}
            />
            <TextField 
            label="Constraints" 
            placeholder="e.g. Max 20 words"
            name="constraints" 
            variant="filled"
            fullWidth
            value={formData.constraints}
            onChange={handleChange}
            sx={inputStyle}
            InputProps={{ disableUnderline: true }}
            />
        </Box>
        
        <Button 
          variant="contained" 
          onClick={generate}
          startIcon={<SmartToyIcon />}
          sx={{ 
            mt: 1,
            background: 'linear-gradient(135deg, #6BB6FF 0%, #A78BFA 100%)',
            color: 'white',
            fontWeight: 'bold',
            py: 1.5,
            fontSize: '1rem',
            borderRadius: '14px',
            textTransform: 'none',
            boxShadow: '0 8px 20px rgba(107, 182, 255, 0.3)',
            '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 24px rgba(107, 182, 255, 0.4)',
                background: 'linear-gradient(135deg, #5AA5FF 0%, #9678FA 100%)',
            },
            transition: 'all 0.2s ease'
          }}
        >
          Generate Magic Prompt
        </Button>

        {generatedPrompt && (
          <Fade in={true}>
            <Box sx={{ 
              mt: 2, 
              p: 2.5, 
              background: isDarkMode ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.5)',
              border: '1px solid',
              borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', 
              borderRadius: '16px',
              position: 'relative'
            }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', mb: 1, display: 'block', fontWeight: 600, letterSpacing: 1 }}>
                RESULT
              </Typography>
              <Typography variant="body1" sx={{ 
                  fontFamily: 'monospace', 
                  lineHeight: 1.6, 
                  color: isDarkMode ? '#A78BFA' : '#553C9A',
                  fontSize: '0.95rem' 
                }}>
                {generatedPrompt}
              </Typography>
              <IconButton 
                onClick={() => navigator.clipboard.writeText(generatedPrompt)}
                sx={{ 
                    position: 'absolute', top: 10, right: 10, 
                    background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                    '&:hover': { background: '#6BB6FF', color: 'white' }
                }}
                size="small"
              >
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Box>
          </Fade>
        )}
      </Box>
    </Paper>
  );
};

export default MagicPrompt;
import React, { useRef } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Box, TextField, Button, Typography, Paper, Fade, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const MagicPrompt = ({ onClose }) => {
  // Persistent state for form and prompt
  const [formData, setFormData] = useLocalStorage('magicPromptForm', {
    role: '',
    task: '',
    context: '',
    constraints: ''
  });
  const [generatedPrompt, setGeneratedPrompt] = useLocalStorage('magicPromptGenerated', '');
  const modalRef = useRef(null);

  // Handle outside click to close modal
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        if (onClose) onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generate = () => {
    const prompt = `Act as a ${formData.role || 'Expert'}. ${formData.context || ''} Your task is to ${formData.task}. ${formData.constraints ? `Constraints: ${formData.constraints}` : ''}`;
    setGeneratedPrompt(prompt);
  };

  return (
    <Paper 
      ref={modalRef}
      sx={{ 
        p: { xs: 2, sm: 3 }, 
        mb: 4, 
        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: '16px',
        position: 'relative',
        maxWidth: { xs: '100vw', sm: '500px' },
        width: '100%'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AutoAwesomeIcon sx={{ color: '#FFB020' }} />
          <Typography variant="h6" fontWeight="bold">Magic Prompt Generator</Typography>
        </Box>
        <IconButton aria-label="Close" onClick={onClose} sx={{ ml: 1 }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField 
          label="Role (Who is the AI?)" 
          placeholder="e.g. Expert Copywriter, Senior React Developer"
          name="role" 
          variant="filled"
          value={formData.role}
          onChange={handleChange}
        />
        <TextField 
          label="Context (Background Info)" 
          placeholder="e.g. I am writing a sales email for a SaaS product..."
          name="context" 
          multiline
          rows={2}
          variant="filled"
          value={formData.context}
          onChange={handleChange}
        />
        <TextField 
          label="Task (What should it do?)" 
          placeholder="e.g. Write a compelling subject line and body text"
          name="task" 
          variant="filled"
          value={formData.task}
          onChange={handleChange}
        />
        <TextField 
          label="Constraints (Format, Tone, Limits)" 
          placeholder="e.g. Keep it under 100 words, professional tone"
          name="constraints" 
          variant="filled"
          value={formData.constraints}
          onChange={handleChange}
        />
        <Button 
          variant="contained" 
          onClick={generate}
          sx={{ 
            background: 'linear-gradient(45deg, #6BB6FF, #A78BFA)',
            color: 'white',
            fontWeight: 'bold',
            py: 1.5
          }}
        >
          Generate Magic Prompt
        </Button>
        {generatedPrompt && (
          <Fade in={true}>
            <Box sx={{ 
              mt: 2, 
              p: 2, 
              background: 'rgba(0,0,0,0.2)', 
              borderRadius: '8px',
              position: 'relative'
            }}>
              <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                {generatedPrompt}
              </Typography>
              <IconButton 
                onClick={() => navigator.clipboard.writeText(generatedPrompt)}
                sx={{ position: 'absolute', top: 5, right: 5, color: 'white' }}
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
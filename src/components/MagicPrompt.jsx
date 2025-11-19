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
        p: { xs: 0, sm: 0 },
        background: 'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.09) 100%)',
        backdropFilter: 'blur(24px)',
        border: '2.5px solid rgba(255,255,255,0.22)',
        borderRadius: { xs: 0, sm: '22px' },
        position: 'relative',
        maxWidth: { xs: '100vw', sm: '480px' },
        width: '100%',
        minHeight: { xs: '100vh', sm: 'auto' },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 32px rgba(100,150,200,0.18)',
      }}
    >
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        mb: { xs: 0, sm: 2 },
        mt: { xs: 2, sm: 4 },
        width: '100%',
        justifyContent: 'space-between',
        px: { xs: 2, sm: 4 },
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AutoAwesomeIcon sx={{ color: '#FFB020', fontSize: 32 }} />
          <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: '1.15rem', sm: '1.35rem' } }}>
            Magic Prompt Generator
          </Typography>
        </Box>
        <IconButton aria-label="Close" onClick={onClose} sx={{ ml: 1 }}>
          <CloseIcon sx={{ fontSize: 28 }} />
        </IconButton>
      </Box>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2.5,
        width: '100%',
        maxWidth: 420,
        mx: 'auto',
        mt: { xs: 2, sm: 2 },
        mb: { xs: 2, sm: 4 },
        px: { xs: 2, sm: 4 },
      }}>
        <TextField
          label="Role (Who is the AI?)"
          placeholder="e.g. Expert Copywriter, Senior React Developer"
          name="role"
          variant="outlined"
          value={formData.role}
          onChange={handleChange}
          InputProps={{
            startAdornment: <AutoAwesomeIcon sx={{ color: '#A78BFA', mr: 1 }} />,
            sx: {
              background: 'rgba(255,255,255,0.45)',
              borderRadius: '10px',
              boxShadow: '0 2px 8px rgba(100,150,200,0.08)',
            },
          }}
          sx={{
            '& .MuiInputBase-root': {
              fontWeight: 500,
              fontSize: '1rem',
              background: 'rgba(255,255,255,0.45)',
              borderRadius: '10px',
              boxShadow: '0 2px 8px rgba(100,150,200,0.08)',
            },
            '& .MuiInputLabel-root': {
              fontWeight: 500,
              color: '#A78BFA',
            },
          }}
        />
        <TextField
          label="Context (Background Info)"
          placeholder="e.g. I am writing a sales email for a SaaS product..."
          name="context"
          multiline
          rows={2}
          variant="outlined"
          value={formData.context}
          onChange={handleChange}
          InputProps={{
            sx: {
              background: 'rgba(255,255,255,0.45)',
              borderRadius: '10px',
              boxShadow: '0 2px 8px rgba(100,150,200,0.08)',
            },
          }}
          sx={{
            '& .MuiInputBase-root': {
              fontWeight: 500,
              fontSize: '1rem',
              background: 'rgba(255,255,255,0.45)',
              borderRadius: '10px',
              boxShadow: '0 2px 8px rgba(100,150,200,0.08)',
            },
            '& .MuiInputLabel-root': {
              fontWeight: 500,
              color: '#A78BFA',
            },
          }}
        />
        <TextField
          label="Task (What should it do?)"
          placeholder="e.g. Write a compelling subject line and body text"
          name="task"
          variant="outlined"
          value={formData.task}
          onChange={handleChange}
          InputProps={{
            sx: {
              background: 'rgba(255,255,255,0.45)',
              borderRadius: '10px',
              boxShadow: '0 2px 8px rgba(100,150,200,0.08)',
            },
          }}
          sx={{
            '& .MuiInputBase-root': {
              fontWeight: 500,
              fontSize: '1rem',
              background: 'rgba(255,255,255,0.45)',
              borderRadius: '10px',
              boxShadow: '0 2px 8px rgba(100,150,200,0.08)',
            },
            '& .MuiInputLabel-root': {
              fontWeight: 500,
              color: '#A78BFA',
            },
          }}
        />
        <TextField
          label="Constraints (Format, Tone, Limits)"
          placeholder="e.g. Keep it under 100 words, professional tone"
          name="constraints"
          variant="outlined"
          value={formData.constraints}
          onChange={handleChange}
          InputProps={{
            sx: {
              background: 'rgba(255,255,255,0.45)',
              borderRadius: '10px',
              boxShadow: '0 2px 8px rgba(100,150,200,0.08)',
            },
          }}
          sx={{
            '& .MuiInputBase-root': {
              fontWeight: 500,
              fontSize: '1rem',
              background: 'rgba(255,255,255,0.45)',
              borderRadius: '10px',
              boxShadow: '0 2px 8px rgba(100,150,200,0.08)',
            },
            '& .MuiInputLabel-root': {
              fontWeight: 500,
              color: '#A78BFA',
            },
          }}
        />
        <Button
          variant="contained"
          onClick={generate}
          sx={{
            background: 'linear-gradient(90deg, #6BB6FF 0%, #A78BFA 100%)',
            color: 'white',
            fontWeight: 'bold',
            py: 1.5,
            fontSize: '1.08rem',
            borderRadius: '10px',
            boxShadow: '0 2px 12px rgba(100,150,200,0.12)',
            mt: 1,
            transition: 'box-shadow 0.2s',
            '&:hover': {
              background: 'linear-gradient(90deg, #A78BFA 0%, #6BB6FF 100%)',
              boxShadow: '0 4px 24px rgba(100,150,200,0.18)',
            },
          }}
        >
          Generate Magic Prompt
        </Button>
        {generatedPrompt && (
          <Fade in={true}>
            <Box sx={{
              mt: 2,
              p: 2.5,
              background: 'linear-gradient(90deg, #A78BFA22 0%, #6BB6FF22 100%)',
              borderRadius: '10px',
              position: 'relative',
              boxShadow: '0 2px 12px rgba(100,150,200,0.10)',
              border: '1.5px solid #A78BFA',
            }}>
              <Typography variant="body1" sx={{ fontFamily: 'monospace', fontSize: '1.05rem', color: '#2D3748' }}>
                {generatedPrompt}
              </Typography>
              <IconButton
                onClick={() => navigator.clipboard.writeText(generatedPrompt)}
                sx={{ position: 'absolute', top: 5, right: 5, color: '#A78BFA', background: 'rgba(255,255,255,0.7)', borderRadius: '50%' }}
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
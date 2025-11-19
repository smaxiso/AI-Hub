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
        mb: 0,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.08) 100%)',
        backdropFilter: 'blur(24px)',
        border: '1.5px solid rgba(255,255,255,0.22)',
        borderRadius: { xs: 0, sm: '20px' },
        position: 'relative',
        maxWidth: { xs: '100vw', sm: '480px' },
        width: '100%',
        minHeight: { xs: '100vh', sm: 'auto' },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 32px rgba(100,150,200,0.18), 0 1.5px 8px #A78BFA',
        overflow: 'hidden',
      }}
    >
      {/* Modal Header */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        px: { xs: 2, sm: 3 },
        pt: { xs: 2, sm: 3 },
        pb: 1,
        borderBottom: '1px solid rgba(255,255,255,0.12)',
        background: 'transparent',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AutoAwesomeIcon sx={{ color: '#FFB020', fontSize: 28 }} />
          <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
            Magic Prompt Generator
          </Typography>
        </Box>
        <IconButton aria-label="Close" onClick={onClose} sx={{ ml: 1, color: '#A0AEC0' }}>
          <CloseIcon fontSize="medium" />
        </IconButton>
      </Box>
      {/* Modal Content */}
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2.5,
        width: '100%',
        px: { xs: 2, sm: 3 },
        py: { xs: 2, sm: 3 },
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
      }}>
        <TextField
          label="Role (Who is the AI?)"
          placeholder="e.g. Expert Copywriter, Senior React Developer"
          name="role"
          variant="filled"
          value={formData.role}
          onChange={handleChange}
          InputProps={{
            startAdornment: <AutoAwesomeIcon sx={{ color: '#A78BFA', mr: 1 }} fontSize="small" />,
            disableUnderline: true,
            sx: {
              fontWeight: 500,
              fontSize: '1rem',
              background: 'rgba(255,255,255,0.18)',
              borderRadius: '10px',
              boxShadow: '0 2px 8px rgba(167,139,250,0.08)',
              py: 1,
            }
          }}
          InputLabelProps={{
            sx: {
              fontWeight: 600,
              color: '#A78BFA',
              fontSize: '1rem',
            }
          }}
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
          InputProps={{
            disableUnderline: true,
            sx: {
              fontWeight: 500,
              fontSize: '1rem',
              background: 'rgba(255,255,255,0.18)',
              borderRadius: '10px',
              boxShadow: '0 2px 8px rgba(167,139,250,0.08)',
              py: 1,
            }
          }}
          InputLabelProps={{
            sx: {
              fontWeight: 600,
              color: '#A78BFA',
              fontSize: '1rem',
            }
          }}
        />
        <TextField
          label="Task (What should it do?)"
          placeholder="e.g. Write a compelling subject line and body text"
          name="task"
          variant="filled"
          value={formData.task}
          onChange={handleChange}
          InputProps={{
            disableUnderline: true,
            sx: {
              fontWeight: 500,
              fontSize: '1rem',
              background: 'rgba(255,255,255,0.18)',
              borderRadius: '10px',
              boxShadow: '0 2px 8px rgba(167,139,250,0.08)',
              py: 1,
            }
          }}
          InputLabelProps={{
            sx: {
              fontWeight: 600,
              color: '#A78BFA',
              fontSize: '1rem',
            }
          }}
        />
        <TextField
          label="Constraints (Format, Tone, Limits)"
          placeholder="e.g. Keep it under 100 words, professional tone"
          name="constraints"
          variant="filled"
          value={formData.constraints}
          onChange={handleChange}
          InputProps={{
            disableUnderline: true,
            sx: {
              fontWeight: 500,
              fontSize: '1rem',
              background: 'rgba(255,255,255,0.18)',
              borderRadius: '10px',
              boxShadow: '0 2px 8px rgba(167,139,250,0.08)',
              py: 1,
            }
          }}
          InputLabelProps={{
            sx: {
              fontWeight: 600,
              color: '#A78BFA',
              fontSize: '1rem',
            }
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
            borderRadius: '10px',
            boxShadow: '0 2px 8px rgba(167,139,250,0.12)',
            fontSize: '1.1rem',
            mt: 1,
            transition: 'all 0.2s',
            '&:hover': {
              background: 'linear-gradient(90deg, #A78BFA 0%, #6BB6FF 100%)',
              boxShadow: '0 4px 16px rgba(167,139,250,0.18)',
              transform: 'scale(1.04)'
            }
          }}
        >
          Generate Magic Prompt
        </Button>
        {generatedPrompt && (
          <Fade in={true}>
            <Box sx={{
              mt: 2,
              p: 2,
              background: 'rgba(167,139,250,0.08)',
              borderRadius: '10px',
              position: 'relative',
              boxShadow: '0 2px 8px rgba(167,139,250,0.12)',
              width: '100%',
              minHeight: '56px',
              display: 'flex',
              alignItems: 'center',
            }}>
              <Typography variant="body1" sx={{ fontFamily: 'monospace', fontSize: '1rem', color: '#6BB6FF', wordBreak: 'break-word' }}>
                {generatedPrompt}
              </Typography>
              <IconButton
                onClick={() => navigator.clipboard.writeText(generatedPrompt)}
                sx={{ position: 'absolute', top: 5, right: 5, color: '#A78BFA', background: 'rgba(255,255,255,0.18)', borderRadius: '50%' }}
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
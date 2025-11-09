import React, { useState } from 'react';
import { IconButton, Tooltip, Menu, MenuItem, Snackbar, Alert } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FacebookIcon from '@mui/icons-material/Facebook';
import { shareTool, copyToClipboard, getShareUrl } from '../utils/share';

const ShareButton = ({ tool }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleShare = async () => {
    await shareTool(tool);
    handleClose();
  };

  const handleCopyLink = async () => {
    const url = getShareUrl(tool);
    const success = await copyToClipboard(url);
    setSnackbar({
      open: true,
      message: success ? 'Link copied to clipboard!' : 'Failed to copy link'
    });
    handleClose();
  };

  const handleSocialShare = (platform) => {
    const url = encodeURIComponent(getShareUrl(tool));
    const text = encodeURIComponent(`Check out ${tool.name} - an amazing AI tool!`);
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`
    };

    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    handleClose();
  };

  return (
    <>
      <Tooltip title="Share">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{
            color: '#718096',
            background: 'rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            '&:hover': {
              color: '#6BB6FF',
              background: 'rgba(107, 182, 255, 0.2)',
              border: '1.5px solid #6BB6FF',
              transform: 'scale(1.1)',
              boxShadow: '0 4px 12px rgba(107, 182, 255, 0.3)'
            },
            transition: 'all 0.2s ease'
          }}
        >
          <ShareIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            background: 'rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            borderRadius: '12px',
            mt: 1
          }
        }}
      >
        <MenuItem onClick={handleShare}>
          <ShareIcon sx={{ mr: 1, fontSize: '1rem' }} />
          Share via...
        </MenuItem>
        <MenuItem onClick={handleCopyLink}>
          <ContentCopyIcon sx={{ mr: 1, fontSize: '1rem' }} />
          Copy Link
        </MenuItem>
        <MenuItem onClick={() => handleSocialShare('twitter')}>
          <TwitterIcon sx={{ mr: 1, fontSize: '1rem' }} />
          Twitter
        </MenuItem>
        <MenuItem onClick={() => handleSocialShare('linkedin')}>
          <LinkedInIcon sx={{ mr: 1, fontSize: '1rem' }} />
          LinkedIn
        </MenuItem>
        <MenuItem onClick={() => handleSocialShare('facebook')}>
          <FacebookIcon sx={{ mr: 1, fontSize: '1rem' }} />
          Facebook
        </MenuItem>
      </Menu>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ borderRadius: '8px' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ShareButton;


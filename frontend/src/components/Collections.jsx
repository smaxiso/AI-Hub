import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Chip, IconButton, Tooltip, Snackbar, Alert } from '@mui/material';
import { motion } from 'framer-motion';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import { useLocalStorage } from '../hooks/useLocalStorage';

const Collections = ({ tools, onCollectionSelect }) => {
  const [collections, setCollections] = useLocalStorage('ai-gallery-collections', []);
  const [open, setOpen] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const fileInputRef = useRef(null);

  // Snackbar State
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const createCollection = () => {
    if (newCollectionName.trim()) {
      const newCollection = {
        id: Date.now().toString(),
        name: newCollectionName.trim(),
        toolIds: [],
        createdAt: new Date().toISOString()
      };
      setCollections([...collections, newCollection]);
      setNewCollectionName('');
      setOpen(false);
      showSnackbar('Collection created successfully', 'success');
    }
  };

  const deleteCollection = (collectionId) => {
    setCollections(collections.filter(c => c.id !== collectionId));
  };

  const getCollectionTools = (collection) => {
    return tools.filter(tool => collection.toolIds.includes(tool.id));
  };

  const exportCollections = () => {
    const data = JSON.stringify(collections, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-gallery-collections-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showSnackbar('Collections exported', 'success');
  };

  const importCollections = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (Array.isArray(imported)) {
          // Merge with existing collections, avoiding duplicates
          const existingIds = new Set(collections.map(c => c.id));
          const newCollections = imported.filter(c => !existingIds.has(c.id));
          setCollections([...collections, ...newCollections]);
          setCollections([...collections, ...newCollections]);
          showSnackbar(`Successfully imported ${newCollections.length} collection(s)`, 'success');
        } else {
          showSnackbar('Invalid file format. Please ensure the file contains a valid collections array.', 'error');
        }
      } catch (error) {
        console.error('Error importing collections:', error);
        showSnackbar('Error importing collections. Please check the file format.', 'error');
      }
    };
    reader.readAsText(file);
    // Reset file input
    event.target.value = '';
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          My Collections
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {collections.length > 0 && (
            <>
              <Tooltip title="Export Collections">
                <IconButton
                  onClick={exportCollections}
                  aria-label="Export collections"
                  sx={{
                    background: 'rgba(255, 255, 255, 0.25)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: 'text.primary',
                    '&:hover': {
                      background: 'rgba(107, 182, 255, 0.2)',
                      border: '1px solid #6BB6FF',
                      color: '#6BB6FF'
                    }
                  }}
                >
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Import Collections">
                <IconButton
                  onClick={handleImportClick}
                  aria-label="Import collections"
                  sx={{
                    background: 'rgba(255, 255, 255, 0.25)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: 'text.primary',
                    '&:hover': {
                      background: 'rgba(167, 139, 250, 0.2)',
                      border: '1px solid #A78BFA',
                      color: '#A78BFA'
                    }
                  }}
                >
                  <UploadIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
          <Button
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #6BB6FF 0%, #A78BFA 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              fontWeight: 600,
              boxShadow: '0 4px 14px rgba(107, 182, 255, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5AA5FF 0%, #9678FA 100%)',
                boxShadow: '0 6px 20px rgba(107, 182, 255, 0.5)',
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.2s ease'
            }}
          >
            New Collection
          </Button>
        </Box>
      </Box>

      {/* Hidden file input for import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={importCollections}
        aria-label="Import collections file"
      />

      {collections.length === 0 ? (
        <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 3 }}>
          No collections yet. Create one to organize your favorite tools!
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {collections.map((collection) => {
            const collectionTools = getCollectionTools(collection);
            return (
              <motion.div
                key={collection.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Box
                  onClick={() => onCollectionSelect && onCollectionSelect(collection.toolIds)}
                  sx={{
                    p: 2,
                    background: 'rgba(255, 255, 255, 0.25)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    cursor: 'pointer',
                    minWidth: '200px',
                    position: 'relative',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.35)'
                    }
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteCollection(collection.id);
                    }}
                    sx={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      color: 'text.secondary'
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    {collection.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {collectionTools.length} {collectionTools.length === 1 ? 'tool' : 'tools'}
                  </Typography>
                </Box>
              </motion.div>
            );
          })}
        </Box>
      )}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            background: 'rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            borderRadius: '16px'
          }
        }}
      >
        <DialogTitle>Create New Collection</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Collection Name"
            fullWidth
            variant="outlined"
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                createCollection();
              }
            }}
            sx={{
              mt: 1,
              '& .MuiOutlinedInput-root': {
                background: 'rgba(255, 255, 255, 0.2)'
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={createCollection} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>

      {/* Global Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

Collections.propTypes = {
  tools: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  onCollectionSelect: PropTypes.func,
};

Collections.defaultProps = {
  onCollectionSelect: undefined,
};

export default React.memo(Collections);


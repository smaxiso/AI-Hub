import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { categoryColors } from '../data/tools.js';

const ToolComparison = ({ tools, open, onClose }) => {
  if (!tools || tools.length === 0) return null;

  const comparisonFields = [
    { key: 'name', label: 'Name' },
    { key: 'category', label: 'Category' },
    { key: 'pricing', label: 'Pricing' },
    { key: 'description', label: 'Description' },
    { key: 'useCases', label: 'Use Cases' },
    { key: 'tags', label: 'Tags' }
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          background: 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          borderRadius: '20px'
        }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Compare Tools ({tools.length})
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <TableContainer
          component={Paper}
          sx={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Feature</TableCell>
                {tools.map((tool, index) => (
                  <TableCell key={tool.id} sx={{ fontWeight: 600 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {tool.icon && (
                        <img
                          src={tool.icon}
                          alt={tool.name}
                          style={{ width: '24px', height: '24px', borderRadius: '6px' }}
                        />
                      )}
                      {tool.name}
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {comparisonFields.map((field) => (
                <TableRow key={field.key}>
                  <TableCell sx={{ fontWeight: 500 }}>{field.label}</TableCell>
                  {tools.map((tool) => (
                    <TableCell key={tool.id}>
                      {field.key === 'category' && (
                        <Chip
                          label={tool.category}
                          size="small"
                          sx={{
                            background: `linear-gradient(135deg, ${categoryColors[tool.category] || categoryColors.Other}40 0%, ${categoryColors[tool.category] || categoryColors.Other}20 100%)`,
                            border: `1px solid ${categoryColors[tool.category] || categoryColors.Other}60`
                          }}
                        />
                      )}
                      {field.key === 'pricing' && tool.pricing && (
                        <Chip
                          label={tool.pricing}
                          size="small"
                          color={
                            tool.pricing === 'Free'
                              ? 'success'
                              : tool.pricing === 'Paid'
                              ? 'warning'
                              : 'info'
                          }
                        />
                      )}
                      {field.key === 'useCases' && tool.useCases && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {tool.useCases.map((useCase, idx) => (
                            <Chip
                              key={idx}
                              label={useCase}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: '0.7rem' }}
                            />
                          ))}
                        </Box>
                      )}
                      {field.key === 'tags' && tool.tags && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {tool.tags.slice(0, 3).map((tag, idx) => (
                            <Chip
                              key={idx}
                              label={tag}
                              size="small"
                              sx={{
                                fontSize: '0.7rem',
                                background: 'rgba(255, 255, 255, 0.2)'
                              }}
                            />
                          ))}
                        </Box>
                      )}
                      {(field.key === 'name' || field.key === 'description') && (
                        <Typography variant="body2">
                          {tool[field.key] || 'N/A'}
                        </Typography>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              <TableRow>
                <TableCell sx={{ fontWeight: 500 }}>Actions</TableCell>
                {tools.map((tool) => (
                  <TableCell key={tool.id}>
                    <Button
                      variant="contained"
                      size="small"
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        background: `linear-gradient(135deg, ${categoryColors[tool.category] || categoryColors.Other} 0%, ${categoryColors[tool.category] || categoryColors.Other}dd 100%)`,
                        '&:hover': {
                          background: `linear-gradient(135deg, ${categoryColors[tool.category] || categoryColors.Other}dd 0%, ${categoryColors[tool.category] || categoryColors.Other} 100%)`
                        }
                      }}
                    >
                      Visit
                    </Button>
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ToolComparison;


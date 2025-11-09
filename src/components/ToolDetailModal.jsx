import React from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  IconButton,
  Link,
  Divider,
  Stack,
  Paper,
  Grid,
  useTheme,
  useMediaQuery
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import CategoryIcon from '@mui/icons-material/Category';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TagIcon from '@mui/icons-material/Tag';
import WorkIcon from '@mui/icons-material/Work';
import { motion } from 'framer-motion';
import { categoryColors } from '../data/tools.js';
import { aiTools } from '../data/tools.js';
import { findSimilarTools, findAlternatives } from '../utils/toolSimilarity.js';
import ShareButton from './ShareButton';
import ToolCard from './ToolCard';

const ToolDetailModal = ({ tool, open, onClose, onFavorite, isFavorite, onToolClick }) => {
  if (!tool) return null;

  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const categoryColor = categoryColors[tool.category] || categoryColors.Other;
  
  // Find similar tools and alternatives
  const similarTools = findSimilarTools(tool, aiTools, 4);
  const alternativeTools = findAlternatives(tool, aiTools, 4);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      aria-labelledby="tool-detail-title"
      aria-describedby="tool-detail-description"
      PaperProps={{
        sx: {
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: isMobile ? 0 : '24px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
          overflow: 'hidden',
          position: 'relative'
        }
      }}
    >
      {/* Animated background gradient */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '200px',
          background: `linear-gradient(135deg, ${categoryColor}40 0%, ${categoryColor}20 50%, transparent 100%)`,
          zIndex: 0,
          opacity: 0.6
        }}
      />

      {/* Decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${categoryColor}30 0%, transparent 70%)`,
          filter: 'blur(40px)',
          zIndex: 0
        }}
      />

      <DialogTitle id="tool-detail-title" sx={{ pb: { xs: 1.5, sm: 2 }, pt: { xs: 1.5, sm: 3 }, px: { xs: 2, sm: 3 }, position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: { xs: 1.5, sm: 2 } }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: { xs: 1.5, sm: 2 }, flex: 1 }}>
            {/* Icon with animated border */}
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Box
                sx={{
                  width: { xs: '56px', sm: '80px' },
                  height: { xs: '56px', sm: '80px' },
                  borderRadius: { xs: '14px', sm: '20px' },
                  background: 'rgba(255, 255, 255, 0.3)',
                  backdropFilter: 'blur(10px)',
                  border: `2px solid ${categoryColor}60`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 8px 32px ${categoryColor}30`,
                  position: 'relative',
                  overflow: 'hidden',
                  flexShrink: 0
                }}
              >
                {tool.icon ? (
                  <img
                    src={tool.icon}
                    alt={tool.name}
                    style={{
                      width: isMobile ? '42px' : '60px',
                      height: isMobile ? '42px' : '60px',
                      borderRadius: isMobile ? '8px' : '12px',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <Typography
                    variant="h4"
                    sx={{
                      color: categoryColor,
                      fontWeight: 700,
                      fontSize: { xs: '1.5rem', sm: '2rem' }
                    }}
                  >
                    {tool.name.charAt(0)}
                  </Typography>
                )}
                {/* Shine effect */}
                {!isMobile && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
                      animation: 'shine 3s infinite'
                    }}
                  />
                )}
              </Box>
            </motion.div>

            <Box sx={{ flex: 1, pt: 0.5, minWidth: 0 }}>
              <Typography
                variant="h4"
                component="div"
                sx={{
                  fontWeight: 700,
                  mb: { xs: 0.5, sm: 1 },
                  color: isDarkMode ? '#E2E8F0' : '#2D3748',
                  fontSize: { xs: '1.25rem', sm: '1.75rem', md: '2rem' },
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}
              >
                {tool.name}
              </Typography>
              
              <Stack direction="row" spacing={{ xs: 0.5, sm: 1 }} flexWrap="wrap" useFlexGap>
                <Chip
                  icon={<CategoryIcon sx={{ fontSize: { xs: '0.85rem', sm: '1rem' }, display: { xs: 'none', sm: 'inline-flex' } }} />}
                  label={tool.category}
                  size="small"
                  sx={{
                    background: `linear-gradient(135deg, ${categoryColor} 0%, ${categoryColor}dd 100%)`,
                    border: `1.5px solid ${categoryColor}`,
                    fontSize: { xs: '0.7rem', sm: '0.8rem' },
                    fontWeight: 700,
                    height: { xs: '24px', sm: '28px' },
                    color: 'white',
                    boxShadow: `0 4px 12px ${categoryColor}50`,
                    '& .MuiChip-icon': {
                      color: 'white'
                    }
                  }}
                />
                {tool.pricing && (
                  <Chip
                    icon={<AttachMoneyIcon sx={{ fontSize: { xs: '0.85rem', sm: '1rem' }, display: { xs: 'none', sm: 'inline-flex' } }} />}
                    label={tool.pricing}
                    size="small"
                    sx={{
                      fontSize: { xs: '0.7rem', sm: '0.8rem' },
                      fontWeight: 700,
                      height: { xs: '24px', sm: '28px' },
                      background: tool.pricing === 'Free'
                        ? 'linear-gradient(135deg, #34D399 0%, #10B981 100%)'
                        : tool.pricing === 'Paid'
                        ? 'linear-gradient(135deg, #FB7185 0%, #F43F5E 100%)'
                        : 'linear-gradient(135deg, #6BB6FF 0%, #3B82F6 100%)',
                      color: 'white',
                      border: `1.5px solid ${tool.pricing === 'Free' ? '#34D399' : tool.pricing === 'Paid' ? '#FB7185' : '#6BB6FF'}`,
                      boxShadow: tool.pricing === 'Free'
                        ? '0 4px 12px rgba(52, 211, 153, 0.4)'
                        : tool.pricing === 'Paid'
                        ? '0 4px 12px rgba(251, 113, 133, 0.4)'
                        : '0 4px 12px rgba(107, 182, 255, 0.4)',
                      '& .MuiChip-icon': {
                        color: 'white'
                      }
                    }}
                  />
                )}
                {tool.isNew && (
                  <Chip
                    label="New"
                    size="small"
                    sx={{
                      background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
                      color: 'white',
                      fontSize: { xs: '0.65rem', sm: '0.75rem' },
                      fontWeight: 700,
                      height: { xs: '24px', sm: '28px' },
                      boxShadow: '0 4px 12px rgba(255, 107, 107, 0.4)'
                    }}
                  />
                )}
              </Stack>
            </Box>
          </Box>

          {/* Action buttons - Always visible */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 }, flexShrink: 0 }}>
            {/* Desktop: Visit Tool Button */}
            <Button
              variant="contained"
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              endIcon={<OpenInNewIcon />}
              sx={{
                display: { xs: 'none', sm: 'flex' },
                background: `linear-gradient(135deg, ${categoryColor} 0%, ${categoryColor}cc 100%)`,
                color: 'white',
                px: 3,
                py: 1,
                borderRadius: '12px',
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: `0 8px 24px ${categoryColor}60`,
                border: `1px solid ${categoryColor}80`,
                fontSize: '0.9rem',
                '&:hover': {
                  background: `linear-gradient(135deg, ${categoryColor}ff 0%, ${categoryColor} 100%)`,
                  transform: 'translateY(-2px)',
                  boxShadow: `0 12px 32px ${categoryColor}70`,
                  border: `1px solid ${categoryColor}`
                },
                transition: 'all 0.2s ease'
              }}
            >
              Visit Tool
            </Button>
            <IconButton
              onClick={onFavorite}
              size="small"
              sx={{
                background: isFavorite ? 'rgba(255, 107, 157, 0.2)' : 'rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(10px)',
                border: isFavorite ? '1.5px solid #FF6B9D' : '1px solid rgba(255, 255, 255, 0.4)',
                color: isFavorite ? '#FF6B9D' : '#718096',
                boxShadow: isFavorite ? '0 4px 12px rgba(255, 107, 157, 0.3)' : 'none',
                minWidth: { xs: 40, sm: 'auto' },
                minHeight: { xs: 40, sm: 'auto' },
                '&:hover': {
                  background: isFavorite ? 'rgba(255, 107, 157, 0.3)' : 'rgba(255, 255, 255, 0.35)',
                  transform: 'scale(1.1)',
                  boxShadow: isFavorite ? '0 6px 16px rgba(255, 107, 157, 0.4)' : '0 4px 12px rgba(0, 0, 0, 0.1)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              {isFavorite ? <FavoriteIcon fontSize={isMobile ? "small" : "medium"} /> : <FavoriteBorderIcon fontSize={isMobile ? "small" : "medium"} />}
            </IconButton>
            <ShareButton tool={tool} />
            <IconButton
              onClick={onClose}
              size="small"
              sx={{
                background: 'rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                color: '#718096',
                minWidth: { xs: 40, sm: 'auto' },
                minHeight: { xs: 40, sm: 'auto' },
                '&:hover': {
                  background: 'rgba(251, 113, 133, 0.2)',
                  border: '1.5px solid #FB7185',
                  color: '#FB7185',
                  transform: 'rotate(90deg) scale(1.1)',
                  boxShadow: '0 4px 12px rgba(251, 113, 133, 0.3)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              <CloseIcon fontSize={isMobile ? "small" : "medium"} />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ position: 'relative', zIndex: 1, px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 3 } }}>
        {/* Description Section */}
        {tool.description && (
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              mb: { xs: 2, sm: 3 },
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
            }}
          >
            <Typography
              id="tool-detail-description"
              variant="body1"
              sx={{
                color: 'text.primary',
                lineHeight: 1.8,
                fontSize: { xs: '0.95rem', sm: '1.05rem' },
                fontWeight: 400
              }}
            >
              {tool.description}
            </Typography>
          </Paper>
        )}

        <Grid container spacing={{ xs: 1.5, sm: 2 }}>
          {/* Use Cases */}
          {tool.useCases && tool.useCases.length > 0 && (
            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  height: '100%',
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.25)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <WorkIcon sx={{ color: categoryColor, fontSize: '1.5rem' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                    Use Cases
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {tool.useCases.map((useCase, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Chip
                        label={useCase}
                        sx={{
                          background: `linear-gradient(135deg, ${categoryColor} 0%, ${categoryColor}dd 100%)`,
                          border: `1.5px solid ${categoryColor}`,
                          color: isDarkMode ? '#FFFFFF' : '#000000',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          height: '32px',
                          boxShadow: `0 2px 8px ${categoryColor}50`,
                          '&:hover': {
                            background: `linear-gradient(135deg, ${categoryColor}ff 0%, ${categoryColor} 100%)`,
                            border: `1.5px solid ${categoryColor}`,
                            transform: 'scale(1.05)',
                            boxShadow: `0 4px 12px ${categoryColor}60`
                          },
                          transition: 'all 0.2s ease'
                        }}
                      />
                    </motion.div>
                  ))}
                </Stack>
              </Paper>
            </Grid>
          )}

          {/* Tags */}
          {tool.tags && tool.tags.length > 0 && (
            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  height: '100%',
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.25)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <TagIcon sx={{ color: categoryColor, fontSize: '1.5rem' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                    Tags
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {tool.tags.map((tag, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Chip
                        label={tag}
                        size="small"
                        sx={{
                          background: `linear-gradient(135deg, ${categoryColor} 0%, ${categoryColor}dd 100%)`,
                          border: `1.5px solid ${categoryColor}`,
                          color: isDarkMode ? '#FFFFFF' : '#000000',
                          fontSize: '0.8rem',
                          height: '28px',
                          fontWeight: 700,
                          boxShadow: `0 2px 8px ${categoryColor}50`,
                          '&:hover': {
                            background: `linear-gradient(135deg, ${categoryColor}ff 0%, ${categoryColor} 100%)`,
                            border: `1.5px solid ${categoryColor}`,
                            transform: 'scale(1.05)',
                            boxShadow: `0 4px 12px ${categoryColor}60`
                          },
                          transition: 'all 0.2s ease'
                        }}
                      />
                    </motion.div>
                  ))}
                </Stack>
              </Paper>
            </Grid>
          )}
        </Grid>

        {/* Additional Info */}
        <Box sx={{ mt: 3 }}>
          <Divider sx={{ mb: 2, borderColor: 'rgba(255, 255, 255, 0.2)' }} />
          <Grid container spacing={2}>
            {tool.addedDate && (
              <Grid item xs={6} sm={4}>
                <Typography variant="caption" sx={{ color: isDarkMode ? '#A0AEC0' : '#4A5568', fontWeight: 600, display: 'block', mb: 0.5 }}>
                  Added Date
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500, color: isDarkMode ? '#E2E8F0' : '#1A202C' }}>
                  {new Date(tool.addedDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Typography>
              </Grid>
            )}
            <Grid item xs={6} sm={4}>
              <Typography variant="caption" sx={{ color: isDarkMode ? '#A0AEC0' : '#4A5568', fontWeight: 600, display: 'block', mb: 0.5 }}>
                Category
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500, color: isDarkMode ? '#E2E8F0' : '#1A202C' }}>
                {tool.category}
              </Typography>
            </Grid>
            {tool.pricing && (
              <Grid item xs={6} sm={4}>
                <Typography variant="caption" sx={{ color: isDarkMode ? '#A0AEC0' : '#4A5568', fontWeight: 600, display: 'block', mb: 0.5 }}>
                  Pricing Model
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500, color: isDarkMode ? '#E2E8F0' : '#1A202C' }}>
                  {tool.pricing}
                </Typography>
              </Grid>
            )}
          </Grid>
        </Box>

        {/* Similar Tools */}
        {similarTools.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, fontSize: '1.1rem' }}>
              Similar Tools
            </Typography>
            <Grid container spacing={2}>
              {similarTools.map((similarTool) => (
                <Grid item xs={6} sm={4} md={3} key={similarTool.id}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Paper
                      onClick={() => {
                        if (onToolClick) {
                          onToolClick(similarTool);
                        }
                      }}
                      sx={{
                        p: 1.5,
                        background: 'rgba(255, 255, 255, 0.15)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '12px',
                        border: `1px solid ${categoryColors[similarTool.category] || categoryColors.Other}40`,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.25)',
                          border: `1px solid ${categoryColors[similarTool.category] || categoryColors.Other}60`,
                          transform: 'translateY(-2px)',
                          boxShadow: `0 4px 12px ${categoryColors[similarTool.category] || categoryColors.Other}30`
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {similarTool.icon && (
                          <img
                            src={similarTool.icon}
                            alt={similarTool.name}
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px'
                            }}
                          />
                        )}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              fontSize: '0.85rem',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {similarTool.name}
                          </Typography>
                          <Chip
                            label={similarTool.category}
                            size="small"
                            sx={{
                              mt: 0.5,
                              height: '20px',
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              background: `linear-gradient(135deg, ${categoryColors[similarTool.category] || categoryColors.Other} 0%, ${categoryColors[similarTool.category] || categoryColors.Other}dd 100%)`,
                              border: `1.5px solid ${categoryColors[similarTool.category] || categoryColors.Other}`,
                              color: isDarkMode ? '#FFFFFF' : '#000000',
                              boxShadow: `0 2px 6px ${categoryColors[similarTool.category] || categoryColors.Other}50`
                            }}
                          />
                        </Box>
                      </Box>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Alternative Tools */}
        {alternativeTools.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, fontSize: '1.1rem' }}>
              Alternatives
            </Typography>
            <Grid container spacing={2}>
              {alternativeTools.map((altTool) => (
                <Grid item xs={6} sm={4} md={3} key={altTool.id}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Paper
                      onClick={() => {
                        if (onToolClick) {
                          onToolClick(altTool);
                        }
                      }}
                      sx={{
                        p: 1.5,
                        background: 'rgba(255, 255, 255, 0.15)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '12px',
                        border: `1px solid ${categoryColors[altTool.category] || categoryColors.Other}40`,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.25)',
                          border: `1px solid ${categoryColors[altTool.category] || categoryColors.Other}60`,
                          transform: 'translateY(-2px)',
                          boxShadow: `0 4px 12px ${categoryColors[altTool.category] || categoryColors.Other}30`
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {altTool.icon && (
                          <img
                            src={altTool.icon}
                            alt={altTool.name}
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px'
                            }}
                          />
                        )}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              fontSize: '0.85rem',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {altTool.name}
                          </Typography>
                          <Chip
                            label={altTool.category}
                            size="small"
                            sx={{
                              mt: 0.5,
                              height: '20px',
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              background: `linear-gradient(135deg, ${categoryColors[altTool.category] || categoryColors.Other} 0%, ${categoryColors[altTool.category] || categoryColors.Other}dd 100%)`,
                              border: `1.5px solid ${categoryColors[altTool.category] || categoryColors.Other}`,
                              color: isDarkMode ? '#FFFFFF' : '#000000',
                              boxShadow: `0 2px 6px ${categoryColors[altTool.category] || categoryColors.Other}50`
                            }}
                          />
                        </Box>
                      </Box>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          px: { xs: 2, sm: 3 },
          pb: { xs: 2, sm: 3 },
          pt: 2,
          position: isMobile ? 'sticky' : 'relative',
          bottom: 0,
          background: isMobile ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
          backdropFilter: isMobile ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: isMobile ? 'blur(20px)' : 'none',
          borderTop: isMobile ? '1px solid rgba(255, 255, 255, 0.3)' : 'none',
          zIndex: 10
        }}
      >
        {isMobile ? (
          <Button
            variant="contained"
            fullWidth
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            endIcon={<OpenInNewIcon />}
            sx={{
              background: `linear-gradient(135deg, ${categoryColor} 0%, ${categoryColor}cc 100%)`,
              color: 'white',
              py: 1.5,
              borderRadius: '12px',
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '1rem',
              minHeight: 48,
              boxShadow: `0 4px 20px ${categoryColor}40`
            }}
          >
            Visit Tool
          </Button>
        ) : (
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              borderColor: 'rgba(255, 255, 255, 0.4)',
              borderWidth: '2px',
              color: 'text.primary',
              px: 3,
              py: 1.5,
              borderRadius: '12px',
              fontWeight: 600,
              textTransform: 'none',
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.6)',
                borderWidth: '2px',
                background: 'rgba(255, 255, 255, 0.25)',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
              },
              transition: 'all 0.2s ease'
            }}
          >
            Close
          </Button>
        )}
      </DialogActions>

      {/* Add shine animation */}
      <style>{`
        @keyframes shine {
          0% {
            left: -100%;
          }
          50%, 100% {
            left: 100%;
          }
        }
      `}</style>
    </Dialog>
  );
};

ToolDetailModal.propTypes = {
  tool: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    description: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    pricing: PropTypes.string,
    useCases: PropTypes.arrayOf(PropTypes.string),
    addedDate: PropTypes.string,
    isNew: PropTypes.bool,
    icon: PropTypes.string,
  }),
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onFavorite: PropTypes.func.isRequired,
  isFavorite: PropTypes.bool.isRequired,
  onToolClick: PropTypes.func,
};

ToolDetailModal.defaultProps = {
  tool: null,
  onToolClick: undefined,
};

export default ToolDetailModal;

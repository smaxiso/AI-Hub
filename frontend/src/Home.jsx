import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Box, Container, Typography, Grid, Fab, Tabs, Tab, CssBaseline, Chip, useMediaQuery } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './context/ThemeContext';
import ToolCard from './components/ToolCard';
import SearchBar from './components/SearchBar';
import CategoryFilter from './components/CategoryFilter';
import AdvancedFilters from './components/AdvancedFilters';
import ToolDetailModal from './components/ToolDetailModal';
import ToolComparison from './components/ToolComparison';
import TrendingSection from './components/TrendingSection';
import MagicPrompt from './components/MagicPrompt';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import RecentlyViewed from './components/RecentlyViewed';
import Collections from './components/Collections';
import EmptyState from './components/EmptyState';
import { useFavorites } from './hooks/useFavorites';
import { useRecentlyViewed } from './hooks/useRecentlyViewed';
import { getTrendingTools, getMostVisitedTools } from './utils/analytics';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Skeleton } from '@mui/material';
import Header from './components/Header';
import { Link } from 'react-router-dom';
import SignupPromptModal from './components/SignupPromptModal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function Home() {
  const [aiTools, setAiTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [magicPromptOpen, setMagicPromptOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [pricingFilter, setPricingFilter] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedTool, setSelectedTool] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [comparisonTools, setComparisonTools] = useState([]);
  const [comparisonOpen, setComparisonOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [collectionFilter, setCollectionFilter] = useState(null);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { recentlyViewed, addToRecent } = useRecentlyViewed();
  const { theme, darkMode, toggleDarkMode } = useTheme();

  // Create theme based on dark mode
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Reduce animations on mobile
  const shouldAnimate = !isMobile;

  // Fetch tools from API
  useEffect(() => {
    const fetchTools = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/tools`);
        if (!response.ok) throw new Error('Failed to fetch tools');
        const data = await response.json();

        // Map backend snake_case to frontend camelCase
        const mappedTools = data.map(tool => ({
          ...tool,
          useCases: tool.use_cases || tool.useCases || [],
          addedDate: tool.added_date || tool.addedDate,
          // isNew coming from backend is already correct
        }));

        setAiTools(mappedTools);
      } catch (err) {
        console.error('Error fetching tools:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTools();
  }, []);

  // Auto-scroll to AI tools section after 3 seconds if no user interaction
  useEffect(() => {
    if (loading) return;
    const timer = setTimeout(() => {
      if (!hasUserInteracted && activeTab === 0) {
        const toolsSection = document.getElementById('all-ai-tools-section');
        if (toolsSection) {
          toolsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [hasUserInteracted, activeTab, loading]);

  // Track user interactions
  useEffect(() => {
    const handleInteraction = () => setHasUserInteracted(true);

    window.addEventListener('scroll', handleInteraction, { once: true });
    window.addEventListener('click', handleInteraction, { once: true });
    window.addEventListener('touchstart', handleInteraction, { once: true });

    return () => {
      window.removeEventListener('scroll', handleInteraction);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, []);

  // Get all unique tags from tools
  const allTags = useMemo(() => {
    const tagsSet = new Set();
    aiTools.forEach(tool => {
      if (tool.tags && Array.isArray(tool.tags)) {
        tool.tags.forEach(tag => tagsSet.add(tag));
      }
    });
    return Array.from(tagsSet).sort();
  }, [aiTools]);

  // Enhanced filtering with all criteria
  const filteredTools = useMemo(() => {
    let filtered = aiTools.filter(tool => {
      // Search filter
      const matchesSearch =
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tool.description && tool.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (tool.tags && tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));

      // Category filter
      const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;

      // Pricing filter
      const matchesPricing = pricingFilter === 'All' || tool.pricing === pricingFilter;

      // Tag filter
      const matchesTags = selectedTags.length === 0 ||
        (tool.tags && selectedTags.every(tag => tool.tags.includes(tag)));

      // Collection filter
      const matchesCollection = !collectionFilter || collectionFilter.includes(tool.id);

      return matchesSearch && matchesCategory && matchesPricing && matchesTags && matchesCollection;
    });

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'newest':
          return new Date(b.addedDate || 0) - new Date(a.addedDate || 0);
        case 'popular':
          // This would use analytics data in a real implementation
          return 0;
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [aiTools, searchQuery, selectedCategory, pricingFilter, sortBy, selectedTags, collectionFilter]);

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = ['All', ...new Set(aiTools.map(tool => tool.category))];
    return uniqueCategories;
  }, [aiTools]);

  // Get trending tools
  const trendingTools = useMemo(() => {
    return getTrendingTools(aiTools, 8);
  }, [aiTools]);

  // Get new tools (use backend isNew flag)
  const newTools = useMemo(() => {
    return aiTools
      .filter(tool => tool.isNew)
      .slice(0, 8);
  }, [aiTools]);

  // Handle tool click - memoized for performance
  const handleToolClick = useCallback((tool) => {
    setSelectedTool(tool);
    setModalOpen(true);
    addToRecent(tool.id);
  }, [addToRecent]);

  // Handle modal close - properly manage history
  const handleModalClose = useCallback(() => {
    setModalOpen(false);
    setSelectedTool(null);
    // Remove the history entry if it exists
    if (window.history.state?.modalOpen) {
      window.history.back();
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Focus search on '/' key
      if (e.key === '/' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        document.querySelector('input[type="text"]')?.focus();
      }
      // Toggle dark mode on 'd' key
      if (e.key === 'd' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleDarkMode();
      }
      // Show shortcuts on '?' key
      if (e.key === '?' && !e.shiftKey && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        setShowShortcuts(!showShortcuts);
      }
      // Close modal on Escape
      if (e.key === 'Escape' && modalOpen) {
        handleModalClose();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [modalOpen, showShortcuts, toggleDarkMode, handleModalClose]);

  // Handle browser back button to close modal on mobile
  useEffect(() => {
    if (!modalOpen) return;

    // Push a state when modal opens
    window.history.pushState({ modalOpen: true }, '');

    const handlePopState = (event) => {
      if (modalOpen) {
        setModalOpen(false);
        setSelectedTool(null);
        // Prevent adding another history entry
        event.preventDefault();
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [modalOpen]);

  // Handle URL params for tool sharing
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const toolId = params.get('tool');
    if (toolId) {
      const tool = aiTools.find(t => t.id === toolId);
      if (tool) {
        handleToolClick(tool);
      }
    }
  }, []);

  const handleTagToggle = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleCollectionSelect = (toolIds) => {
    setCollectionFilter(toolIds);
    setActiveTab(0);
  };

  return (

    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        pb: 8,
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
          : 'linear-gradient(135deg, #E8F4F8 0%, #D4C5F9 50%, #C8F4E0 100%)',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Header */}
      <Header />
      {/* Signup Prompt Modal */}
      <SignupPromptModal />

      {/* Loading Skeleton */}
      {loading && (
        <Container maxWidth="xl" sx={{ pt: { xs: 4, md: 6 } }}>
          {/* Header Skeleton */}
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Skeleton variant="text" width="60%" height={60} sx={{ mx: 'auto', mb: 2 }} />
            <Skeleton variant="text" width="40%" height={30} sx={{ mx: 'auto' }} />
          </Box>

          {/* Tabs Skeleton */}
          <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} variant="rectangular" width={100} height={48} sx={{ borderRadius: 1 }} />
            ))}
          </Box>

          {/* Search Bar Skeleton */}
          <Skeleton variant="rectangular" height={56} sx={{ mb: 4, borderRadius: 2 }} />

          {/* Category Filter Skeleton */}
          <Box sx={{ mb: 4, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <Skeleton key={i} variant="rectangular" width={90} height={32} sx={{ borderRadius: 2 }} />
            ))}
          </Box>

          {/* Tool Cards Skeleton */}
          <Grid container spacing={3}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    background: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.3)'}`,
                  }}
                >
                  {/* Icon */}
                  <Skeleton variant="circular" width={56} height={56} sx={{ mb: 2 }} />
                  {/* Title */}
                  <Skeleton variant="text" width="70%" height={28} sx={{ mb: 1 }} />
                  {/* Category chip */}
                  <Skeleton variant="rectangular" width={80} height={24} sx={{ mb: 2, borderRadius: 2 }} />
                  {/* Description lines */}
                  <Skeleton variant="text" width="100%" height={20} sx={{ mb: 0.5 }} />
                  <Skeleton variant="text" width="90%" height={20} sx={{ mb: 0.5 }} />
                  <Skeleton variant="text" width="60%" height={20} sx={{ mb: 2 }} />
                  {/* Tags */}
                  <Box sx={{ display: 'flex', gap: 0.5, mb: 2 }}>
                    <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 2 }} />
                    <Skeleton variant="rectangular" width={50} height={24} sx={{ borderRadius: 2 }} />
                  </Box>
                  {/* Button */}
                  <Skeleton variant="rectangular" width="100%" height={36} sx={{ borderRadius: 2 }} />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      )}

      {/* Animated background elements - Disabled on mobile */}
      {!isMobile && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0,
            pointerEvents: 'none',
            overflow: 'hidden'
          }}
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              style={{
                position: 'absolute',
                width: '300px',
                height: '300px',
                borderRadius: '50%',
                background: theme.palette.mode === 'dark'
                  ? `linear-gradient(135deg, rgba(100, 150, 200, 0.1) 0%, rgba(150, 100, 200, 0.1) 100%)`
                  : `linear-gradient(135deg, rgba(184, 224, 242, 0.3) 0%, rgba(212, 197, 249, 0.3) 100%)`,
                filter: 'blur(60px)',
                left: `${20 + i * 20}%`,
                top: `${10 + i * 15}%`
              }}
              animate={{
                y: [0, 30, 0],
                x: [0, 20, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
          ))}
        </Box>
      )}

      <Container
        maxWidth="xl"
        sx={{
          position: 'relative',
          zIndex: 1,
          pt: { xs: 2, md: 3 } // Reduced from 4/6 to 2/3
        }}
      >
        {/* Magic Prompt Modal */}
        <Dialog
          open={magicPromptOpen}
          onClose={() => setMagicPromptOpen(false)}
          maxWidth="sm"
          fullWidth
          keepMounted={false}
          disablePortal={false}
          disableEnforceFocus={true}
          PaperProps={{
            sx: {
              m: 2,
              borderRadius: '24px',
              background: 'transparent',
              boxShadow: 'none',
              overflow: 'visible'
            }
          }}
        >
          <MagicPrompt onClose={() => setMagicPromptOpen(false)} />
        </Dialog>

        {/* Tagline */}
        <Box sx={{ textAlign: 'center', mb: 2, mt: 1 }}> {/* Added small mt, reduced mb from 3 to 2 */}
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.mode === 'dark' ? '#A0AEC0' : 'text.secondary',
              fontSize: { xs: '0.95rem', sm: '1.1rem', md: '1.25rem' },
              fontWeight: 500,
              maxWidth: '800px',
              mx: 'auto'
            }}
          >
            Discover, compare, and master AI tools
          </Typography>
        </Box>

        {/* Tabs for different views */}
        <Box sx={{ mb: { xs: 2, md: 4 }, mt: { xs: 2, md: 0 } }}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => {
              setActiveTab(newValue);
              setCollectionFilter(null);
            }}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              '& .MuiTab-root': {
                color: theme.palette.mode === 'dark' ? '#A0AEC0' : '#718096',
                fontWeight: 500,
                fontSize: { xs: '0.85rem', md: '0.95rem' },
                minHeight: { xs: 42, md: 48 },
                minWidth: { xs: 80, md: 120 },
                px: { xs: 1.5, md: 2 },
                '&.Mui-selected': {
                  color: theme.palette.mode === 'dark' ? '#90CDF4' : '#6BB6FF',
                  fontWeight: 700
                }
              },
              '& .MuiTabs-indicator': {
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(90deg, #90CDF4 0%, #A78BFA 100%)'
                  : 'linear-gradient(90deg, #6BB6FF 0%, #A78BFA 100%)',
                height: { xs: 2, md: 3 }
              }
            }}
          >
            <Tab label="All Tools" />
            <Tab label="Most Visited" />
            <Tab label="Trending" />
            <Tab label="New Tools" />
            <Tab label="Favorites" />
            <Tab label="Collections" />
          </Tabs>
        </Box>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Box sx={{ mb: 4 }}>
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </Box>
          <Box sx={{ mb: 4 }}>
            <CategoryFilter
              categories={categories}
              selected={selectedCategory}
              onChange={setSelectedCategory}
            />
          </Box>
          <AdvancedFilters
            pricingFilter={pricingFilter}
            onPricingChange={setPricingFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
            selectedTags={selectedTags}
            onTagToggle={handleTagToggle}
            availableTags={allTags}
          />
        </motion.div>

        {/* Recently Viewed Section */}
        {activeTab === 0 && recentlyViewed.length > 0 && (
          <RecentlyViewed allTools={aiTools} onToolClick={handleToolClick} />
        )}

        {/* Main Results Section Header */}
        {activeTab === 0 && (
          <Box id="all-ai-tools-section" sx={{ mb: 3 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '1.25rem', sm: '1.5rem' },
                color: theme.palette.mode === 'dark' ? '#E2E8F0' : '#2D3748',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              {collectionFilter ? 'Collection Tools' : searchQuery || selectedCategory !== 'All' ? 'Search Results' : 'All AI Tools'}
              <Chip
                label={filteredTools.length}
                size="small"
                sx={{
                  height: '26px',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  background: theme.palette.mode === 'dark'
                    ? 'rgba(160, 174, 192, 0.2)'
                    : 'rgba(113, 128, 150, 0.2)',
                  color: theme.palette.mode === 'dark' ? '#A0AEC0' : '#718096',
                  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(160, 174, 192, 0.3)' : 'rgba(113, 128, 150, 0.3)'}`
                }}
              />
            </Typography>
          </Box>
        )}

        {/* Content based on active tab */}
        <AnimatePresence mode="wait">
          {activeTab === 0 && (
            <motion.div
              key="all-tools"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {filteredTools.length > 0 ? (
                <Grid container spacing={3}>
                  {filteredTools.map((tool, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={tool.id}>
                      {shouldAnimate ? (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.5) }}
                        >
                          <ToolCard
                            tool={tool}
                            onFavorite={toggleFavorite}
                            isFavorite={isFavorite(tool.id)}
                            onClick={handleToolClick}
                          />
                        </motion.div>
                      ) : (
                        <ToolCard
                          tool={tool}
                          onFavorite={toggleFavorite}
                          isFavorite={isFavorite(tool.id)}
                          onClick={handleToolClick}
                        />
                      )}
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <EmptyState
                  icon={<SearchOffIcon sx={{ fontSize: 64, color: theme.palette.mode === 'dark' ? '#A0AEC0' : '#718096', opacity: 0.6 }} />}
                  title="No tools found"
                  description="Try adjusting your search or filter criteria to find what you're looking for."
                />
              )}
            </motion.div>
          )}

          {activeTab === 1 && (
            <motion.div
              key="most-visited"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {(() => {
                const mostVisited = getMostVisitedTools(aiTools, 20);
                return mostVisited.length > 0 ? (
                  <Grid container spacing={3}>
                    {mostVisited.map((tool, index) => (
                      <Grid item xs={12} sm={6} md={4} lg={3} key={tool.id}>
                        {shouldAnimate ? (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.5) }}
                          >
                            <ToolCard
                              tool={tool}
                              onFavorite={toggleFavorite}
                              isFavorite={isFavorite(tool.id)}
                              onClick={handleToolClick}
                            />
                          </motion.div>
                        ) : (
                          <ToolCard
                            tool={tool}
                            onFavorite={toggleFavorite}
                            isFavorite={isFavorite(tool.id)}
                            onClick={handleToolClick}
                          />
                        )}
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <EmptyState
                    icon={<VisibilityOffIcon sx={{ fontSize: 64, color: theme.palette.mode === 'dark' ? '#A0AEC0' : '#718096', opacity: 0.6 }} />}
                    title="No visits yet"
                    description="Start exploring tools to see your most visited here. Click on any tool to begin tracking your usage."
                  />
                );
              })()}
            </motion.div>
          )}

          {activeTab === 2 && (
            <motion.div
              key="trending"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <TrendingSection tools={trendingTools} onToolClick={handleToolClick} />
            </motion.div>
          )}

          {activeTab === 3 && (
            <motion.div
              key="new-tools"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {newTools.length > 0 ? (
                <Grid container spacing={3}>
                  {newTools.map((tool, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={tool.id}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <ToolCard
                          tool={tool}
                          onFavorite={toggleFavorite}
                          isFavorite={isFavorite(tool.id)}
                          onClick={handleToolClick}
                        />
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <EmptyState
                  icon={<NewReleasesIcon sx={{ fontSize: 64, color: theme.palette.mode === 'dark' ? '#A0AEC0' : '#718096', opacity: 0.6 }} />}
                  title="No new tools this month"
                  description="Check back soon for the latest AI tools. We're constantly adding new and exciting tools to the collection."
                />
              )}
            </motion.div>
          )}

          {activeTab === 4 && (
            <motion.div
              key="favorites"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {favorites.length > 0 ? (
                <Grid container spacing={3}>
                  {aiTools
                    .filter(tool => favorites.includes(tool.id))
                    .map((tool, index) => (
                      <Grid item xs={12} sm={6} md={4} lg={3} key={tool.id}>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                          <ToolCard
                            tool={tool}
                            onFavorite={toggleFavorite}
                            isFavorite={isFavorite(tool.id)}
                            onClick={handleToolClick}
                          />
                        </motion.div>
                      </Grid>
                    ))}
                </Grid>
              ) : (
                <EmptyState
                  icon={<FavoriteBorderIcon sx={{ fontSize: 64, color: theme.palette.mode === 'dark' ? '#A0AEC0' : '#718096', opacity: 0.6 }} />}
                  title="No favorites yet"
                  description="Click the heart icon on any tool to add it to your favorites. Build your personalized collection of AI tools."
                  actionLabel="Explore Tools"
                  onAction={() => setActiveTab(0)}
                />
              )}
            </motion.div>
          )}

          {activeTab === 5 && (
            <motion.div
              key="collections"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Collections
                tools={aiTools}
                onCollectionSelect={handleCollectionSelect}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tool Detail Modal */}
        <ToolDetailModal
          tool={selectedTool}
          aiTools={aiTools}
          open={modalOpen}
          onClose={handleModalClose}
          onFavorite={() => selectedTool && toggleFavorite(selectedTool.id)}
          isFavorite={selectedTool ? isFavorite(selectedTool.id) : false}
          onToolClick={(tool) => {
            setSelectedTool(tool);
            addToRecent(tool.id);
          }}
        />

        {/* Tool Comparison Modal */}
        <ToolComparison
          tools={comparisonTools}
          open={comparisonOpen}
          onClose={() => {
            setComparisonOpen(false);
            setComparisonTools([]);
          }}
        />

        {/* Keyboard Shortcuts Help */}
        {showShortcuts && (
          <Box
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              p: 2,
              background: 'rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(20px)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              zIndex: 1000,
              maxWidth: '300px'
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Keyboard Shortcuts
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
              <kbd>/</kbd> Focus search
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
              <kbd>?</kbd> Show shortcuts
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
              <kbd>Ctrl/Cmd + D</kbd> Toggle dark mode
            </Typography>
            <Typography variant="caption" sx={{ display: 'block' }}>
              <kbd>Esc</kbd> Close modal
            </Typography>
          </Box>
        )}

        {/* Floating Action Button - Premium 3D with Breathing Animation */}
        <motion.div
          animate={{
            y: [0, -6, 0],
            boxShadow: [
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
            ]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            position: 'fixed',
            bottom: isMobile ? 16 : 32,
            right: isMobile ? 16 : 32,
            zIndex: 1100,
            background: 'none', // Ensure no background is set on the wrapper
            borderRadius: '50%', // Prevent any square shape
            boxShadow: 'none' // Remove any default shadow from the wrapper
          }}
        >
          <Fab
            onClick={() => setMagicPromptOpen(true)}
            sx={{
              width: isMobile ? 64 : 72,
              height: isMobile ? 64 : 72,
              background: 'linear-gradient(135deg, #6BB6FF 0%, #A78BFA 100%)',
              color: 'white',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              boxShadow: `
                inset 0 4px 8px rgba(255,255,255,0.4),
                inset 0 -4px 8px rgba(0,0,0,0.2),
                0 8px 20px rgba(107, 182, 255, 0.5)
              `,
              '&:hover': {
                background: 'linear-gradient(135deg, #A78BFA 0%, #6BB6FF 100%)',
                transform: 'scale(1.05)',
                boxShadow: `
                  inset 0 4px 8px rgba(255,255,255,0.5),
                  inset 0 -4px 8px rgba(0,0,0,0.3),
                  0 12px 28px rgba(107, 182, 255, 0.6)
                `
              },
              transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}
            aria-label="Magic Prompt"
          >
            {/* Animated stars icon using Framer Motion */}
            <motion.span
              animate={{
                rotate: [0, 20, -20, 0],
                scale: [1, 1.15, 1],
                opacity: [1, 0.7, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{ display: 'inline-block' }}
            >
              <AutoAwesomeIcon sx={{ fontSize: isMobile ? '1.8rem' : '2.2rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
            </motion.span>
          </Fab>
        </motion.div>
        {!isMobile && (
          <Fab
            size="small"
            onClick={() => setShowShortcuts(!showShortcuts)}
            sx={{
              position: 'fixed',
              bottom: 24,
              left: 24,
              background: 'rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              color: 'text.secondary',
              zIndex: 1100,
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.35)'
              }
            }}
          >
            <KeyboardIcon />
          </Fab>
        )}
      </Container>

    </Box>
  );
}

export default Home;

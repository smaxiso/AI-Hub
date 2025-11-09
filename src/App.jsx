import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Box, Container, Typography, Grid, Fab, Tabs, Tab, ThemeProvider, CssBaseline } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { createAppTheme } from './theme';
import ToolCard from './components/ToolCard';
import SearchBar from './components/SearchBar';
import CategoryFilter from './components/CategoryFilter';
import AdvancedFilters from './components/AdvancedFilters';
import ToolDetailModal from './components/ToolDetailModal';
import ToolComparison from './components/ToolComparison';
import DarkModeToggle from './components/DarkModeToggle';
import TrendingSection from './components/TrendingSection';
import RecentlyViewed from './components/RecentlyViewed';
import Collections from './components/Collections';
import EmptyState from './components/EmptyState';
import { aiTools } from './data/tools.js';
import { useFavorites } from './hooks/useFavorites';
import { useRecentlyViewed } from './hooks/useRecentlyViewed';
import { useDarkMode } from './hooks/useDarkMode';
import { getTrendingTools, getMostVisitedTools } from './utils/analytics';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [pricingFilter, setPricingFilter] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedTool, setSelectedTool] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [comparisonTools, setComparisonTools] = useState([]);
  const [comparisonOpen, setComparisonOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [collectionFilter, setCollectionFilter] = useState(null);

  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { recentlyViewed, addToRecent } = useRecentlyViewed();
  const [darkMode, toggleDarkMode] = useDarkMode();
  
  // Create theme based on dark mode
  const theme = useMemo(() => createAppTheme(darkMode), [darkMode]);

  // Get all unique tags from tools
  const allTags = useMemo(() => {
    const tagsSet = new Set();
    aiTools.forEach(tool => {
      if (tool.tags && Array.isArray(tool.tags)) {
        tool.tags.forEach(tag => tagsSet.add(tag));
      }
    });
    return Array.from(tagsSet).sort();
  }, []);

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
  }, [searchQuery, selectedCategory, pricingFilter, sortBy, selectedTags, collectionFilter]);

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = ['All', ...new Set(aiTools.map(tool => tool.category))];
    return uniqueCategories;
  }, []);

  // Get trending tools
  const trendingTools = useMemo(() => {
    return getTrendingTools(aiTools, 8);
  }, []);

  // Get new tools (added in last 30 days)
  const newTools = useMemo(() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return aiTools
      .filter(tool => {
        if (!tool.addedDate) return false;
        const addedDate = new Date(tool.addedDate);
        return addedDate >= thirtyDaysAgo;
      })
      .slice(0, 8);
  }, []);

  // Handle tool click - memoized for performance
  const handleToolClick = useCallback((tool) => {
    setSelectedTool(tool);
    setModalOpen(true);
    addToRecent(tool.id);
  }, [addToRecent]);

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
        setModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [modalOpen, showShortcuts, toggleDarkMode]);

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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          position: 'relative',
          overflow: 'hidden',
          pb: 8,
          background: darkMode
            ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
            : 'linear-gradient(135deg, #E8F4F8 0%, #D4C5F9 50%, #C8F4E0 100%)',
          backgroundAttachment: 'fixed'
        }}
      >
      {/* Animated background elements */}
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
              background: darkMode
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

      <Container
        maxWidth="xl"
        sx={{
          position: 'relative',
          zIndex: 1,
          pt: { xs: 4, md: 6 }
        }}
      >
        {/* Header with Dark Mode Toggle */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ flex: 1 }} />
            <Box sx={{ flex: 1, textAlign: 'center' }}>
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  mb: 1,
                  background: darkMode
                    ? 'linear-gradient(135deg, #E2E8F0 0%, #A0AEC0 100%)'
                    : 'linear-gradient(135deg, #2D3748 0%, #718096 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  color: darkMode ? '#E2E8F0' : '#2D3748'
                }}
              >
                TheAIHubX
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: darkMode ? '#A0AEC0' : 'text.secondary',
                  fontSize: { xs: '1rem', md: '1.25rem' }
                }}
              >
                Discover, compare, and master AI tools - Your complete AI learning hub
              </Typography>
            </Box>
            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
              <DarkModeToggle darkMode={darkMode} onToggle={toggleDarkMode} />
            </Box>
          </Box>
        </motion.div>

        {/* Tabs for different views */}
        <Box sx={{ mb: 4 }}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => {
              setActiveTab(newValue);
              setCollectionFilter(null);
            }}
            sx={{
              '& .MuiTab-root': {
                color: darkMode ? '#A0AEC0' : '#718096',
                fontWeight: 500,
                '&.Mui-selected': {
                  color: darkMode ? '#90CDF4' : '#6BB6FF',
                  fontWeight: 700
                }
              },
              '& .MuiTabs-indicator': {
                background: darkMode
                  ? 'linear-gradient(90deg, #90CDF4 0%, #A78BFA 100%)'
                  : 'linear-gradient(90deg, #6BB6FF 0%, #A78BFA 100%)'
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


        {/* Content based on active tab */}
        <AnimatePresence mode="wait">
          {activeTab === 0 && (
            <motion.div
              key="all-tools"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {collectionFilter && (
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Collection Tools ({filteredTools.length})
                </Typography>
              )}
              {filteredTools.length > 0 ? (
                <Grid container spacing={3}>
                  {filteredTools.map((tool, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={tool.id}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
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
                  icon={<SearchOffIcon sx={{ fontSize: 64, color: darkMode ? '#A0AEC0' : '#718096', opacity: 0.6 }} />}
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
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.05 }}
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
                    icon={<VisibilityOffIcon sx={{ fontSize: 64, color: darkMode ? '#A0AEC0' : '#718096', opacity: 0.6 }} />}
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
                  icon={<NewReleasesIcon sx={{ fontSize: 64, color: darkMode ? '#A0AEC0' : '#718096', opacity: 0.6 }} />}
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
                  icon={<FavoriteBorderIcon sx={{ fontSize: 64, color: darkMode ? '#A0AEC0' : '#718096', opacity: 0.6 }} />}
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
          open={modalOpen}
          onClose={() => setModalOpen(false)}
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

        {/* Keyboard Shortcuts Button */}
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
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.35)'
            }
          }}
        >
          <KeyboardIcon />
        </Fab>
      </Container>
    </Box>
    </ThemeProvider>
  );
}

export default App;

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, Container, Typography, Grid, Fab, Tabs, Tab, ThemeProvider, CssBaseline, Chip, useMediaQuery } from '@mui/material';
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
import MagicPrompt from './components/MagicPrompt';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
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
import AboutMe from './components/AboutMe';

function MainApp() {
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
  const [darkMode, toggleDarkMode] = useDarkMode();
  
  // Create theme based on dark mode
  const theme = useMemo(() => createAppTheme(darkMode), [darkMode]);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Reduce animations on mobile
  const shouldAnimate = !isMobile;

  // Auto-scroll to AI tools section after 3 seconds if no user interaction
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasUserInteracted && activeTab === 0) {
        const toolsSection = document.getElementById('all-ai-tools-section');
        if (toolsSection) {
          toolsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [hasUserInteracted, activeTab]);

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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={
            // ...existing code...
            <>
              {/* All previous main app content goes here */}
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
                {/* ...existing code... */}
                {/* All previous main app content goes here */}
                {/* ...existing code... */}
              </Box>
            </>
          } />
          <Route path="/about" element={<AboutMe />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default MainApp;

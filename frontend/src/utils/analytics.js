// Enhanced analytics tracking with detailed event logging
const MAX_EVENTS = 1000; // Keep last 1000 events to prevent storage issues

/**
 * Track any custom event with category, action, label, and value
 */
export const trackEvent = (category, action, label = '', value = null) => {
  try {
    // Google Analytics tracking (if available)
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }

    // Local analytics storage for offline analysis
    const events = JSON.parse(localStorage.getItem('ai-gallery-events') || '[]');
    events.push({
      category,
      action,
      label,
      value,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      screenSize: `${window.innerWidth}x${window.innerHeight}`,
    });

    // Keep only the last MAX_EVENTS
    const trimmedEvents = events.slice(-MAX_EVENTS);
    localStorage.setItem('ai-gallery-events', JSON.stringify(trimmedEvents));
  } catch (error) {
    console.error('Error tracking event:', error);
  }
};

/**
 * Track tool clicks with enhanced metadata
 */
export const trackToolClick = (toolId, toolName, category = '') => {
  try {
    const stats = JSON.parse(localStorage.getItem('ai-gallery-stats') || '{}');
    if (!stats.toolClicks) stats.toolClicks = {};
    if (!stats.toolClicks[toolId]) {
      stats.toolClicks[toolId] = { 
        count: 0, 
        name: toolName,
        category: category,
        firstClicked: new Date().toISOString()
      };
    }
    stats.toolClicks[toolId].count += 1;
    stats.toolClicks[toolId].lastClicked = new Date().toISOString();
    localStorage.setItem('ai-gallery-stats', JSON.stringify(stats));

    // Also track as event
    trackEvent('Tool', 'Click', toolName, 1);
  } catch (error) {
    console.error('Error tracking tool click:', error);
  }
};

/**
 * Track search queries
 */
export const trackSearch = (query, resultsCount) => {
  trackEvent('Search', 'Query', query, resultsCount);
};

/**
 * Track filter usage
 */
export const trackFilter = (filterType, filterValue) => {
  trackEvent('Filter', filterType, filterValue);
};

/**
 * Track favorite actions
 */
export const trackFavorite = (toolName, action = 'add') => {
  trackEvent('Favorite', action, toolName);
};

/**
 * Track collection actions
 */
export const trackCollection = (action, collectionName = '') => {
  trackEvent('Collection', action, collectionName);
};

/**
 * Track tab changes
 */
export const trackTabChange = (tabName) => {
  trackEvent('Navigation', 'Tab Change', tabName);
};

/**
 * Track share actions
 */
export const trackShare = (toolName, method) => {
  trackEvent('Share', method, toolName);
};

export const getToolStats = () => {
  try {
    const stats = JSON.parse(localStorage.getItem('ai-gallery-stats') || '{}');
    return stats.toolClicks || {};
  } catch (error) {
    return {};
  }
};

/**
 * Get all tracked events
 */
export const getAnalyticsEvents = () => {
  try {
    return JSON.parse(localStorage.getItem('ai-gallery-events') || '[]');
  } catch (error) {
    return [];
  }
};

/**
 * Clear analytics data (for privacy)
 */
export const clearAnalytics = () => {
  try {
    localStorage.removeItem('ai-gallery-stats');
    localStorage.removeItem('ai-gallery-events');
  } catch (error) {
    console.error('Error clearing analytics:', error);
  }
};

export const getTrendingTools = (tools, limit = 5) => {
  const stats = getToolStats();
  return tools
    .map(tool => ({
      ...tool,
      clickCount: stats[tool.id]?.count || 0
    }))
    .sort((a, b) => b.clickCount - a.clickCount)
    .slice(0, limit)
    .filter(tool => tool.clickCount > 0);
};

export const getMostVisitedTools = (tools, limit = 10) => {
  const stats = getToolStats();
  return tools
    .map(tool => ({
      ...tool,
      clickCount: stats[tool.id]?.count || 0
    }))
    .sort((a, b) => b.clickCount - a.clickCount)
    .slice(0, limit)
    .filter(tool => tool.clickCount > 0);
};



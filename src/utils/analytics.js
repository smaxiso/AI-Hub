// Simple analytics tracking
export const trackToolClick = (toolId, toolName) => {
  try {
    const stats = JSON.parse(localStorage.getItem('ai-gallery-stats') || '{}');
    if (!stats.toolClicks) stats.toolClicks = {};
    if (!stats.toolClicks[toolId]) {
      stats.toolClicks[toolId] = { count: 0, name: toolName };
    }
    stats.toolClicks[toolId].count += 1;
    stats.toolClicks[toolId].lastClicked = new Date().toISOString();
    localStorage.setItem('ai-gallery-stats', JSON.stringify(stats));
  } catch (error) {
    console.error('Error tracking tool click:', error);
  }
};

export const getToolStats = () => {
  try {
    const stats = JSON.parse(localStorage.getItem('ai-gallery-stats') || '{}');
    return stats.toolClicks || {};
  } catch (error) {
    return {};
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


// Helper functions for tools

export const getDefaultMetadata = (tool) => {
  return {
    description: tool.description || `${tool.name} - A powerful AI tool for ${tool.category.toLowerCase()} tasks.`,
    tags: tool.tags || [tool.category.toLowerCase()],
    pricing: tool.pricing || 'Freemium',
    useCases: tool.useCases || ['General Use'],
    addedDate: tool.addedDate || new Date().toISOString().split('T')[0],
    isNew: tool.isNew !== undefined ? tool.isNew : false
  };
};

export const enhanceTool = (tool) => {
  return {
    ...tool,
    ...getDefaultMetadata(tool)
  };
};

export const getSimilarTools = (tool, allTools, limit = 4) => {
  if (!tool.tags || tool.tags.length === 0) {
    return allTools
      .filter(t => t.id !== tool.id && t.category === tool.category)
      .slice(0, limit);
  }

  return allTools
    .filter(t => t.id !== tool.id)
    .map(t => ({
      ...t,
      similarity: calculateSimilarity(tool, t)
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit)
    .map(({ similarity, ...t }) => t);
};

const calculateSimilarity = (tool1, tool2) => {
  let score = 0;
  
  // Same category
  if (tool1.category === tool2.category) score += 3;
  
  // Common tags
  if (tool1.tags && tool2.tags) {
    const commonTags = tool1.tags.filter(tag => tool2.tags.includes(tag));
    score += commonTags.length;
  }
  
  // Same pricing
  if (tool1.pricing === tool2.pricing) score += 1;
  
  return score;
};


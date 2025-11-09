// Utility functions to find similar tools and alternatives

export const findSimilarTools = (currentTool, allTools, limit = 4) => {
  if (!currentTool || !allTools) return [];

  // Filter out the current tool
  const otherTools = allTools.filter(tool => tool.id !== currentTool.id);

  // Score tools based on similarity
  const scoredTools = otherTools.map(tool => {
    let score = 0;

    // Same category gets high score
    if (tool.category === currentTool.category) {
      score += 10;
    }

    // Matching tags get points
    if (currentTool.tags && tool.tags) {
      const commonTags = currentTool.tags.filter(tag => 
        tool.tags.some(t => t.toLowerCase() === tag.toLowerCase())
      );
      score += commonTags.length * 3;
    }

    // Matching use cases get points
    if (currentTool.useCases && tool.useCases) {
      const commonUseCases = currentTool.useCases.filter(useCase =>
        tool.useCases.some(uc => uc.toLowerCase() === useCase.toLowerCase())
      );
      score += commonUseCases.length * 2;
    }

    // Same pricing model gets a small bonus
    if (tool.pricing === currentTool.pricing) {
      score += 1;
    }

    return { ...tool, similarityScore: score };
  });

  // Sort by score and return top results
  return scoredTools
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, limit)
    .filter(tool => tool.similarityScore > 0);
};

export const findAlternatives = (currentTool, allTools, limit = 4) => {
  if (!currentTool || !allTools) return [];

  // Filter out the current tool
  const otherTools = allTools.filter(tool => tool.id !== currentTool.id);

  // Score tools based on being alternatives (same category, different approach)
  const scoredTools = otherTools.map(tool => {
    let score = 0;

    // Same category is important for alternatives
    if (tool.category === currentTool.category) {
      score += 15;
    }

    // Some matching tags but not all (different approach)
    if (currentTool.tags && tool.tags) {
      const commonTags = currentTool.tags.filter(tag =>
        tool.tags.some(t => t.toLowerCase() === tag.toLowerCase())
      );
      const uniqueTags = tool.tags.filter(tag =>
        !currentTool.tags.some(t => t.toLowerCase() === tag.toLowerCase())
      );
      
      // Balance: some overlap but also unique features
      if (commonTags.length > 0 && uniqueTags.length > 0) {
        score += commonTags.length * 2 + uniqueTags.length;
      }
    }

    // Matching use cases
    if (currentTool.useCases && tool.useCases) {
      const commonUseCases = currentTool.useCases.filter(useCase =>
        tool.useCases.some(uc => uc.toLowerCase() === useCase.toLowerCase())
      );
      score += commonUseCases.length * 3;
    }

    return { ...tool, alternativeScore: score };
  });

  // Sort by score and return top results
  return scoredTools
    .sort((a, b) => b.alternativeScore - a.alternativeScore)
    .slice(0, limit)
    .filter(tool => tool.alternativeScore > 0);
};


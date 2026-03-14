// Utility functions to find similar tools and alternatives

const getCategories = (tool) => tool.categories || [tool.category];

const countOverlap = (arr1, arr2) =>
  arr1.filter(item => arr2.some(b => b.toLowerCase() === item.toLowerCase())).length;

export const findSimilarTools = (currentTool, allTools, limit = 4) => {
  if (!currentTool || !allTools) return [];

  const currentCats = getCategories(currentTool);
  const otherTools = allTools.filter(tool => tool.id !== currentTool.id);

  const scoredTools = otherTools.map(tool => {
    let score = 0;

    // Overlapping categories — more overlap = higher score
    const catOverlap = countOverlap(getCategories(tool), currentCats);
    score += catOverlap * 5;

    // Matching tags
    if (currentTool.tags && tool.tags) {
      score += countOverlap(currentTool.tags, tool.tags) * 3;
    }

    // Matching use cases
    if (currentTool.useCases && tool.useCases) {
      score += countOverlap(currentTool.useCases, tool.useCases) * 2;
    }

    // Same pricing model
    if (tool.pricing === currentTool.pricing) score += 1;

    return { ...tool, similarityScore: score };
  });

  return scoredTools
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, limit)
    .filter(tool => tool.similarityScore > 0);
};

export const findAlternatives = (currentTool, allTools, limit = 4) => {
  if (!currentTool || !allTools) return [];

  const currentCats = getCategories(currentTool);
  const otherTools = allTools.filter(tool => tool.id !== currentTool.id);

  const scoredTools = otherTools.map(tool => {
    let score = 0;

    // Overlapping categories — important for alternatives
    const catOverlap = countOverlap(getCategories(tool), currentCats);
    score += catOverlap * 8;

    // Some matching tags but not all (different approach)
    if (currentTool.tags && tool.tags) {
      const commonTags = currentTool.tags.filter(tag =>
        tool.tags.some(t => t.toLowerCase() === tag.toLowerCase())
      );
      const uniqueTags = tool.tags.filter(tag =>
        !currentTool.tags.some(t => t.toLowerCase() === tag.toLowerCase())
      );
      if (commonTags.length > 0 && uniqueTags.length > 0) {
        score += commonTags.length * 2 + uniqueTags.length;
      }
    }

    // Matching use cases
    if (currentTool.useCases && tool.useCases) {
      score += countOverlap(currentTool.useCases, tool.useCases) * 3;
    }

    return { ...tool, alternativeScore: score };
  });

  return scoredTools
    .sort((a, b) => b.alternativeScore - a.alternativeScore)
    .slice(0, limit)
    .filter(tool => tool.alternativeScore > 0);
};


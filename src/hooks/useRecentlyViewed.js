import { useLocalStorage } from './useLocalStorage';

export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useLocalStorage('ai-gallery-recent', []);

  const addToRecent = (toolId) => {
    const updated = [toolId, ...recentlyViewed.filter(id => id !== toolId)].slice(0, 4);
    setRecentlyViewed(updated);
  };

  const clearRecent = () => {
    setRecentlyViewed([]);
  };

  return {
    recentlyViewed,
    addToRecent,
    clearRecent
  };
}


import { useLocalStorage } from './useLocalStorage';

export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage('ai-gallery-favorites', []);

  const addFavorite = (toolId) => {
    if (!favorites.includes(toolId)) {
      setFavorites([...favorites, toolId]);
    }
  };

  const removeFavorite = (toolId) => {
    setFavorites(favorites.filter(id => id !== toolId));
  };

  const toggleFavorite = (toolId) => {
    if (favorites.includes(toolId)) {
      removeFavorite(toolId);
    } else {
      addFavorite(toolId);
    }
  };

  const isFavorite = (toolId) => favorites.includes(toolId);

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite
  };
}


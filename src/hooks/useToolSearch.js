// Custom hook for fuzzy search using fuse.js
import { useMemo } from 'react';
import Fuse from 'fuse.js';

const useToolSearch = (tools) => {
  const fuse = useMemo(() => {
    return new Fuse(tools, {
      keys: [
        { name: 'name', weight: 0.4 },
        { name: 'description', weight: 0.3 },
        { name: 'tags', weight: 0.2 },
        { name: 'category', weight: 0.1 }
      ],
      threshold: 0.3, // Lower = stricter matching (0.0 = exact, 1.0 = match anything)
      includeScore: true,
      minMatchCharLength: 2,
      ignoreLocation: true,
      findAllMatches: true
    });
  }, [tools]);

  const search = (query) => {
    if (!query || query.trim() === '') {
      return tools;
    }

    const results = fuse.search(query);
    return results.map(result => result.item);
  };

  return search;
};

export default useToolSearch;


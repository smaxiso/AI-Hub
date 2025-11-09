// Parser to extract AI tools from HTML bookmarks file
export function parseBookmarks(htmlContent) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  const tools = [];
  
  // Find all category folders (H3 elements)
  const categories = doc.querySelectorAll('H3');
  
  categories.forEach(category => {
    const categoryName = category.textContent.trim();
    
    // Skip if it's not a valid category or is "Bookmarks Bar"
    if (categoryName === 'Bookmarks Bar' || categoryName === 'AI') {
      return;
    }
    
    // Find the parent DL element containing the links
    let currentElement = category.nextElementSibling;
    
    // Look for the DL element
    while (currentElement && currentElement.tagName !== 'DL') {
      currentElement = currentElement.nextElementSibling;
    }
    
    if (currentElement) {
      // Find all links in this category
      const links = currentElement.querySelectorAll('A');
      
      links.forEach(link => {
        const name = link.textContent.trim();
        const url = link.getAttribute('HREF');
        const icon = link.getAttribute('ICON');
        
        if (name && url) {
          tools.push({
            id: `${categoryName}-${name}-${url}`.replace(/\s+/g, '-').toLowerCase(),
            name,
            url,
            category: categoryName,
            icon: icon || null
          });
        }
      });
    }
  });
  
  return tools;
}


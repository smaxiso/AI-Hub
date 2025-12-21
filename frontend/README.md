# TheAIHubX

**Discover, compare, and master AI tools - Your complete learning hub**

Find all your essential AI tools in one place. Explore, compare, and learn to master AI with curated tools and structured learning paths. A beautiful, modern platform with glassmorphism design, 3D effects, and smooth animations. Built with React, Material-UI, and Framer Motion.

## Features

- 🎨 **Glassmorphism Design** - Beautiful frosted glass effect with backdrop blur
- 🌈 **Soothing Light Colors** - Aesthetic pastel color palette
- 📱 **Mobile-First** - Fully responsive design that works on all devices
- ✨ **3D Effects** - Subtle 3D transforms and hover animations
- 🔍 **Search & Filter** - Find tools by name or category
- 🎭 **Smooth Animations** - Framer Motion powered transitions
- 🎯 **Category Organization** - Tools organized by Chat, Image, Audio, Video, and Other

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Material-UI (MUI)** - Component library
- **Framer Motion** - Animation library
- **Emotion** - CSS-in-JS styling

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
theaihubx/
├── src/
│   ├── components/
│   │   ├── ToolCard.jsx      # Glassmorphism card component
│   │   ├── SearchBar.jsx        # Search input component
│   │   └── CategoryFilter.jsx # Category filter chips
│   ├── data/
│   │   └── tools.js         # AI tools data
│   ├── utils/
│   │   └── parseBookmarks.js # Bookmark parser utility
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── index.html
├── package.json
└── vite.config.js
```

## Customization

### Adding New Tools

Edit `src/data/tools.js` and add your tool object:

```javascript
{
  id: 'unique-id',
  name: 'Tool Name',
  url: 'https://tool-url.com',
  category: 'Chat', // or 'Image', 'Audio', 'Video', 'Other'
  icon: 'data:image/png;base64,...' // optional
}
```

### Color Scheme

Modify the color palette in `src/index.css`:

```css
:root {
  --primary-light: #E8F4F8;
  --primary-soft: #B8E0F2;
  --accent-lavender: #D4C5F9;
  /* ... */
}
```

### Category Colors

Update category colors in `src/data/tools.js`:

```javascript
export const categoryColors = {
  Chat: '#B8E0F2',
  Image: '#D4C5F9',
  // ...
};
```

## Features in Detail

### Glassmorphism Effect
- Backdrop blur for frosted glass appearance
- Semi-transparent backgrounds
- Subtle borders and shadows

### 3D Effects
- Hover transforms with scale and rotation
- Parallax background elements
- Smooth transitions

### Mobile-First Design
- Responsive grid layout
- Touch-friendly interactions
- Optimized for small screens

## License

MIT

## Contributing

Feel free to submit issues and enhancement requests!

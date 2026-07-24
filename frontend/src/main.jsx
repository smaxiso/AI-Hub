import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import ErrorBoundary from './components/ErrorBoundary'
import './index.css'
import './firebase-init' // Initialize Firebase

// ponytail: service worker re-enabled for PWA caching (was previously killed on every load)
// vite-plugin-pwa handles registration via registerType: 'autoUpdate' in vite.config.js

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)

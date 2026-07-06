import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { initAnalytics } from './lib/analytics.js';
import { initClarity } from './lib/clarity.js';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next"

// Patch history methods to dispatch custom events for reliable SPA routing
const patchHistory = (type) => {
  const original = window.history[type];
  return function (...args) {
    const result = original.apply(this, args);
    const changeEvent = new Event('locationchange');
    window.dispatchEvent(changeEvent);
    return result;
  };
};
window.history.pushState = patchHistory('pushState');
window.history.replaceState = patchHistory('replaceState');

// Initialize analytics and tracking (Production Only)
initAnalytics();
initClarity();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Analytics />
    <SpeedInsights />
  </StrictMode>,
);
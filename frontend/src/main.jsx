import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { initAnalytics } from './lib/analytics.js';
import { initClarity } from './lib/clarity.js';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/react"
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

// Helper to defer initialization until the main thread is idle
const deferInit = (fn) => {
  if (typeof requestIdleCallback === 'function') {
    requestIdleCallback(() => fn());
  } else {
    setTimeout(fn, 1500);
  }
};

// Initialize analytics and tracking when idle (Production Only)
deferInit(initAnalytics);
deferInit(initClarity);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Analytics />
    <SpeedInsights />
  </StrictMode>,
);
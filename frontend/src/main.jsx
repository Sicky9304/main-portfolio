import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { initAnalytics } from './lib/analytics.js';
import { initClarity } from './lib/clarity.js';

// Initialize analytics and tracking (Production Only)
initAnalytics();
initClarity();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
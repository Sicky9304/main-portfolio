import { useState, useEffect, Suspense, lazy } from 'react';
import { Outlet, useLocation, useNavigation } from 'react-router-dom';
import { CursorGlow } from '../ui/CursorGlow';
import { ScrollProgress } from '../ui/ScrollProgress';
import { LoadingScreen } from './LoadingScreen';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

// Lazy load large interactive widgets to shrink the initial page boot bundle size
const ThemeCustomizer = lazy(() => import('../ui/ThemeCustomizer').then(m => ({ default: m.ThemeCustomizer })));
const CommandPalette = lazy(() => import('../ui/CommandPalette').then(m => ({ default: m.CommandPalette })));
const GlobalAIAssistant = lazy(() => import('../ai/GlobalAIAssistant').then(m => ({ default: m.GlobalAIAssistant })));

export const AppLayout = () => {
  const location = useLocation();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [isGlobalLoading, setIsGlobalLoading] = useState(false);

  // Initial loader overlay timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Listen to custom global loading events (e.g. from API fetches)
  useEffect(() => {
    let loadingCount = 0;
    const handleStart = () => {
      loadingCount++;
      setIsGlobalLoading(true);
    };
    const handleStop = () => {
      loadingCount = Math.max(0, loadingCount - 1);
      if (loadingCount === 0) {
        setIsGlobalLoading(false);
      }
    };

    window.addEventListener('start-global-loading', handleStart);
    window.addEventListener('stop-global-loading', handleStop);

    return () => {
      window.removeEventListener('start-global-loading', handleStart);
      window.removeEventListener('stop-global-loading', handleStop);
    };
  }, []);

  const cleanPath = location.pathname.replace(/\/$/, '');
  const isAdminRoute = cleanPath === '/sicky-admin';
  const isPageTransitioning = navigation.state === 'loading';

  // Render Admin Dashboard layout (no Navbar, Footer, AI assistant or custom cursor scroll interference)
  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-slate-950 text-white relative">
        <LoadingScreen isLoading={isLoading || isPageTransitioning || isGlobalLoading} />
        <main className="w-full h-full">
          <Outlet />
        </main>
      </div>
    );
  }

  // Adjust padding-top for full pages (like blogs or architecture guides)
  const isDocPage = cleanPath.startsWith('/blog') || cleanPath === '/architecture';

  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark transition-colors duration-500 noise-overlay overflow-x-hidden w-full relative">
      
      {/* Global UI Telemetry Effects */}
      <CursorGlow />
      <ScrollProgress />
      <Suspense fallback={null}>
        <ThemeCustomizer />
        <CommandPalette />
      </Suspense>
      <LoadingScreen isLoading={isLoading || isPageTransitioning || isGlobalLoading} />

      <Navbar />

      <main className={`relative z-10 ${isDocPage ? 'pt-12 md:pt-14' : ''}`}>
        <Outlet />
      </main>

      {/* Conditionally hide Footer on specific layouts if ever requested (currently shown on all non-admin routes) */}
      <Footer />

      <Suspense fallback={null}>
        <GlobalAIAssistant />
      </Suspense>
    </div>
  );
};

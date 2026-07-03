import { useState, useEffect, lazy, Suspense } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { SmoothScrollProvider } from './components/layout/SmoothScroll';
import { LoadingScreen } from './components/layout/LoadingScreen';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CursorGlow } from './components/ui/CursorGlow';
import { ScrollProgress } from './components/ui/ScrollProgress';

import { Hero } from './sections/Hero';

// Lazy load below-the-fold sections and admin dashboard to reduce initial bundle size
const AdminDashboard = lazy(() =>
  import('./sections/AdminDashboard').then((m) => ({ default: m.AdminDashboard }))
);
const About = lazy(() =>
  import('./sections/About').then((m) => ({ default: m.About }))
);

const TechStack = lazy(() =>
  import('./sections/TechStack').then((m) => ({ default: m.TechStack }))
);

const Projects = lazy(() =>
  import('./sections/Projects').then((m) => ({ default: m.Projects }))
);

const Services = lazy(() =>
  import('./sections/Services').then((m) => ({ default: m.Services }))
);

const GitHubSection = lazy(() =>
  import('./sections/GitHubSection').then((m) => ({ default: m.GitHubSection }))
);

const Testimonials = lazy(() =>
  import('./sections/Testimonials').then((m) => ({ default: m.Testimonials }))
);

const Contact = lazy(() =>
  import('./sections/Contact').then((m) => ({ default: m.Contact }))
);

function AppContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // Show loading screen only on initial page load (reduced for performance)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Listen for browser navigation changes
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);

    return () =>
      window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const cleanPath = currentPath.replace(/\/$/, '');

  // Render admin dashboard separately
  if (cleanPath === '/sicky-admin') {
    return (
      <Suspense fallback={null}>
        <AdminDashboard />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark transition-colors duration-500 noise-overlay overflow-x-hidden w-full relative">

      {/* Global UI Effects */}
      <CursorGlow />
      <ScrollProgress />
      <LoadingScreen isLoading={isLoading} />

      <Navbar />

      <main className="relative z-10">

        {/* Above-the-fold content */}
        <Hero />

        {/* Lazy loaded sections */}
        <Suspense fallback={null}>
          <About />
          <TechStack />
          <Projects />
          <GitHubSection />
          <Services />
          <Testimonials />
          <Contact />
        </Suspense>

      </main>

      <Footer />

    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <SmoothScrollProvider>
        <AppContent />
      </SmoothScrollProvider>
    </ThemeProvider>
  );
}

export default App;
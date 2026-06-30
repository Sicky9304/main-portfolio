import { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { SmoothScrollProvider } from './components/layout/SmoothScroll';
import { LoadingScreen } from './components/layout/LoadingScreen';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Hero } from './sections/Hero';
import { About } from './sections/About';
import { TechStack } from './sections/TechStack';
import { Projects } from './sections/Projects';
import { Services } from './sections/Services';
import { GitHubSection } from './sections/GitHubSection';
import { Testimonials } from './sections/Testimonials';
import { Contact } from './sections/Contact';
import { CursorGlow } from './components/ui/CursorGlow';
import { ScrollProgress } from './components/ui/ScrollProgress';

import { AdminDashboard } from './sections/AdminDashboard';

function AppContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  if (currentPath === '/sicky-admin') {
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark transition-colors duration-500 noise-overlay overflow-x-hidden w-full relative">
      <CursorGlow />
      <ScrollProgress />
      <LoadingScreen isLoading={isLoading} />
      <Navbar />

      <main className="relative z-10">
        <Hero />
        <About />
        <TechStack />
        <Projects />
        <GitHubSection />
        <Services />
        <Testimonials />
        <Contact />
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

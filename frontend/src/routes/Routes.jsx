import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { Hero } from '../pages/home/Hero';

// ==========================================
// LAZY LOAD HOME SECTIONS (BELOW-THE-FOLD)
// ==========================================
const About = lazy(() => import('../pages/home/About').then(m => ({ default: m.About })));
const TechStack = lazy(() => import('../pages/home/TechStack').then(m => ({ default: m.TechStack })));
const Projects = lazy(() => import('../pages/home/Projects').then(m => ({ default: m.Projects })));
const GitHubSection = lazy(() => import('../pages/home/GitHubSection').then(m => ({ default: m.GitHubSection })));
const Services = lazy(() => import('../pages/home/Services').then(m => ({ default: m.Services })));
const Testimonials = lazy(() => import('../pages/home/Testimonials').then(m => ({ default: m.Testimonials })));
const Contact = lazy(() => import('../pages/home/Contact').then(m => ({ default: m.Contact })));

// ==========================================
// LAZY LOAD DYNAMIC PAGES (PRODUCTION PATTERN)
// ==========================================
const BlogPage = lazy(() => import('../pages/blog/BlogPage').then(m => ({ default: m.BlogPage })));
const BlogDetailsPage = lazy(() => import('../pages/blog/BlogDetailsPage').then(m => ({ default: m.BlogDetailsPage })));
const ArchitecturePage = lazy(() => import('../pages/home/ArchitecturePage').then(m => ({ default: m.ArchitecturePage })));
const AdminDashboard = lazy(() => import('../pages/blog/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
import { LoadingScreen } from '../components/layout/LoadingScreen';

// Wrapper component to render the global loader when route chunks are fetched
const RouteSuspense = ({ children }) => (
  <Suspense fallback={<LoadingScreen isLoading={true} />}>
    {children}
  </Suspense>
);

// Portfolio Home view containing all landing page anchors
const PortfolioHome = () => (
  <>
    <Hero />
    <Suspense fallback={null}>
      <About />
      <TechStack />
      <Projects />
      <GitHubSection />
      <Services />
      <Testimonials />
      <Contact />
    </Suspense>
  </>
);

// ==========================================
// CENTRALIZED ROUTER DEFINITIONS (REACT ROUTER DOM)
// ==========================================
export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      // 1. Portfolio Section (Landing Homepage)
      {
        index: true,
        element: <PortfolioHome />
      },
      // 2. Blog Page Route (Engineering Articles Index)
      {
        path: 'blog',
        element: (
          <RouteSuspense>
            <BlogPage />
          </RouteSuspense>
        )
      },
      // 3. Blog Details Route (Markdown Viewer by Slug)
      {
        path: 'blog/:slug',
        element: (
          <RouteSuspense>
            <BlogDetailsPage />
          </RouteSuspense>
        )
      },
      // 4. System Architecture Route (AGENTS.md Markdown Viewer)
      {
        path: 'architecture',
        element: (
          <RouteSuspense>
            <ArchitecturePage />
          </RouteSuspense>
        )
      },
      // 5. Admin Console Route (Secured Workspace Editor)
      {
        path: 'sicky-admin',
        element: (
          <RouteSuspense>
            <AdminDashboard />
          </RouteSuspense>
        )
      }
    ]
  }
]);

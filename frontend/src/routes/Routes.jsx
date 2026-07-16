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

// ==========================================
// LAZY LOAD DYNAMIC PAGES (PRODUCTION PATTERN)
// ==========================================
const BlogPage = lazy(() => import('../pages/blog/BlogPage').then(m => ({ default: m.BlogPage })));
const BlogDetailsPage = lazy(() => import('../pages/blog/BlogDetailsPage').then(m => ({ default: m.BlogDetailsPage })));
const ArchitecturePage = lazy(() => import('../pages/home/ArchitecturePage').then(m => ({ default: m.ArchitecturePage })));
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const ProjectDetailsPage = lazy(() => import('../pages/project/ProjectDetailsPage').then(m => ({ default: m.ProjectDetailsPage })));
const ProjectsPage = lazy(() => import('../pages/project/ProjectsPage').then(m => ({ default: m.ProjectsPage })));
const AboutPage = lazy(() => import('../pages/about/AboutPage').then(m => ({ default: m.AboutPage })));
const EducationPage = lazy(() => import('../pages/education/EducationPage').then(m => ({ default: m.EducationPage })));
const ContactPage = lazy(() => import('../pages/contact/Contact'));
const PrivacyPolicyPage = lazy(() => import('../pages/privacy-policy/PrivacyPolicy'));
const TermsPage = lazy(() => import('../pages/term/Terms'));
const DataDeletionPage = lazy(() => import('../pages/data-deletion/DataDeletion'));
const InstagramPage = lazy(() => import('../pages/instagram/InstagramPage'));
import { LoadingScreen } from '../components/layout/LoadingScreen';
import { ErrorPage } from '../pages/home/ErrorPage';

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
    errorElement: <ErrorPage />,
    children: [
      // 1. Portfolio Section (Landing Homepage)
      {
        index: true,
        element: <PortfolioHome />
      },
      // 1.1 Detailed About Page Route
      {
        path: 'about',
        element: (
          <RouteSuspense>
            <AboutPage />
          </RouteSuspense>
        )
      },
      // 1.2 Academic Journey / Education Page Route
      {
        path: 'education',
        element: (
          <RouteSuspense>
            <EducationPage />
          </RouteSuspense>
        )
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
      },
      // 5.5 Projects Catalog Route
      {
        path: 'projects',
        element: (
          <RouteSuspense>
            <ProjectsPage />
          </RouteSuspense>
        )
      },
      // 6. Project Details Case Study Route
      {
        path: 'projects/:slug',
        element: (
          <RouteSuspense>
            <ProjectDetailsPage />
          </RouteSuspense>
        )
      },
      // 7. Standalone Contact Page
      {
        path: 'contact',
        element: (
          <RouteSuspense>
            <ContactPage />
          </RouteSuspense>
        )
      },
      // 8. Privacy Policy Page
      {
        path: 'privacy-policy',
        element: (
          <RouteSuspense>
            <PrivacyPolicyPage />
          </RouteSuspense>
        )
      },
      // 9. Terms & Conditions Page
      {
        path: 'terms',
        element: (
          <RouteSuspense>
            <TermsPage />
          </RouteSuspense>
        )
      },
      // 10. Data Deletion Page
      {
        path: 'data-deletion',
        element: (
          <RouteSuspense>
            <DataDeletionPage />
          </RouteSuspense>
        )
      },
      // 11. Instagram Feed & Publish Page
      {
        path: 'instagram',
        element: (
          <RouteSuspense>
            <InstagramPage />
          </RouteSuspense>
        )
      }
    ]
  }
]);

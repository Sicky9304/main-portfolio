import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProject } from '../../api/index.js';
import { ProjectHeader } from './components/ProjectHeader';
import { ProjectTabs } from './components/ProjectTabs';
import { ProjectAiCompanion } from './components/ProjectAiCompanion';

export const ProjectDetailsPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProject = async () => {
      window.dispatchEvent(new CustomEvent('start-global-loading'));
      setLoading(true);
      try {
        const data = await fetchProject(slug);
        setProject(data);
      } catch (err) {
        console.error('Error fetching project details:', err);
      } finally {
        setLoading(false);
        window.dispatchEvent(new CustomEvent('stop-global-loading'));
      }
    };
    loadProject();
  }, [slug]);

  // Dynamic SEO Meta Tags injection
  useEffect(() => {
    if (!project) return;

    const originalTitle = document.title;
    document.title = `${project.title} | Case Study | Sicky Kumar`;

    const setMeta = (nameOrProperty, value, isProperty = false) => {
      if (!value) return null;
      const attr = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attr}="${nameOrProperty}"]`);
      let created = false;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, nameOrProperty);
        document.head.appendChild(element);
        created = true;
      }
      element.setAttribute('content', value);
      return { element, created };
    };

    const metaDesc = setMeta('description', project.tagline || project.description || '');
    const ogTitle = setMeta('og:title', `${project.title} - Case Study`, true);
    const ogDesc = setMeta('og:description', project.tagline || '', true);
    const ogImg = setMeta('og:image', project.thumbnail || '', true);

    return () => {
      document.title = originalTitle;
      [metaDesc, ogTitle, ogDesc, ogImg].forEach(item => {
        if (item && item.created && item.element) item.element.remove();
      });
    };
  }, [project]);

  const handleBack = () => {
    navigate('/');
    // Scroll down to the projects section if navigated back
    setTimeout(() => {
      const el = document.getElementById('projects');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-light dark:bg-surface-dark transition-colors duration-300">
        <div className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface-light dark:bg-surface-dark transition-colors duration-300 px-4 text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white font-heading">
          Project Case Study Not Found
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-sm">
          The requested project might have been removed or has a different URL path.
        </p>
        <button 
          onClick={handleBack}
          className="mt-6 px-4 py-2 rounded-xl bg-primary text-white text-xs sm:text-sm font-semibold cursor-pointer"
        >
          Go Back Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark text-slate-800 dark:text-slate-100 p-4 sm:p-6 md:p-12 relative transition-colors duration-300 w-full overflow-x-hidden">
      <div className="max-w-6xl mx-auto space-y-8 pb-16">
        <ProjectHeader project={project} onBack={handleBack} />
        <ProjectTabs project={project} />
        <ProjectAiCompanion project={project} />
      </div>
    </div>
  );
};

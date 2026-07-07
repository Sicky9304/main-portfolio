import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Lock, Sparkles, ExternalLink
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { 
  createProject, updateProject, deleteProject, 
  updateProfile, uploadImage, fetchProjects, fetchProfile,
  fetchTechStack, updateTechStack
} from '../../api/index.js';
import { AdminBlogTab } from './AdminBlogTab';
import { compressToWebP } from '../../lib/imageCompressor.js';
import { PasscodePrompt } from './components/PasscodePrompt';
import { ProjectFormModal } from './components/ProjectFormModal';
import { TechSkillsTab } from './components/TechSkillsTab';
import { ProjectsTab } from './components/ProjectsTab';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Dashboard states
  const [projects, setProjects] = useState([]);
  const [profile, setProfile] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState('projects'); // 'projects', 'blogs', or 'techskills'

  // Tech Skills states
  const [techStack, setTechStack] = useState([]);
  const [techSaving, setTechSaving] = useState(false);
  const [techSaveMsg, setTechSaveMsg] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('frontend');
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState(75);

  const CATEGORY_DEFAULTS = [
    { id: 'frontend', label: 'Frontend', emoji: 'ðŸŽ¨', color: 'from-primary/10 to-accent/10', borderColor: 'hover:border-primary/20' },
    { id: 'backend', label: 'Backend', emoji: 'âš™ï¸', color: 'from-accent/10 to-primary/10', borderColor: 'hover:border-accent/20' },
    { id: 'database', label: 'Database', emoji: 'ðŸ—„ï¸', color: 'from-emerald-500/10 to-accent/10', borderColor: 'hover:border-emerald-500/20' },
    { id: 'tools', label: 'Tools & DevOps', emoji: 'ðŸ› ï¸', color: 'from-pink/10 to-primary/10', borderColor: 'hover:border-pink/20' },
    { id: 'languages', label: 'Languages', emoji: 'ðŸ’»', color: 'from-secondary/10 to-pink/10', borderColor: 'hover:border-secondary/20' },
  ];
  
  // Resume upload states
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeStatus, setResumeStatus] = useState(''); // 'idle', 'uploading', 'success', 'error'
  const [resumeError, setResumeError] = useState('');
  const fileInputRef = useRef(null);

  // Project Form States
  const [isEditing, setIsEditing] = useState(false); // false for create mode, project object for edit mode
  const [showForm, setShowForm] = useState(false);
  const [projectForm, setProjectForm] = useState({
    title: '',
    slug: '',
    tagline: '',
    description: '',
    problem: '',
    features: '', // Comma separated in UI
    tech: '', // Comma separated in UI
    github: '',
    demo: '',
    color: 'from-primary to-secondary',
    emoji: 'ðŸš€',
    status: 'Completed',
    order: 0,
    thumbnail: '',
    featured: true
  });
  
  // Drag and drop states for thumbnail
  const [dragActive, setDragActive] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  // 1. Initial Authentication Check & Body styling overrides
  useEffect(() => {
    const htmlEl = document.documentElement;
    const bodyEl = document.body;
    
    // Save original styles
    const originalHtmlBg = htmlEl.style.backgroundColor;
    const originalBodyBg = bodyEl.style.backgroundColor;
    
    // Remove Lenis scroll constraints on admin route
    htmlEl.classList.remove('lenis'); 
    
    return () => {
      htmlEl.style.backgroundColor = originalHtmlBg;
      bodyEl.style.backgroundColor = originalBodyBg;
    };
  }, []);

  // Sync background color with theme context to prevent white margin scroll issues
  useEffect(() => {
    const htmlEl = document.documentElement;
    const bodyEl = document.body;
    const bg = theme === 'dark' ? '#030712' : '#F8FAFC';
    
    htmlEl.style.backgroundColor = bg;
    bodyEl.style.backgroundColor = bg;
  }, [theme]);

  useEffect(() => {
    const savedCode = localStorage.getItem('adminPasscode');
    if (savedCode) {
      verifyPasscodeOnServer(savedCode);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const loadData = async () => {
        try {
          const projs = await fetchProjects();
          const validProjs = Array.isArray(projs) ? projs : [];
          // Sort by order
          setProjects(validProjs.sort((a, b) => (a.order || 0) - (b.order || 0)));
          
          const prof = await fetchProfile();
          setProfile(prof);

          // Load techStack
          const ts = await fetchTechStack();
          if (Array.isArray(ts) && ts.length > 0) {
            setTechStack(ts);
          }
        } catch (err) {
          console.error("Failed to load dashboard data", err);
        }
      };
      loadData();
    }
  }, [isAuthenticated, refreshTrigger]);

  const verifyPasscodeOnServer = async (codeToVerify) => {
    setLoading(true);
    setErrorMsg('');
    try {
      // Dry-run: update profile with empty body to verify admin passcode
      await updateProfile({}, codeToVerify);
      localStorage.setItem('adminPasscode', codeToVerify);
      setIsAuthenticated(true);
    } catch (err) {
      setErrorMsg('Incorrect passcode. Access Denied.');
      localStorage.removeItem('adminPasscode');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!passcode.trim()) return;
    verifyPasscodeOnServer(passcode.trim());
  };

  const handleLogout = () => {
    localStorage.removeItem('adminPasscode');
    setIsAuthenticated(false);
    setPasscode('');
  };

  // 2. Automatic logout on inactivity (2 minutes)
  useEffect(() => {
    if (!isAuthenticated) return;

    const INACTIVITY_TIMEOUT = 2 * 60 * 1000; // 2 minutes
    let timeoutId;

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        handleLogout();
        alert("Session expired due to inactivity. You have been logged out.");
      }, INACTIVITY_TIMEOUT);
    };

    // Events that register user activity
    const events = ['mousemove', 'keypress', 'click', 'scroll', 'touchstart'];

    // Initialize the timer
    resetTimer();

    // Set event listeners to reset timer on user activity
    events.forEach(evt => window.addEventListener(evt, resetTimer));

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      events.forEach(evt => window.removeEventListener(evt, resetTimer));
    };
  }, [isAuthenticated]);

  // 3. Resume base64 converters
  const handleResumeSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setResumeFile(file);
      setResumeError('');
    } else {
      setResumeError('Please select a valid PDF document.');
    }
  };

  const handleUploadResume = async () => {
    if (!resumeFile) return;
    setResumeStatus('uploading');
    setResumeError('');

    const reader = new FileReader();
    reader.readAsDataURL(resumeFile);
    reader.onload = async () => {
      try {
        const base64String = reader.result.split(',')[1];
        const savedCode = localStorage.getItem('adminPasscode');
        
        await updateProfile({
          resumeBase64: base64String,
          resumeMimeType: 'application/pdf'
        }, savedCode);

        setResumeStatus('success');
        setResumeFile(null);
        setRefreshTrigger(prev => prev + 1);
        setTimeout(() => setResumeStatus('idle'), 3000);
      } catch (err) {
        setResumeStatus('error');
        setResumeError(err.message || 'Failed to upload resume.');
      }
    };
  };

  // 4. Image upload converters for Project Thumbnail
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processImageFile = async (file) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG/JPG/WEBP).');
      return;
    }
    
    setUploadingImage(true);
    try {
      const compressedBase64 = await compressToWebP(file);
      const savedCode = localStorage.getItem('adminPasscode');
      
      const response = await uploadImage(compressedBase64, savedCode);
      if (response.success) {
        setProjectForm(prev => ({ ...prev, thumbnail: response.url }));
        setImagePreview(response.url);
      }
    } catch (err) {
      alert(err.message || 'Failed to upload thumbnail to Cloudinary.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleImageSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      processImageFile(e.target.files[0]);
    }
  };

  // 5. CRUD: Projects functions
  const openCreateForm = () => {
    setIsEditing(false);
    setImagePreview('');
    setProjectForm({
      title: '',
      slug: '',
      tagline: '',
      description: '',
      problem: '',
      features: '',
      tech: '',
      github: '',
      demo: '',
      color: 'from-primary to-secondary',
      emoji: 'ðŸš€',
      status: 'Completed',
      order: projects.length,
      thumbnail: '',
      featured: true
    });
    setShowForm(true);
  };

  const openEditForm = (proj) => {
    setIsEditing(proj);
    setImagePreview(proj.thumbnail || '');
    setProjectForm({
      title: proj.title,
      slug: proj.slug,
      tagline: proj.tagline,
      description: proj.description,
      problem: proj.problem || '',
      features: proj.features ? proj.features.join(', ') : '',
      tech: proj.tech ? proj.tech.join(', ') : '',
      github: proj.github || '',
      demo: proj.demo || '',
      color: proj.color || 'from-primary to-secondary',
      emoji: proj.emoji || 'ðŸš€',
      status: proj.status || 'Completed',
      order: proj.order || 0,
      thumbnail: proj.thumbnail || '',
      featured: proj.featured !== undefined ? proj.featured : true
    });
    setShowForm(true);
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const savedCode = localStorage.getItem('adminPasscode');
      // Format array inputs
      const formattedProj = {
        ...projectForm,
        tech: projectForm.tech.split(',').map(s => s.trim()).filter(Boolean),
        features: projectForm.features.split(',').map(s => s.trim()).filter(Boolean)
      };

      if (isEditing) {
        await updateProject(isEditing.slug, formattedProj, savedCode);
      } else {
        await createProject(formattedProj, savedCode);
      }

      setShowForm(false);
      setIsEditing(false);
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      alert(err.message || 'Failed to save project.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (slug) => {
    if (!window.confirm(`Are you sure you want to delete the project "${slug}"?`)) return;
    try {
      const savedCode = localStorage.getItem('adminPasscode');
      await deleteProject(slug, savedCode);
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      alert(err.message || 'Failed to delete project.');
    }
  };

  const handleSaveTechStack = async () => {
    setTechSaving(true);
    setTechSaveMsg('');
    try {
      const savedCode = localStorage.getItem('adminPasscode');
      await updateTechStack(techStack, savedCode);
      setTechSaveMsg('✅ Tech Skills saved successfully!');
      setTimeout(() => setTechSaveMsg(''), 3000);
    } catch (err) {
      setTechSaveMsg('❌ ' + (err.message || 'Save failed'));
    } finally {
      setTechSaving(false);
    }
  };

  // 6. Navigation helper
  const navigateToHome = () => {
    navigate('/');
  };

  // RENDER: Passcode Prompt Screen
  if (!isAuthenticated) {
    return (
      <PasscodePrompt
        passcode={passcode}
        setPasscode={setPasscode}
        loading={loading}
        errorMsg={errorMsg}
        onSubmit={handleLoginSubmit}
        onBack={navigateToHome}
      />
    );
  }

  // RENDER: Admin Main Panel Dashboard
  return (
    <div className={activeTab === 'blogs' 
      ? "h-screen max-h-screen bg-surface-light dark:bg-surface-dark text-slate-800 dark:text-slate-100 p-3 sm:p-4 md:p-5 flex flex-col overflow-hidden relative transition-colors duration-300 w-full"
      : "min-h-screen bg-surface-light dark:bg-surface-dark text-slate-800 dark:text-slate-100 p-4 sm:p-6 md:p-12 relative transition-colors duration-300 w-full overflow-x-hidden"
    }>
      <div className={`${activeTab === 'blogs' ? 'w-full max-w-none px-1 md:px-3 flex flex-col flex-1 min-h-0 space-y-4' : 'max-w-6xl mx-auto space-y-8'}`}>
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-200 dark:border-slate-900">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent flex items-center gap-2 font-heading">
              <Sparkles className="text-primary animate-spin-slow w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 flex-shrink-0" /> Administrative Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-mono mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1.5 leading-relaxed">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 dark:bg-emerald-950/20 px-2 py-0.5 rounded-md border border-emerald-500/20 dark:border-emerald-900/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-555 dark:bg-emerald-400 animate-pulse"></span>
                Authorized Session Active
              </span>
              <span className="text-slate-300 dark:text-slate-700 hidden xs:inline">•</span>
              <span className="bg-slate-100 dark:bg-slate-900/50 text-slate-650 dark:text-slate-400 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-800">
                Secure Storage Mode
              </span>
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
            <button 
              onClick={navigateToHome}
              className="flex-1 sm:flex-initial justify-center px-3 py-2 rounded-xl border border-slate-250 dark:border-slate-800 text-xs sm:text-sm font-semibold hover:border-primary/50 hover:text-primary transition-all duration-300 flex items-center gap-1.5 cursor-pointer bg-white/60 dark:bg-slate-900/40 backdrop-blur-sm shadow-sm dark:shadow-md hover:shadow-primary/5 text-slate-700 dark:text-slate-200"
            >
              <ExternalLink size={13} /> Go to Site
            </button>
            <button 
              onClick={handleLogout}
              className="flex-1 sm:flex-initial justify-center px-3 py-2 rounded-xl bg-red-500/10 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-650 dark:text-red-400 text-xs sm:text-sm font-semibold hover:bg-red-555 hover:border-red-500/30 dark:hover:bg-red-900/20 transition-all duration-300 cursor-pointer text-center flex items-center gap-1.5"
            >
              <Lock size={13} /> Lock Panel
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 mb-2">
          <button
            onClick={() => setActiveTab('projects')}
            className={`pb-4 text-xs sm:text-sm font-semibold tracking-wide transition-all border-b-2 hover:text-primary cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'projects'
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-500 dark:text-slate-405'
            }`}
          >
            📂 Project Manager
          </button>
          <button
            onClick={() => setActiveTab('blogs')}
            className={`pb-4 text-xs sm:text-sm font-semibold tracking-wide transition-all border-b-2 hover:text-primary cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'blogs'
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-500 dark:text-slate-405'
            }`}
          >
            ✍️ Blog Manager
          </button>
          <button
            onClick={() => setActiveTab('techskills')}
            className={`pb-4 text-xs sm:text-sm font-semibold tracking-wide transition-all border-b-2 hover:text-primary cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'techskills'
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-500 dark:text-slate-405'
            }`}
          >
            🛠️ Tech Skills
          </button>
        </div>

        {activeTab === 'projects' ? (
          <>
            <ProjectsTab
              projects={projects}
              profile={profile}
              resumeFile={resumeFile}
              resumeStatus={resumeStatus}
              resumeError={resumeError}
              fileInputRef={fileInputRef}
              handleResumeSelect={handleResumeSelect}
              handleUploadResume={handleUploadResume}
              openCreateForm={openCreateForm}
              openEditForm={openEditForm}
              handleDeleteProject={handleDeleteProject}
            />
            <ProjectFormModal
              showForm={showForm}
              setShowForm={setShowForm}
              isEditing={isEditing}
              projectForm={projectForm}
              setProjectForm={setProjectForm}
              imagePreview={imagePreview}
              setImagePreview={setImagePreview}
              uploadingImage={uploadingImage}
              dragActive={dragActive}
              loading={loading}
              handleDrag={handleDrag}
              handleDrop={handleDrop}
              handleImageSelect={handleImageSelect}
              handleProjectSubmit={handleProjectSubmit}
            />
          </>
        ) : activeTab === 'blogs' ? (
          <div className="flex-1 flex flex-col min-h-0 w-full">
            <AdminBlogTab token={localStorage.getItem('adminPasscode')} />
          </div>
        ) : (
          <TechSkillsTab
            techStack={techStack}
            setTechStack={setTechStack}
            newSkillCategory={newSkillCategory}
            setNewSkillCategory={setNewSkillCategory}
            newSkillName={newSkillName}
            setNewSkillName={setNewSkillName}
            newSkillLevel={newSkillLevel}
            setNewSkillLevel={setNewSkillLevel}
            techSaving={techSaving}
            techSaveMsg={techSaveMsg}
            CATEGORY_DEFAULTS={CATEGORY_DEFAULTS}
            onSave={handleSaveTechStack}
          />
        )}
      </div>
    </div>
  );
};

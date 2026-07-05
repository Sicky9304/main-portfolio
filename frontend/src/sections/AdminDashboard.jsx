import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, ArrowLeft, Upload, FileText, Plus, Trash2, 
  Edit3, ExternalLink, Link2, Sparkles, RefreshCw, X, CheckCircle 
} from 'lucide-react';
import { Github } from '../components/ui/BrandIcons';
import { useTheme } from '../context/ThemeContext';
import { 
  createProject, updateProject, deleteProject, 
  updateProfile, uploadImage, fetchProjects, fetchProfile 
} from '../api/index.js';
import { AdminBlogTab } from './blog/AdminBlogTab';

export const AdminDashboard = () => {
  const { theme } = useTheme();
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Dashboard states
  const [projects, setProjects] = useState([]);
  const [profile, setProfile] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState('projects'); // 'projects' or 'blogs'
  
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
    emoji: '🚀',
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
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const base64Data = reader.result;
        const savedCode = localStorage.getItem('adminPasscode');
        
        const response = await uploadImage(base64Data, savedCode);
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
      emoji: '🚀',
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
      emoji: proj.emoji || '🚀',
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

  // 6. Navigation helper
  const navigateToHome = () => {
    window.history.pushState({}, '', '/');
    const navEvent = new PopStateEvent('popstate');
    window.dispatchEvent(navEvent);
  };

  // RENDER: Passcode Prompt Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-surface-light dark:bg-surface-dark flex flex-col items-center justify-center text-slate-800 dark:text-white px-4 relative overflow-hidden transition-colors duration-300">
        {/* Ambient background glow elements */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md glass border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6 relative z-10"
        >
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-primary border border-primary/20 shadow-lg shadow-primary/5">
            <Lock size={28} className="text-primary animate-pulse" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent font-heading">
              Admin Portal
            </h2>
            <p className="text-xs text-slate-555 dark:text-slate-400">Authorized Access Only • Secure Session Mode</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 pl-1">
                Passcode
              </label>
              <input
                type="password"
                placeholder="••••••••••••"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                disabled={loading}
                className="w-full px-5 py-3.5 rounded-xl bg-white/60 dark:bg-slate-950/80 border border-slate-250 dark:border-slate-800 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 text-center text-lg tracking-wider text-slate-800 dark:text-white focus:outline-none transition-all duration-300 shadow-sm dark:shadow-none"
              />
            </div>
            {errorMsg && (
              <p className="text-xs font-semibold text-red-500 dark:text-red-400 text-center bg-red-500/10 dark:bg-red-950/20 py-2 rounded-lg border border-red-200 dark:border-red-900/30">
                ⚠️ {errorMsg}
              </p>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark font-semibold text-white transition-all shadow-lg shadow-primary/10 hover:shadow-primary/25 cursor-pointer flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0"
            >
              {loading ? <RefreshCw className="animate-spin" size={18} /> : (
                <>
                  <span>Verify Passcode</span>
                  <Sparkles size={16} />
                </>
              )}
            </button>
          </form>

          <button 
            onClick={navigateToHome}
            className="text-xs text-slate-500 dark:text-slate-450 hover:text-slate-700 dark:hover:text-slate-350 flex items-center gap-1 mx-auto cursor-pointer transition-colors"
          >
            <ArrowLeft size={12} /> Go back to website
          </button>
        </motion.div>
      </div>
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
        </div>

        {activeTab === 'projects' ? (
          <>
            {/* Resume and Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Resume Upload Module */}
              <div className="glass border border-slate-250 dark:border-slate-800/80 rounded-3xl p-5 sm:p-6 md:col-span-1 space-y-4 shadow-lg dark:shadow-xl hover:shadow-primary/5 transition-all duration-300 relative group text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 font-heading">
                  <FileText size={16} className="text-primary" /> Dynamic PDF Resume
                </div>
                
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Upload your updated PDF resume. The PDF will be stored as binary base64 directly in the database.
                </p>

                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="h-32 border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-primary/55 hover:bg-slate-100/50 dark:hover:bg-slate-950/40 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-300 group/drop"
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleResumeSelect}
                    accept="application/pdf"
                    className="hidden" 
                  />
                  <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-555 dark:text-slate-400 group-hover/drop:text-primary group-hover/drop:border-primary/30 transition-colors shadow-sm dark:shadow-none">
                    <Upload size={18} />
                  </div>
                  <span className="text-xs text-slate-600 dark:text-slate-400 font-medium px-4 text-center truncate w-full">
                    {resumeFile ? (resumeFile.name.length > 22 ? resumeFile.name.substring(0, 19) + '...' : resumeFile.name) : 'Select Resume PDF'}
                  </span>
                </div>

                {resumeError && (
                  <p className="text-xs text-red-555 dark:text-red-400 font-semibold bg-red-500/10 dark:bg-red-950/15 p-2 rounded-lg border border-red-200 dark:border-red-900/20 text-center">
                    ⚠️ {resumeError}
                  </p>
                )}
                
                {resumeFile && (
                  <button 
                    onClick={handleUploadResume}
                    disabled={resumeStatus === 'uploading'}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold text-xs hover:shadow-lg hover:shadow-primary/10 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {resumeStatus === 'uploading' ? (
                      <RefreshCw className="animate-spin" size={14} />
                    ) : (
                      <>
                        <CheckCircle size={14} /> Save to Database
                      </>
                    )}
                  </button>
                )}

                {resumeStatus === 'success' && (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center justify-center gap-1.5 bg-emerald-500/10 dark:bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-250 dark:border-emerald-900/20">
                    ✔️ Resume uploaded successfully!
                  </p>
                )}

                {profile?.resumeBase64 && (
                  <div className="pt-3 flex items-center justify-between border-t border-slate-200 dark:border-slate-900">
                    <span className="text-xs text-slate-500 font-mono">Current PDF Available</span>
                    <a 
                      href="/api/profile/resume" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-xs text-primary hover:text-primary-light hover:underline flex items-center gap-1 transition-colors"
                    >
                      View Current <Link2 size={10} />
                    </a>
                  </div>
                )}
              </div>

              {/* Quick Stats & Configs */}
              <div className="glass border border-slate-250 dark:border-slate-800/80 rounded-3xl p-5 sm:p-6 md:col-span-2 flex flex-col justify-between shadow-lg dark:shadow-xl hover:shadow-secondary/5 transition-all duration-300">
                <div className="space-y-2">
                  <div className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 font-heading">
                    <Sparkles size={16} className="text-secondary" /> Portfolio Summary
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Overview of configured resources.</p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
                    <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-850 hover:border-slate-300 dark:hover:border-slate-800/80 transition-all duration-300 group/stat shadow-sm dark:shadow-none">
                      <span className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white bg-gradient-to-r from-slate-800 dark:from-white to-slate-500 dark:to-slate-400 bg-clip-text text-transparent group-hover/stat:text-primary transition-colors">{projects.length}</span>
                      <span className="block text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1.5 font-medium">Projects</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-850 hover:border-slate-300 dark:hover:border-slate-800/80 transition-all duration-300 group/stat shadow-sm dark:shadow-none">
                      <span className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white bg-gradient-to-r from-slate-800 dark:from-white to-slate-500 dark:to-slate-400 bg-clip-text text-transparent group-hover/stat:text-secondary transition-colors">
                        {projects.filter(p => p.thumbnail).length}
                      </span>
                      <span className="block text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1.5 font-medium">With Image</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-850 hover:border-slate-300 dark:hover:border-slate-800/80 transition-all duration-300 col-span-2 sm:col-span-1 flex flex-col justify-center items-center text-center shadow-sm dark:shadow-none">
                      <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 bg-emerald-500/10 dark:bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-250 dark:border-emerald-900/30 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-555 dark:bg-emerald-400 animate-pulse"></span>
                        Sync Active
                      </span>
                      <span className="block text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-2 font-medium font-sans">Database Status</span>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-t border-slate-200 dark:border-slate-900 mt-6">
                  <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/80"></span>
                    MongoDB + Cloudinary REST Services
                  </span>
                  <button 
                    onClick={openCreateForm}
                    className="w-full sm:w-auto justify-center px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark text-white text-xs font-semibold hover:shadow-lg hover:shadow-primary/10 transition-all cursor-pointer flex items-center gap-1.5 active:translate-y-0.5"
                  >
                    <Plus size={14} /> Add New Project
                  </button>
                </div>
              </div>
            </div>

            {/* Project Form Modal Overlay */}
            <AnimatePresence>
              {showForm && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/80 backdrop-blur-sm">
                  <motion.div
                    initial={{ scale: 0.96, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.96, opacity: 0, y: 20 }}
                    className="w-full glass border border-slate-800 rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col shadow-2xl relative"
                    style={{ maxHeight: '92dvh', width: 'min(672px, 100%)' }}
                  >
                    {/* Header */}
                    <div className="p-4 sm:p-5 bg-slate-950/80 backdrop-blur-md border-b border-slate-850 flex justify-between items-center flex-shrink-0">
                      <h3 className="font-bold text-base sm:text-lg font-heading text-white">
                        {isEditing ? `Edit Project: ${isEditing.title}` : 'Add New Project'}
                      </h3>
                      <button 
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer flex items-center justify-center active:scale-95"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    {/* Form Body */}
                    <form onSubmit={handleProjectSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-5 custom-scrollbar text-left">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 mb-1.5 pl-0.5">Project Title</label>
                          <input 
                            type="text" 
                            required
                            value={projectForm.title}
                            onChange={(e) => setProjectForm(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 focus:outline-none text-sm text-white transition-all duration-300"
                            placeholder="e.g. AgriConnect"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 mb-1.5 pl-0.5">Project Slug (URL Path)</label>
                          <input 
                            type="text" 
                            required
                            value={projectForm.slug}
                            onChange={(e) => setProjectForm(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                            disabled={!!isEditing}
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 focus:outline-none text-sm text-white transition-all duration-300 disabled:opacity-40"
                            placeholder="e.g. agriconnect"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 mb-1.5 pl-0.5">Tagline</label>
                          <input 
                            type="text" 
                            required
                            value={projectForm.tagline}
                            onChange={(e) => setProjectForm(prev => ({ ...prev, tagline: e.target.value }))}
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 focus:outline-none text-sm text-white transition-all duration-300"
                            placeholder="Connecting farmers to markets"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-semibold text-slate-400 mb-1.5 pl-0.5 text-center">Emoji</label>
                            <input 
                              type="text" 
                              value={projectForm.emoji}
                              onChange={(e) => setProjectForm(prev => ({ ...prev, emoji: e.target.value }))}
                              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 focus:outline-none text-sm text-center text-white transition-all duration-300"
                              placeholder="🌱"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-400 mb-1.5 pl-0.5 text-center">Display Order</label>
                            <input 
                              type="number" 
                              value={projectForm.order}
                              onChange={(e) => setProjectForm(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 focus:outline-none text-sm text-center text-white transition-all duration-300"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1.5 pl-0.5">Description</label>
                        <textarea 
                          required
                          rows={3}
                          value={projectForm.description}
                          onChange={(e) => setProjectForm(prev => ({ ...prev, description: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 focus:outline-none text-sm text-white transition-all duration-300"
                          placeholder="Detail what the project does..."
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1.5 pl-0.5">The Problem Solved (Case Study)</label>
                        <textarea 
                          rows={2}
                          value={projectForm.problem}
                          onChange={(e) => setProjectForm(prev => ({ ...prev, problem: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 focus:outline-none text-sm text-white transition-all duration-300"
                          placeholder="What issue does this solve?"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 mb-1.5 pl-0.5">Tech Stack (comma separated)</label>
                          <input 
                            type="text" 
                            required
                            value={projectForm.tech}
                            onChange={(e) => setProjectForm(prev => ({ ...prev, tech: e.target.value }))}
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 focus:outline-none text-sm text-white transition-all duration-300"
                            placeholder="React.js, Node.js, Express.js, PostgreSQL"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 mb-1.5 pl-0.5">Key Features (comma separated)</label>
                          <input 
                            type="text" 
                            value={projectForm.features}
                            onChange={(e) => setProjectForm(prev => ({ ...prev, features: e.target.value }))}
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 focus:outline-none text-sm text-white transition-all duration-300"
                            placeholder="Marketplace, Soil Readings, Admin advice feed"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 mb-1.5 pl-0.5">GitHub Repository Link</label>
                          <input 
                            type="url" 
                            value={projectForm.github}
                            onChange={(e) => setProjectForm(prev => ({ ...prev, github: e.target.value }))}
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 focus:outline-none text-sm text-white transition-all duration-300"
                            placeholder="https://github.com/..."
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 mb-1.5 pl-0.5">Live Demo Link</label>
                          <input 
                            type="url" 
                            value={projectForm.demo}
                            onChange={(e) => setProjectForm(prev => ({ ...prev, demo: e.target.value }))}
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 focus:outline-none text-sm text-white transition-all duration-300"
                            placeholder="https://..."
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 mb-1.5 pl-0.5">Background Gradient</label>
                          <select 
                            value={projectForm.color}
                            onChange={(e) => setProjectForm(prev => ({ ...prev, color: e.target.value }))}
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-primary focus:outline-none text-sm text-slate-300 cursor-pointer"
                          >
                            <option value="from-primary to-secondary">Cyan to Purple</option>
                            <option value="from-emerald-500 to-accent">Emerald to Cyan</option>
                            <option value="from-pink to-secondary">Pink to Purple</option>
                            <option value="from-accent to-primary">Cyan to Teal</option>
                            <option value="from-amber-400 to-red-500">Yellow to Red</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 mb-1.5 pl-0.5">Development Status</label>
                          <select 
                            value={projectForm.status}
                            onChange={(e) => setProjectForm(prev => ({ ...prev, status: e.target.value }))}
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-primary focus:outline-none text-sm text-slate-300 cursor-pointer"
                          >
                            <option value="Completed">Completed</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Planned">Planned</option>
                          </select>
                        </div>
                        <div className="flex items-center gap-2 pt-2 sm:pt-6 pl-1">
                          <input 
                            type="checkbox"
                            id="featured"
                            checked={projectForm.featured}
                            onChange={(e) => setProjectForm(prev => ({ ...prev, featured: e.target.checked }))}
                            className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-primary focus:ring-primary/20 focus:ring-2 cursor-pointer"
                          />
                          <label htmlFor="featured" className="text-xs font-semibold text-slate-400 cursor-pointer select-none">Featured Project</label>
                        </div>
                      </div>

                      {/* Cloudinary Thumbnail Drag & Drop Uploader */}
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-slate-400 pl-0.5">
                          Thumbnail Image (Upload to Cloudinary)
                        </label>

                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
                          <div className="sm:col-span-3">
                            <div 
                              onDragEnter={handleDrag}
                              onDragOver={handleDrag}
                              onDragLeave={handleDrag}
                              onDrop={handleDrop}
                              onClick={() => document.getElementById('imageFileRef').click()}
                              className={`h-24 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all duration-300 bg-slate-950/40 hover:bg-slate-950/60 ${
                                dragActive ? 'border-primary bg-primary/5' : 'border-slate-800 hover:border-primary/30'
                              }`}
                            >
                              <input 
                                type="file" 
                                id="imageFileRef"
                                onChange={handleImageSelect}
                                accept="image/*"
                                className="hidden" 
                              />
                              <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                                <Upload size={14} className={uploadingImage ? 'animate-bounce' : ''} />
                              </div>
                              <span className="text-xs text-slate-400 font-medium text-center px-4 truncate w-full">
                                {uploadingImage ? 'Uploading to Cloudinary...' : 'Drop image here or click to browse'}
                              </span>
                            </div>
                          </div>
                          <div className="sm:col-span-1 h-24 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center relative w-full shadow-inner">
                            {imagePreview ? (
                              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-[10px] text-slate-500 font-mono text-center px-2">No Image</span>
                            )}
                          </div>
                        </div>
                        
                        <input 
                          type="url" 
                          value={projectForm.thumbnail}
                          onChange={(e) => {
                            setProjectForm(prev => ({ ...prev, thumbnail: e.target.value }));
                            setImagePreview(e.target.value);
                          }}
                          className="w-full px-4 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-primary focus:outline-none text-xs text-slate-800 dark:text-white"
                          placeholder="Or enter custom image URL directly"
                        />
                      </div>

                      {/* Fixed bottom padding to ensure content is fully scrollable */}
                      <div className="h-2"></div>
                    </form>

                    {/* Form Footer - Sticky */}
                    <div className="p-4 sm:p-5 bg-slate-50/95 dark:bg-slate-950/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-850 flex justify-end gap-3 flex-shrink-0">
                      <button 
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900/60 text-xs font-semibold text-slate-600 dark:text-slate-350 transition-all cursor-pointer flex items-center justify-center"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        disabled={loading || uploadingImage}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark font-semibold text-xs text-white transition-all cursor-pointer flex items-center gap-1.5 active:translate-y-0.5"
                      >
                        {loading ? <RefreshCw className="animate-spin" size={14} /> : 'Save Project'}
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* Projects Listing */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-base sm:text-lg font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 font-heading">
                  📂 Manage Projects ({projects.length})
                </h2>
                <button 
                  onClick={openCreateForm}
                  className="px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 text-xs font-semibold transition-all duration-300 cursor-pointer flex items-center gap-1 hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Plus size={12} /> Add Project
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {projects.map((proj) => (
                  <div 
                    key={proj.slug}
                    className="p-3 sm:p-4 rounded-2xl glass border border-slate-200 dark:border-slate-850 hover:border-slate-300 dark:hover:border-slate-800 transition-all duration-300 shadow-sm dark:shadow-lg hover:shadow-primary/5 flex flex-col gap-2.5 min-w-0 overflow-hidden"
                  >
                    {/* Top: thumbnail + info */}
                    <div className="flex gap-3 items-start min-w-0 overflow-hidden">
                      {/* Thumbnail */}
                      <div className="w-11 h-10 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-hidden flex items-center justify-center flex-shrink-0 shadow-inner">
                        {proj.thumbnail ? (
                          <img src={proj.thumbnail} alt={proj.title} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-lg">{proj.emoji || '🚀'}</span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="min-w-0 flex-1 space-y-0.5 overflow-hidden">
                        <h3 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-white font-heading leading-snug flex items-center gap-1.5 flex-wrap">
                          <span className="break-words">{proj.title}</span>
                          {proj.featured && (
                            <span className="text-[8px] bg-primary/20 text-primary border border-primary/25 px-1.5 py-0.5 rounded font-sans font-semibold flex-shrink-0 whitespace-nowrap">
                              Featured
                            </span>
                          )}
                        </h3>
                        <p className="text-[10px] text-slate-500 font-mono truncate w-full">/{proj.slug}</p>

                        {/* Tech tags */}
                        {proj.tech && proj.tech.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-0.5">
                            {proj.tech.slice(0, 3).map((t, idx) => (
                              <span key={idx} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-900 text-slate-600 dark:text-slate-400 font-mono whitespace-nowrap">
                                {t}
                              </span>
                            ))}
                            {proj.tech.length > 3 && (
                              <span className="text-[9px] px-1 py-0.5 text-slate-500 font-mono">+{proj.tech.length - 3}</span>
                            )}
                          </div>
                        )}

                        <div className="flex flex-wrap items-center gap-1 pt-0.5">
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-mono whitespace-nowrap">Order: {proj.order}</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded border font-mono whitespace-nowrap ${
                            proj.status === 'Completed' 
                              ? 'bg-emerald-500/10 dark:bg-emerald-950/15 border-emerald-200 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400' 
                              : proj.status === 'In Progress'
                                ? 'bg-amber-500/10 dark:bg-amber-950/15 border-amber-200 dark:border-amber-900/30 text-amber-600 dark:text-amber-400'
                                : 'bg-indigo-500/10 dark:bg-indigo-950/15 border-indigo-200 dark:border-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                          }`}>{proj.status}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom: action buttons */}
                    <div className="flex gap-2 pt-2 border-t border-slate-200 dark:border-slate-800/60">
                      <button 
                        onClick={() => openEditForm(proj)}
                        className="flex-1 flex items-center justify-center p-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-primary/40 hover:text-primary text-slate-600 dark:text-slate-400 transition-all duration-300 cursor-pointer shadow-sm dark:shadow-md"
                        title="Edit Project"
                      >
                        <Edit3 size={13} />
                      </button>
                      <button 
                        onClick={() => handleDeleteProject(proj.slug)}
                        className="flex-1 flex items-center justify-center p-2 rounded-xl bg-red-500/5 dark:bg-red-950/10 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-500/10 hover:border-red-500/30 dark:hover:bg-red-900/20 transition-all duration-300 cursor-pointer shadow-sm dark:shadow-md"
                        title="Delete Project"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col min-h-0 w-full">
            <AdminBlogTab token={localStorage.getItem('adminPasscode')} />
          </div>
        )}
      </div>
    </div>
  );
};

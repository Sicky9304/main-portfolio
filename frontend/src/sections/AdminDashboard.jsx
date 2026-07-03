import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, ArrowLeft, Upload, FileText, Plus, Trash2, 
  Edit3, ExternalLink, Link2, Sparkles, RefreshCw, X, CheckCircle 
} from 'lucide-react';
import { Github } from '../components/ui/BrandIcons';
import { 
  createProject, updateProject, deleteProject, 
  updateProfile, uploadImage, fetchProjects, fetchProfile 
} from '../api/index.js';

export const AdminDashboard = () => {
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Dashboard states
  const [projects, setProjects] = useState([]);
  const [profile, setProfile] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
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

  // 1. Initial Authentication Check
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
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white px-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md bg-slate-900 border border-slate-800/80 rounded-3xl p-8 shadow-2xl text-center space-y-6"
        >
          <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary animate-pulse">
            <Lock size={32} />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">Sicky Admin Panel</h2>
            <p className="text-sm text-slate-400">Unlock to update portfolio projects and resume</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <input
              type="password"
              placeholder="Enter Admin Passcode"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              disabled={loading}
              className="w-full px-5 py-3.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-primary text-center text-lg tracking-wider focus:outline-none transition-colors"
            />
            {errorMsg && <p className="text-xs font-semibold text-red-400">{errorMsg}</p>}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-dark font-semibold text-white transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? <RefreshCw className="animate-spin" size={18} /> : 'Verify Access'}
            </button>
          </form>

          <button 
            onClick={navigateToHome}
            className="text-xs text-slate-500 hover:text-slate-400 flex items-center gap-1 mx-auto cursor-pointer"
          >
            <ArrowLeft size={12} /> Go back to website
          </button>
        </motion.div>
      </div>
    );
  }

  // RENDER: Admin Main Panel Dashboard
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 relative">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-900">
          <div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center gap-2">
              <Sparkles size={28} className="text-primary animate-spin-slow" /> Administrative Dashboard
            </h1>
            <p className="text-sm text-slate-500 font-mono mt-1">Authorized Session Active • Secure Storage Mode</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={navigateToHome}
              className="px-4 py-2.5 rounded-xl border border-slate-800 text-sm font-semibold hover:border-slate-700 transition-colors flex items-center gap-2 cursor-pointer bg-slate-900/50"
            >
              <ExternalLink size={14} /> Go to Site
            </button>
            <button 
              onClick={handleLogout}
              className="px-4 py-2.5 rounded-xl bg-red-950/40 border border-red-900/40 text-red-400 text-sm font-semibold hover:bg-red-950/60 transition-colors cursor-pointer"
            >
              Lock Panel
            </button>
          </div>
        </div>

        {/* Resume and Actions Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Resume Upload Module */}
          <div className="bg-slate-900/50 border border-slate-900 rounded-3xl p-6 md:col-span-1 space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-300">
              <FileText size={16} className="text-primary" /> Dynamic PDF Resume
            </div>
            
            <p className="text-xs text-slate-500 leading-relaxed">
              Upload your updated PDF resume. The PDF will be stored as binary base64 directly in the database.
            </p>

            <div 
              onClick={() => fileInputRef.current?.click()}
              className="h-32 border-2 border-dashed border-slate-800 hover:border-primary/40 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors hover:bg-slate-900/40"
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleResumeSelect}
                accept="application/pdf"
                className="hidden" 
              />
              <Upload size={24} className="text-slate-600 group-hover:text-primary" />
              <span className="text-xs text-slate-400 font-medium">
                {resumeFile ? resumeFile.name : 'Select Resume PDF'}
              </span>
            </div>

            {resumeError && <p className="text-xs text-red-400 font-semibold">{resumeError}</p>}
            
            {resumeFile && (
              <button 
                onClick={handleUploadResume}
                disabled={resumeStatus === 'uploading'}
                className="w-full py-2.5 rounded-xl bg-primary text-white font-semibold text-xs hover:bg-primary-dark transition-all cursor-pointer flex items-center justify-center gap-1.5"
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
              <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1 bg-emerald-950/20 p-2 rounded-lg border border-emerald-900/20">
                ✔️ Resume uploaded successfully!
              </p>
            )}

            {profile?.resumeBase64 && (
              <div className="pt-2 flex items-center justify-between border-t border-slate-950">
                <span className="text-xs text-slate-500 font-mono">Current PDF Available</span>
                <a 
                  href="/api/profile/resume" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-xs text-primary hover:underline flex items-center gap-1"
                >
                  View Current <Link2 size={10} />
                </a>
              </div>
            )}
          </div>

          {/* Quick Stats & Configs */}
          <div className="bg-slate-900/50 border border-slate-900 rounded-3xl p-6 md:col-span-2 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="text-sm font-bold text-slate-300 flex items-center gap-2">
                <Sparkles size={16} className="text-accent" /> Portfolio Summary
              </div>
              <p className="text-xs text-slate-500">Overview of configured resources.</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-900/60 text-center">
                  <span className="text-2xl font-black text-white">{projects.length}</span>
                  <span className="block text-[10px] text-slate-500 uppercase tracking-widest mt-1">Projects</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-900/60 text-center">
                  <span className="text-2xl font-black text-white">
                    {projects.filter(p => p.thumbnail).length}
                  </span>
                  <span className="block text-[10px] text-slate-500 uppercase tracking-widest mt-1">With Image</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-900/60 text-center">
                  <span className="text-xs font-mono text-emerald-400">Database Sync</span>
                  <span className="block text-[10px] text-slate-500 uppercase tracking-widest mt-2">Active</span>
                </div>
              </div>
            </div>
            
            <div className="pt-4 flex justify-between items-center border-t border-slate-950 mt-4">
              <span className="text-xs text-slate-500 font-mono">MongoDB + Cloudinary REST Services</span>
              <button 
                onClick={openCreateForm}
                className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-dark transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Plus size={14} /> Add New Project
              </button>
            </div>
          </div>
        </div>

        {/* Project Form Modal Overlay */}
        <AnimatePresence>
          {showForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden max-h-[90vh] overflow-y-auto"
              >
                {/* Header */}
                <div className="p-6 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
                  <h3 className="font-bold text-lg">
                    {isEditing ? `Edit Project: ${isEditing.title}` : 'Add New Project'}
                  </h3>
                  <button 
                    onClick={() => setShowForm(false)}
                    className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleProjectSubmit} className="p-6 space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">Project Title</label>
                      <input 
                        type="text" 
                        required
                        value={projectForm.title}
                        onChange={(e) => setProjectForm(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-primary focus:outline-none text-sm"
                        placeholder="e.g. AgriConnect"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">Project Slug (URL Path)</label>
                      <input 
                        type="text" 
                        required
                        value={projectForm.slug}
                        onChange={(e) => setProjectForm(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                        disabled={!!isEditing}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-primary focus:outline-none text-sm disabled:opacity-50"
                        placeholder="e.g. agriconnect"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">Tagline</label>
                      <input 
                        type="text" 
                        required
                        value={projectForm.tagline}
                        onChange={(e) => setProjectForm(prev => ({ ...prev, tagline: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-primary focus:outline-none text-sm"
                        placeholder="Connecting farmers to markets"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1.5">Emoji</label>
                        <input 
                          type="text" 
                          value={projectForm.emoji}
                          onChange={(e) => setProjectForm(prev => ({ ...prev, emoji: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-primary focus:outline-none text-sm text-center"
                          placeholder="🌱"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1.5">Display Order</label>
                        <input 
                          type="number" 
                          value={projectForm.order}
                          onChange={(e) => setProjectForm(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-primary focus:outline-none text-sm text-center"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Description</label>
                    <textarea 
                      required
                      rows={3}
                      value={projectForm.description}
                      onChange={(e) => setProjectForm(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-primary focus:outline-none text-sm"
                      placeholder="Detail what the project does..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">The Problem Solved (Case Study)</label>
                    <textarea 
                      rows={2}
                      value={projectForm.problem}
                      onChange={(e) => setProjectForm(prev => ({ ...prev, problem: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-primary focus:outline-none text-sm"
                      placeholder="What issue does this solve?"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">Tech Stack (comma separated)</label>
                      <input 
                        type="text" 
                        required
                        value={projectForm.tech}
                        onChange={(e) => setProjectForm(prev => ({ ...prev, tech: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-primary focus:outline-none text-sm"
                        placeholder="React.js, Node.js, Express.js, PostgreSQL"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">Key Features (comma separated)</label>
                      <input 
                        type="text" 
                        value={projectForm.features}
                        onChange={(e) => setProjectForm(prev => ({ ...prev, features: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-primary focus:outline-none text-sm"
                        placeholder="Marketplace, Soil Readings, Admin advice feed"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">GitHub Repository Link</label>
                      <input 
                        type="url" 
                        value={projectForm.github}
                        onChange={(e) => setProjectForm(prev => ({ ...prev, github: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-primary focus:outline-none text-sm"
                        placeholder="https://github.com/..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">Live Demo Link</label>
                      <input 
                        type="url" 
                        value={projectForm.demo}
                        onChange={(e) => setProjectForm(prev => ({ ...prev, demo: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-primary focus:outline-none text-sm"
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">Background Gradient</label>
                      <select 
                        value={projectForm.color}
                        onChange={(e) => setProjectForm(prev => ({ ...prev, color: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-primary focus:outline-none text-sm"
                      >
                        <option value="from-primary to-secondary">Cyan to Purple</option>
                        <option value="from-emerald-500 to-accent">Emerald to Cyan</option>
                        <option value="from-pink to-secondary">Pink to Purple</option>
                        <option value="from-accent to-primary">Cyan to Teal</option>
                        <option value="from-amber-400 to-red-500">Yellow to Red</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">Development Status</label>
                      <select 
                        value={projectForm.status}
                        onChange={(e) => setProjectForm(prev => ({ ...prev, status: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-primary focus:outline-none text-sm"
                      >
                        <option value="Completed">Completed</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Planned">Planned</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2 pt-6">
                      <input 
                        type="checkbox"
                        id="featured"
                        checked={projectForm.featured}
                        onChange={(e) => setProjectForm(prev => ({ ...prev, featured: e.target.checked }))}
                        className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-primary focus:ring-primary"
                      />
                      <label htmlFor="featured" className="text-xs font-semibold text-slate-400 cursor-pointer">Featured Project</label>
                    </div>
                  </div>

                  {/* Cloudinary Thumbnail Drag & Drop Uploader */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-400">
                      Thumbnail Image (Drag & Drop to Upload to Cloudinary)
                    </label>

                    <div className="grid grid-cols-4 gap-4 items-center">
                      <div className="col-span-3">
                        <div 
                          onDragEnter={handleDrag}
                          onDragOver={handleDrag}
                          onDragLeave={handleDrag}
                          onDrop={handleDrop}
                          onClick={() => document.getElementById('imageFileRef').click()}
                          className={`h-24 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors bg-slate-950/60 ${
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
                          <Upload size={18} className={`${uploadingImage ? 'animate-bounce' : ''} text-slate-500`} />
                          <span className="text-xs text-slate-400 font-medium">
                            {uploadingImage ? 'Uploading to Cloudinary...' : 'Drop image here or click to browse'}
                          </span>
                        </div>
                      </div>
                      <div className="col-span-1 h-24 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center relative">
                        {imagePreview ? (
                          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[10px] text-slate-600 font-mono text-center px-2">No Image</span>
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
                      className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-primary focus:outline-none text-xs"
                      placeholder="Or enter custom image URL directly"
                    />
                  </div>

                  {/* Form Footer */}
                  <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                    <button 
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-4 py-2 rounded-xl border border-slate-800 hover:border-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={loading || uploadingImage}
                      className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark font-semibold text-xs text-white transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      {loading ? <RefreshCw className="animate-spin" size={14} /> : 'Save Project'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Projects Listing */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-300 flex items-center gap-2">
              📂 Manage Projects ({projects.length})
            </h2>
            <button 
              onClick={openCreateForm}
              className="px-3.5 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
            >
              <Plus size={12} /> Add Project
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {projects.map((proj) => (
              <div 
                key={proj.slug}
                className="p-5 rounded-2xl bg-slate-900/40 border border-slate-900 hover:border-slate-800 transition-colors flex gap-4 items-center justify-between"
              >
                <div className="flex gap-4 items-center overflow-hidden">
                  <div className="w-16 h-12 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center flex-shrink-0">
                    {proj.thumbnail ? (
                      <img src={proj.thumbnail} alt={proj.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl">{proj.emoji || '🚀'}</span>
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="font-bold text-sm truncate">{proj.title}</h3>
                    <p className="text-xs text-slate-500 font-mono truncate">/{proj.slug}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 font-mono">Order: {proj.order}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                        proj.status === 'Completed' ? 'bg-emerald-950/20 text-emerald-400' : 'bg-amber-950/20 text-amber-400'
                      }`}>{proj.status}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => openEditForm(proj)}
                    className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-850 hover:border-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title="Edit Project"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button 
                    onClick={() => handleDeleteProject(proj.slug)}
                    className="p-2 rounded-lg bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 text-red-400 transition-colors cursor-pointer"
                    title="Delete Project"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

import { Plus, X, RefreshCw, CheckCircle } from 'lucide-react';

export const TechSkillsTab = ({
  techStack,
  setTechStack,
  newSkillCategory,
  setNewSkillCategory,
  newSkillName,
  setNewSkillName,
  newSkillLevel,
  setNewSkillLevel,
  techSaving,
  techSaveMsg,
  CATEGORY_DEFAULTS,
  onSave
}) => {
  return (
    <div className="space-y-6 pb-8">
      {/* Add New Skill Card */}
      <div className="glass border border-slate-200 dark:border-slate-800/80 rounded-3xl p-4 sm:p-6 shadow-lg">
        <div className="flex items-center gap-2 mb-1">
          <Plus size={15} className="text-primary" />
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">Add New Skill</h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
          Category select karo, skill naam aur proficiency level daalo.
        </p>

        {/* Form Grid — stacks on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {/* Category Dropdown */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Category
            </label>
            <select
              value={newSkillCategory}
              onChange={(e) => setNewSkillCategory(e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 rounded-xl bg-white/60 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-sm text-slate-800 dark:text-white focus:border-primary/50 focus:outline-none transition-all"
            >
              {CATEGORY_DEFAULTS.map((c) => (
                <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>
              ))}
            </select>
          </div>

          {/* Skill Name */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Skill Name
            </label>
            <input
              type="text"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
              placeholder="e.g. Next.js"
              className="w-full px-3 sm:px-4 py-2.5 rounded-xl bg-white/60 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-sm text-slate-800 dark:text-white focus:border-primary/50 focus:outline-none transition-all"
            />
          </div>

          {/* Level Slider */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Level — <span className="text-primary font-bold">{newSkillLevel}%</span>
            </label>
            <div className="flex items-center gap-3 pt-1">
              <input
                type="range"
                min={10} max={100} step={5}
                value={newSkillLevel}
                onChange={(e) => setNewSkillLevel(Number(e.target.value))}
                className="flex-1 accent-primary cursor-pointer h-2 touch-pan-x"
              />
              <span className="text-xs font-bold text-primary w-8 text-right shrink-0">{newSkillLevel}</span>
            </div>
          </div>
        </div>

        {/* Add Button — full width on mobile */}
        <button
          onClick={() => {
            if (!newSkillName.trim()) return;
            const catDefault = CATEGORY_DEFAULTS.find(c => c.id === newSkillCategory);
            setTechStack(prev => {
              const existing = prev.find(c => c.id === newSkillCategory);
              if (existing) {
                return prev.map(c =>
                  c.id === newSkillCategory
                    ? { ...c, skills: [...c.skills, { name: newSkillName.trim(), level: newSkillLevel }] }
                    : c
                );
              }
              return [...prev, { ...catDefault, skills: [{ name: newSkillName.trim(), level: newSkillLevel }] }];
            });
            setNewSkillName('');
            setNewSkillLevel(75);
          }}
          disabled={!newSkillName.trim()}
          className="mt-5 w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold hover:shadow-lg hover:shadow-primary/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 active:scale-95"
        >
          <Plus size={15} /> Add Skill
        </button>
      </div>

      {/* Existing Skills per Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CATEGORY_DEFAULTS.map((cat) => {
          const catData = techStack.find(c => c.id === cat.id);
          const skills = catData?.skills || [];
          return (
            <div key={cat.id} className="glass border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow">
              {/* Category Header */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-base">{cat.emoji}</span>
                <h4 className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200">{cat.label}</h4>
                <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-500 font-medium">
                  {skills.length} skills
                </span>
              </div>

              {/* Skills List */}
              {skills.length === 0 ? (
                <p className="text-[11px] text-slate-400 dark:text-slate-500 italic py-2">
                  Koi skill nahi — upar se add karo
                </p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((skill, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-lg bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-[11px] sm:text-xs font-medium text-slate-700 dark:text-slate-300 group"
                    >
                      <span className="truncate max-w-[90px] sm:max-w-none">{skill.name}</span>
                      <span className="text-primary font-bold shrink-0">{skill.level}%</span>
                      <button
                        onClick={() => setTechStack(prev => prev.map(c =>
                          c.id === cat.id
                            ? { ...c, skills: c.skills.filter((_, i) => i !== idx) }
                            : c
                        ))}
                        className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer p-0.5 rounded shrink-0"
                        title="Remove"
                      >
                        <X size={11} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Save Button Row — stacks on mobile */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-2">
        <button
          onClick={onSave}
          disabled={techSaving}
          className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-semibold text-sm hover:shadow-xl hover:shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 active:scale-95"
        >
          {techSaving ? <RefreshCw size={15} className="animate-spin" /> : <CheckCircle size={15} />}
          {techSaving ? 'Saving...' : 'Save to Backend'}
        </button>
        {techSaveMsg && (
          <span className={`text-xs sm:text-sm font-semibold ${
            techSaveMsg.startsWith('✅') ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'
          }`}>{techSaveMsg}</span>
        )}
      </div>
    </div>
  );
};

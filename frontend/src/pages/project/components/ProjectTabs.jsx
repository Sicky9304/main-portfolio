import { useState } from 'react';
import { Terminal, Award, GitBranch, AlertCircle, BookOpen } from 'lucide-react';
import { MarkdownRenderer } from '../../../components/ai/MarkdownRenderer';

export const ProjectTabs = ({ project }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'challenges', label: 'Challenges', icon: AlertCircle, enabled: !!project.challenges },
    { id: 'architecture', label: 'Architecture', icon: GitBranch, enabled: !!project.architecture },
    { id: 'code', label: 'Code Snippet', icon: Terminal, enabled: !!project.codeSnippet },
    { id: 'results', label: 'Key Results', icon: Award, enabled: !!project.results },
  ];

  const activeTabs = tabs.filter(t => t.enabled !== false);

  return (
    <div className="space-y-6">
      {/* Responsive Tab Selector */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 overflow-x-auto no-scrollbar pb-px">
        {activeTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 px-3 sm:px-4 text-xs sm:text-sm font-bold tracking-wide transition-all border-b-2 hover:text-primary cursor-pointer flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-slate-555 dark:text-slate-400'
              }`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="glass border border-slate-250 dark:border-slate-800/80 rounded-3xl p-5 sm:p-6 md:p-8 min-h-[300px] shadow-lg dark:shadow-xl hover:shadow-primary/5 transition-all duration-300">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-850 dark:text-slate-200 font-heading">
                About the Project
              </h3>
              <p className="text-xs sm:text-sm text-slate-650 dark:text-slate-350 leading-relaxed font-medium whitespace-pre-wrap">
                {project.description}
              </p>
            </div>

            {project.problem && (
              <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-900">
                <h3 className="text-base sm:text-lg font-bold text-slate-850 dark:text-slate-200 font-heading">
                  The Problem
                </h3>
                <p className="text-xs sm:text-sm text-slate-650 dark:text-slate-350 leading-relaxed font-medium whitespace-pre-wrap">
                  {project.problem}
                </p>
              </div>
            )}

            {project.features && project.features.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-900">
                <h3 className="text-base sm:text-lg font-bold text-slate-850 dark:text-slate-200 font-heading">
                  Key Features
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {project.features.map((feat, idx) => (
                    <li 
                      key={idx}
                      className="text-xs sm:text-sm text-slate-650 dark:text-slate-350 flex items-start gap-2 bg-slate-50 dark:bg-slate-950/40 p-3 rounded-xl border border-slate-150 dark:border-slate-900 shadow-sm"
                    >
                      <span className="text-primary mt-0.5">•</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === 'challenges' && project.challenges && (
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <MarkdownRenderer content={project.challenges} />
          </div>
        )}

        {activeTab === 'architecture' && project.architecture && (
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <MarkdownRenderer content={project.architecture} />
          </div>
        )}

        {activeTab === 'code' && project.codeSnippet && (
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-slate-850 dark:text-slate-200 font-heading">
              Core Technical Implementation
            </h3>
            <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 p-4 font-mono text-xs sm:text-sm leading-relaxed text-emerald-400 select-all shadow-inner">
              <pre className="whitespace-pre">{project.codeSnippet}</pre>
            </div>
          </div>
        )}

        {activeTab === 'results' && project.results && (
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <MarkdownRenderer content={project.results} />
          </div>
        )}
      </div>
    </div>
  );
};

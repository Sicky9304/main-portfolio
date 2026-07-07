import React, { useState, useEffect, useRef } from 'react';
import { Brain, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { askAi } from '../../../api/index.js';
import { MarkdownRenderer } from '../../../components/ai/MarkdownRenderer';

export const ProjectAiCompanion = ({ project }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const chatEndRef = useRef(null);

  // Initialize welcome message when project loaded
  useEffect(() => {
    if (project) {
      setChatMessages([
        {
          sender: 'ai',
          text: `Hello! I'm Sicky's digital twin AI assistant. I've analyzed the project **"${project.title}"**. Feel free to click any suggestion below or ask me about its architecture, implementation details, or tech stack!`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [project]);

  // Handle scroll lock when chat is open on mobile
  useEffect(() => {
    if (isChatOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isChatOpen]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  const askAIQuestion = async (questionText) => {
    if (isTyping || !questionText.trim()) return;

    const userMsg = {
      sender: 'user',
      text: questionText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setIsTyping(true);
    setInputValue('');

    try {
      const projectDetails = `
        Title: ${project.title}
        Tagline: ${project.tagline}
        Description: ${project.description}
        Problem: ${project.problem}
        Tech Stack: ${project.tech?.join(', ')}
        Challenges: ${project.challenges || ''}
        System Architecture: ${project.architecture || ''}
        Results: ${project.results || ''}
      `;

      const response = await askAi(
        questionText,
        { title: project.title, content: projectDetails },
        chatMessages
      );

      const aiResponseText = response?.text || "I'm sorry, I couldn't process your request at this time.";

      const aiMsg = {
        sender: 'ai',
        text: aiResponseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error('Error talking to AI helper:', err);
      const errorMsg = {
        sender: 'ai',
        text: "Sorry, I ran into an error connecting to the AI helper. Please make sure the Gemini API key is configured correctly.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const aiQuestions = [
    { id: 1, text: "Explain the architecture of this project" },
    { id: 2, text: "What tech stack was used and why?" },
    { id: 3, text: "What were the biggest challenges faced?" }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 text-slate-100 font-sans">
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsChatOpen(prev => !prev)}
        className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center shadow-lg hover:shadow-primary/30 active:scale-95 hover:scale-105 transition-all cursor-pointer relative group"
        title="Ask Project AI Assistant"
      >
        <Brain className={`w-5 h-5 ${isChatOpen ? 'rotate-12' : 'animate-pulse'}`} />
        <span className="absolute right-14 scale-0 group-hover:scale-100 bg-slate-950/80 border border-slate-900 px-2 py-1 rounded text-[10px] font-mono whitespace-nowrap shadow transition-all duration-300 pointer-events-none">
          AI Assistant
        </span>
      </button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isChatOpen && (
          <>
            {/* Backdrop for mobile to close when clicking outside */}
            <div
              onClick={() => setIsChatOpen(false)}
              className="fixed inset-0 bg-black/10 dark:bg-transparent z-[-1] backdrop-blur-[1px] md:backdrop-blur-none"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="absolute bottom-16 right-0 w-80 sm:w-96 h-[520px] rounded-3xl glass border border-slate-200 dark:border-slate-850 p-5 shadow-2xl flex flex-col overflow-hidden bg-white/90 dark:bg-slate-950/90"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-full blur-xl pointer-events-none" />

              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-250 dark:border-slate-900 pb-3 mb-3 flex-shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-center text-primary relative">
                    <Brain size={16} />
                    <span className="w-2 h-2 bg-emerald-500 rounded-full absolute top-[-1px] right-[-1px] border-2 border-slate-950"></span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider font-heading">Project AI Assistant</h4>
                    <p className="text-[8px] text-slate-500 font-mono">MODEL: GEMINI 2.5 FLASH</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 border border-transparent hover:border-slate-200 dark:hover:border-slate-850 text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Message Area */}
              <div
                onTouchMove={(e) => e.stopPropagation()}
                className="flex-1 overflow-y-auto overscroll-contain space-y-3 pr-1 text-left custom-scrollbar text-[11px] leading-relaxed mb-3"
              >
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col max-w-[85%] ${msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                  >
                    <div className={`p-3 rounded-2xl border ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-br from-primary/10 to-secondary/15 border-primary/20 text-slate-800 dark:text-white rounded-tr-none'
                        : 'bg-slate-100 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/80 text-slate-650 dark:text-slate-300 rounded-tl-none'
                    }`}>
                      <MarkdownRenderer content={msg.text} />
                    </div>
                    <span className="text-[8px] text-slate-500 font-mono mt-1 px-1">{msg.time}</span>
                  </div>
                ))}

                {isTyping && (
                  <div className="mr-auto items-start max-w-[85%] flex flex-col">
                    <div className="p-3 rounded-2xl rounded-tl-none bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Suggestions */}
              {chatMessages.length === 1 && (
                <div className="flex flex-col gap-1.5 mb-3 flex-shrink-0">
                  {aiQuestions.map((q) => (
                    <button
                      key={q.id}
                      onClick={() => askAIQuestion(q.text)}
                      className="text-left px-3 py-2 rounded-xl bg-slate-100 hover:bg-primary/10 dark:bg-slate-900/60 dark:hover:bg-primary/15 border border-slate-200 dark:border-slate-850 hover:border-primary/25 dark:hover:border-primary/25 text-slate-600 dark:text-slate-350 text-[10px] font-semibold transition-all cursor-pointer leading-normal"
                    >
                      {q.text}
                    </button>
                  ))}
                </div>
              )}

              {/* Input Area */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  askAIQuestion(inputValue);
                }}
                className="flex gap-2 flex-shrink-0 border-t border-slate-250 dark:border-slate-900 pt-3"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask about this project..."
                  className="flex-1 bg-slate-100 dark:bg-slate-900/60 border border-slate-250 dark:border-slate-800 focus:border-primary/45 rounded-xl px-3 text-xs text-slate-800 dark:text-white outline-none transition-colors"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/10 text-white transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer flex items-center justify-center"
                >
                  <Send size={12} />
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

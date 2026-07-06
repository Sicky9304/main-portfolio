import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, X, Send, MessageSquare, Sparkles } from 'lucide-react';
import { fetchProfile, fetchProjects, fetchServices, askAi } from '../../api/index.js';
import { MarkdownRenderer } from './MarkdownRenderer';

export const GlobalAIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "Hi there! I'm Sicky Kumar's AI Assistant. 🚀\n\nAsk me anything about Sicky's developer background, technical skills, featured portfolio projects, or client services!",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Context states loaded dynamically from the API
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);

  const chatEndRef = useRef(null);

  useEffect(() => {
    // Load portfolio context from database
    const loadPortfolioData = async () => {
      try {
        const [prof, proj, serv] = await Promise.all([
          fetchProfile().catch(() => null),
          fetchProjects().catch(() => []),
          fetchServices().catch(() => [])
        ]);
        setProfile(prof);
        setProjects(proj);
        setServices(serv);
      } catch (err) {
        console.error('Error fetching dynamic portfolio context for AI Assistant:', err);
      }
    };
    loadPortfolioData();
  }, []);

  // Auto-scroll on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Prevent background scrolling when chat panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Listen to external triggers (like Command Palette) to open/close chat panel
  useEffect(() => {
    const handleToggleChat = () => {
      setIsOpen((prev) => !prev);
    };
    window.addEventListener('toggle-ai-chat', handleToggleChat);
    return () => window.removeEventListener('toggle-ai-chat', handleToggleChat);
  }, []);

  const handleSendMessage = async (text) => {
    if (isTyping || !text.trim()) return;

    const userMsg = {
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);
    setInputValue('');

    try {
      // Assemble structured portfolio context for Gemini
      const contextPayload = {
        type: 'portfolio',
        profile: profile || { name: "Sicky Kumar", title: "Full Stack 3D AI MERN Developer" },
        projects: projects.map(p => ({
          title: p.title,
          tagline: p.tagline,
          description: p.description,
          tech: p.tech,
          demo: p.demo,
          github: p.github
        })),
        services: services.map(s => ({
          title: s.title,
          description: s.description,
          price: s.price
        }))
      };

      const res = await askAi(text, contextPayload, messages);
      const aiResponse = res?.text || "I'm sorry, I couldn't reach my brain at this moment.";

      const aiMsg = {
        sender: 'ai',
        text: aiResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error('Error communicating with Gemini portfolio assistant:', err);
      const errMsg = {
        sender: 'ai',
        text: "My apologies, I ran into an error connecting to Sicky's AI server. Please make sure the backend configuration is correct.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const suggestions = [
    "What is Sicky's tech stack?",
    "Recommend a MERN project",
    "What services does Sicky offer?",
    "How can I contact Sicky?"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center shadow-lg hover:shadow-primary/30 hover:scale-105 active:scale-95 transition-all cursor-pointer relative group"
        title="Ask Portfolio AI"
      >
        <Brain className={`w-5 h-5 ${isOpen ? 'rotate-12' : 'animate-pulse'}`} />
        <span className="absolute right-14 scale-0 group-hover:scale-100 bg-slate-950/80 border border-slate-900 px-2.5 py-1 rounded-xl text-[10px] font-mono whitespace-nowrap shadow transition-all duration-300 pointer-events-none">
          Ask Portfolio AI
        </span>
      </button>

      {/* Chat Assistant Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for mobile overlays */}
            <div 
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-transparent z-[-1]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="absolute bottom-16 right-0 w-80 h-[520px] rounded-3xl glass border border-slate-200 dark:border-slate-850 p-5 shadow-2xl flex flex-col overflow-hidden bg-white/90 dark:bg-slate-950/90 text-slate-800 dark:text-slate-100"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-secondary/10 rounded-full blur-xl pointer-events-none" />
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-250 dark:border-slate-900 pb-3 mb-3 flex-shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-center text-secondary relative">
                    <Brain size={16} />
                    <span className="w-2 h-2 bg-emerald-500 rounded-full absolute top-[-1px] right-[-1px] border-2 border-slate-950"></span>
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs font-bold uppercase tracking-wider font-heading">AI Portfolio Brain</h4>
                    <p className="text-[8px] text-slate-500 font-mono">MODEL: GEMINI 2.5 FLASH</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 border border-transparent hover:border-slate-200 dark:hover:border-slate-850 text-slate-400 hover:text-white transition-all cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Message History Area */}
              <div 
                onTouchMove={(e) => e.stopPropagation()}
                className="flex-1 overflow-y-auto overscroll-contain space-y-3 pr-1 text-left custom-scrollbar text-[11px] leading-relaxed mb-3"
              >
                {messages.map((msg, idx) => (
                  <div 
                    key={idx} 
                    className={`flex flex-col max-w-[85%] ${
                      msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                    }`}
                  >
                    <div className={`p-3 rounded-2xl ${
                      msg.sender === 'user' 
                        ? 'bg-gradient-to-r from-primary to-secondary text-white rounded-br-none' 
                        : 'bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-900 text-slate-800 dark:text-slate-300 rounded-bl-none shadow-sm'
                    }`}>
                      {msg.sender === 'user' ? (
                        <p>{msg.text}</p>
                      ) : (
                        <MarkdownRenderer content={msg.text} />
                      )}
                    </div>
                    <span className="text-[8px] text-slate-500 font-mono mt-1">{msg.time}</span>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-900 mr-auto text-slate-500 rounded-bl-none shadow-sm w-24">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Footer Controls */}
              <div className="pt-3 border-t border-slate-250 dark:border-slate-900 flex-shrink-0 space-y-3">
                {/* Suggestions Pill Deck */}
                <div className="text-left">
                  <span className="text-[8px] uppercase tracking-widest text-slate-500 font-bold block mb-1.5">Ask about:</span>
                  <div className="flex flex-wrap gap-1">
                    {suggestions.map((sug, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => handleSendMessage(sug)}
                        disabled={isTyping}
                        className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-950 hover:bg-slate-200 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-900 hover:border-primary/30 text-[9px] text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-all cursor-pointer disabled:opacity-40 whitespace-nowrap"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input field */}
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (inputValue.trim()) {
                      handleSendMessage(inputValue);
                    }
                  }}
                  className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-900 rounded-2xl p-1 flex-shrink-0"
                >
                  <input 
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask Sicky's portfolio AI..."
                    disabled={isTyping}
                    className="flex-1 bg-transparent border-none outline-none text-[10px] sm:text-[11px] px-2 text-slate-850 dark:text-white placeholder-slate-500 disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={isTyping || !inputValue.trim()}
                    className="w-7 h-7 rounded-xl bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-md transition-all active:scale-95 flex-shrink-0"
                  >
                    <Send size={11} />
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { Brain, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { askAi } from '../../api/index.js';
import { MarkdownRenderer } from '../ai/MarkdownRenderer';

export const BlogAiChatCompanion = ({ blog }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const chatEndRef = useRef(null);

  // Initialize welcome message when blog loaded
  useEffect(() => {
    if (blog) {
      setChatMessages([
        {
          sender: 'ai',
          text: `Hello! I'm your AI Reading Companion. I've analyzed "${blog.title}". Feel free to click any question below or ask me to explain this article!`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [blog]);

  // Handle scroll lock when chat is open
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

    try {
      const response = await askAi(
        questionText,
        { title: blog.title, content: blog.content },
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
        text: "Sorry, I ran into an error connecting to the AI brain. Please make sure the Gemini API key is configured correctly.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const aiQuestions = [
    { id: 1, text: "Give me a summary of this article" },
    { id: 2, text: "What are the core technical terms?" },
    { id: 3, text: "Main takeaway from the author" }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 text-slate-100 font-sans">
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsChatOpen(prev => !prev)}
        className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center shadow-lg hover:shadow-primary/30 active:scale-95 hover:scale-105 transition-all cursor-pointer relative group"
        title="Ask AI Companion"
      >
        <Brain className={`w-5 h-5 ${isChatOpen ? 'rotate-12' : 'animate-pulse'}`} />
        <span className="absolute right-14 scale-0 group-hover:scale-100 bg-slate-950/80 border border-slate-900 px-2 py-1 rounded text-[10px] font-mono whitespace-nowrap shadow transition-all duration-300 pointer-events-none">
          AI Companion
        </span>
      </button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isChatOpen && (
          <>
            {/* Backdrop for mobile to close when clicking outside */}
            <div
              onClick={() => setIsChatOpen(false)}
              className="fixed inset-0 bg-transparent z-[-1]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="absolute bottom-16 right-0 w-80 h-[520px] rounded-3xl glass border border-slate-200 dark:border-slate-850 p-5 shadow-2xl flex flex-col overflow-hidden bg-white/85 dark:bg-slate-950/85"
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
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider font-heading">AI Companion</h4>
                    <p className="text-[8px] text-slate-500 font-mono">MODEL: GEMINI 2.5 FLASH</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 border border-transparent hover:border-slate-200 dark:hover:border-slate-850 text-slate-400 hover:text-white transition-all cursor-pointer"
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
                    <div className={`p-3 rounded-2xl ${msg.sender === 'user'
                      ? 'bg-gradient-to-r from-primary to-secondary text-white rounded-br-none'
                      : 'bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-900 text-slate-800 dark:text-slate-350 rounded-bl-none shadow-sm'}`}
                    >
                      {msg.sender === 'user' ? (
                        msg.text.split('\n').map((line, lIdx) => (
                          <p key={lIdx} className="mb-1 last:mb-0">{line}</p>
                        ))
                      ) : (
                        <MarkdownRenderer content={msg.text} />
                      )}
                    </div>
                    <span className="text-[8px] text-slate-550 font-mono mt-1">{msg.time}</span>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-900 mr-auto text-slate-555 rounded-bl-none shadow-sm w-24">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Footer Controls (Suggestions + Custom Input) */}
              <div className="pt-3 border-t border-slate-250 dark:border-slate-900 flex-shrink-0 space-y-3">
                {/* Suggestions list */}
                <div className="text-left">
                  <span className="text-[8px] uppercase tracking-widest text-slate-500 font-bold block mb-1.5">Suggestions:</span>
                  <div className="flex flex-wrap gap-1">
                    {aiQuestions.map(q => (
                      <button
                        key={q.id}
                        onClick={() => askAIQuestion(q.text)}
                        disabled={isTyping}
                        className="px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-950 hover:bg-slate-200 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-900 hover:border-primary/30 text-[9px] text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-all cursor-pointer disabled:opacity-40 whitespace-nowrap"
                      >
                        {q.text}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Send form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (inputValue.trim()) {
                      askAIQuestion(inputValue);
                      setInputValue('');
                    }
                  }}
                  className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-900 rounded-2xl p-1 flex-shrink-0"
                >
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask anything about this post..."
                    disabled={isTyping}
                    className="flex-1 bg-transparent border-none outline-none text-[10px] sm:text-[11px] px-2 text-slate-800 dark:text-white placeholder-slate-500 disabled:opacity-50"
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

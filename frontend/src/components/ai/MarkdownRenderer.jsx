import React, { useState, useEffect } from 'react';
import { Check, Copy, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const MarkdownRenderer = ({ content }) => {
  const [activeImage, setActiveImage] = useState(null);

  // Prevent background scrolling when image lightbox is open
  useEffect(() => {
    if (activeImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeImage]);

  if (!content) return null;

  // Split content by code blocks: ```code```
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-3 font-sans text-xs sm:text-sm relative">
      {parts.map((part, index) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          // Code block parser
          const lines = part.slice(3, -3).trim().split('\n');
          const language = lines[0].match(/^[a-zA-Z0-9]+$/) ? lines[0] : '';
          const code = language ? lines.slice(1).join('\n') : lines.join('\n');
          
          return <CodeBlock key={index} code={code} language={language} />;
        }

        // Parse standard text line-by-line
        const lines = part.split('\n');
        return lines.map((line, lIdx) => {
          const trimmed = line.trim();
          if (!trimmed) return <div key={`empty-${lIdx}`} className="h-1.5" />;

          // Images
          if (trimmed.startsWith('![') && trimmed.endsWith(')')) {
            const match = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
            if (match) {
              const [, alt, src] = match;
              return (
                <div key={lIdx} className="my-6 w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-2 shadow-sm">
                  <img 
                    src={src} 
                    alt={alt} 
                    onClick={() => setActiveImage({ src, alt })}
                    className="w-full h-auto object-cover max-h-[380px] rounded-xl hover:scale-[1.01] transition-transform duration-500 cursor-zoom-in" 
                    loading="lazy"
                  />
                  {alt && (
                    <span className="block text-[10px] sm:text-xs text-center text-slate-500 dark:text-slate-400 mt-2 font-mono italic">
                      {alt}
                    </span>
                  )}
                </div>
              );
            }
          }

          // Headers
          if (trimmed.startsWith('# ')) {
            return (
              <h1 key={lIdx} className="text-base font-extrabold text-slate-900 dark:text-white mt-4 mb-2">
                {trimmed.slice(2)}
              </h1>
            );
          }
          if (trimmed.startsWith('## ')) {
            return (
              <h2 key={lIdx} className="text-sm font-bold text-slate-900 dark:text-white mt-3.5 mb-2">
                {trimmed.slice(3)}
              </h2>
            );
          }
          if (trimmed.startsWith('### ')) {
            return (
              <h3 key={lIdx} className="text-xs font-bold text-slate-900 dark:text-white mt-3 mb-1.5">
                {trimmed.slice(4)}
              </h3>
            );
          }

          // Bullet lists
          if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            return (
              <ul key={lIdx} className="list-disc list-inside space-y-1 my-1 pl-3">
                <li className="text-slate-600 dark:text-slate-300">
                  {parseInlineFormatting(trimmed.slice(2))}
                </li>
              </ul>
            );
          }

          // Standard paragraph with inline formatting
          return (
            <p key={lIdx} className="text-slate-600 dark:text-slate-300 leading-relaxed my-1 select-text">
              {parseInlineFormatting(trimmed)}
            </p>
          );
        });
      })}

      {/* Lightbox / Fullscreen Image Preview Modal */}
      <AnimatePresence>
        {activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveImage(null)}
            onTouchMove={(e) => e.stopPropagation()}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 touch-action-none overscroll-contain"
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-4 right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-all cursor-pointer shadow-lg z-10"
            >
              <X size={20} />
            </button>

            {/* Holographic Container */}
            <motion.div
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full flex flex-col items-center justify-center"
            >
              <img
                src={activeImage.src}
                alt={activeImage.alt}
                className="max-w-[90vw] max-h-[80vh] rounded-2xl object-contain shadow-2xl border border-slate-800 bg-slate-950/50"
              />
              {activeImage.alt && (
                <p className="text-xs sm:text-sm text-center text-slate-300 mt-3 font-mono font-semibold tracking-wider bg-slate-900/60 px-4 py-1.5 rounded-full border border-slate-800/80 max-w-[80vw] truncate">
                  {activeImage.alt}
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Helper to parse bold, italics, and inline code
const parseInlineFormatting = (text) => {
  if (!text) return "";
  
  // Split by inline code first: `code`
  const codeParts = text.split(/(`[^`]+`)/g);
  
  return codeParts.map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code 
          key={index} 
          className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-900 font-mono text-[10px] text-primary dark:text-primary-light"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    // Parse bold inside regular text parts: **text**
    const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
    return boldParts.map((bPart, bIndex) => {
      if (bPart.startsWith('**') && bPart.endsWith('**')) {
        return (
          <strong key={bIndex} className="font-extrabold text-slate-900 dark:text-white">
            {bPart.slice(2, -2)}
          </strong>
        );
      }

      // Parse single-star bold/italic: *text*
      const starParts = bPart.split(/(\*[^*]+\*)/g);
      return starParts.map((sPart, sIndex) => {
        if (sPart.startsWith('*') && sPart.endsWith('*')) {
          return (
            <em key={sIndex} className="font-semibold italic text-slate-800 dark:text-slate-200">
              {sPart.slice(1, -1)}
            </em>
          );
        }
        return sPart;
      });
    });
  });
};

// Sleek copyable Code Block component with custom safe syntax highlighting
const CodeBlock = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getHighlightedCode = () => {
    if (!code) return "";
    
    // Split code by lines
    const lines = code.split('\n');
    
    return lines.map((line, lineIdx) => {
      // Split the line into comments, strings, words, numbers, and operators
      const tokenRegex = /(\/\/.*|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`|[a-zA-Z_$][a-zA-Z0-9_$]*|\b\d+\b|[{}()\[\].,;+\-*\/%&|^!=<>?~:])/g;
      const tokens = line.split(tokenRegex);
      
      const jsKeywords = new Set([
        'const', 'let', 'var', 'function', 'return', 'import', 'export', 
        'from', 'default', 'class', 'extends', 'async', 'await', 
        'try', 'catch', 'new', 'throw', 'if', 'else', 'for', 'while', 
        'typeof', 'instanceof', 'switch', 'case', 'break', 'in', 'of'
      ]);
      
      const dbKeywords = new Set([
        'model', 'schema', 'type', 'required', 'default', 'unique', 
        'lowercase', 'trim', 'timestamps', 'enum'
      ]);
      
      const mernTerms = new Set([
        'MongoDB', 'Express', 'React', 'Node'
      ]);

      return (
        <div key={lineIdx} className="min-h-[1.2rem] whitespace-pre">
          {tokens.map((token, tokenIdx) => {
            if (!token) return null;
            
            // Comment
            if (token.startsWith('//')) {
              return <span key={tokenIdx} className="text-slate-500 italic">{token}</span>;
            }
            
            // String literal
            if ((token.startsWith('"') && token.endsWith('"')) || 
                (token.startsWith("'") && token.endsWith("'")) ||
                (token.startsWith('`') && token.endsWith('`'))) {
              return <span key={tokenIdx} className="text-emerald-400">{token}</span>;
            }
            
            // Numbers
            if (/^\d+$/.test(token)) {
              return <span key={tokenIdx} className="text-amber-400">{token}</span>;
            }
            
            // Keywords
            if (jsKeywords.has(token)) {
              return <span key={tokenIdx} className="text-pink font-bold">{token}</span>;
            }
            if (dbKeywords.has(token)) {
              return <span key={tokenIdx} className="text-primary-light font-semibold">{token}</span>;
            }
            if (mernTerms.has(token)) {
              return <span key={tokenIdx} className="text-cyan-450 font-bold">{token}</span>;
            }
            
            // Plain text
            return <span key={tokenIdx}>{token}</span>;
          })}
        </div>
      );
    });
  };

  return (
    <pre className="bg-slate-950 border border-slate-900 p-4 rounded-2xl font-mono text-[11px] sm:text-xs text-slate-200 w-full max-w-full overflow-x-auto my-3 select-all relative group text-left shadow-lg">
      <div className="flex justify-between items-center text-[9px] text-slate-400 border-b border-slate-900 pb-1.5 mb-2 font-sans select-none">
        <span className="uppercase font-bold tracking-wider">{language || 'code'}</span>
        <button 
          onClick={copy}
          className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 hover:text-white text-slate-400 transition-all cursor-pointer flex items-center gap-1"
        >
          {copied ? (
            <>
              <Check size={10} className="text-emerald-500" />
              <span className="text-emerald-500 font-bold">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={10} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <code>{getHighlightedCode()}</code>
    </pre>
  );
};

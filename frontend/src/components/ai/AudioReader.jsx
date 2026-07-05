import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, Sparkles, RefreshCw, Sliders, ChevronDown } from 'lucide-react';
import { translateText } from '../../api/index.js';

export const AudioReader = ({ text }) => {
  // Audio Player states
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [showSettings, setShowSettings] = useState(false);

  // Hindi translation states
  const [isHindiMode, setIsHindiMode] = useState(false);
  const [hindiTranslation, setHindiTranslation] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  // SpeechSynthesis Web Speech refs
  const audioIntervalRef = useRef(null);
  const utteranceRef = useRef(null);
  const currentCharIndexRef = useRef(0);

  // Voice list states
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);

  // Cleanup synthesis on unmount/slug change
  useEffect(() => {
    return () => {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  // Stop current speech if the text prop changes (e.g. navigation)
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    setAudioProgress(0);
    setIsPlaying(false);
    currentCharIndexRef.current = 0;
    utteranceRef.current = null;
    setHindiTranslation('');
    setIsHindiMode(false);
  }, [text]);

  // Load English and Hindi SpeechSynthesis voices available in browser
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;

    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      // Filter for English or Hindi voices
      const filteredVoices = allVoices.filter(v => v.lang.startsWith('en') || v.lang.startsWith('hi'));
      setVoices(filteredVoices);

      // Default selection logic
      if (filteredVoices.length > 0 && !selectedVoice) {
        // Prioritize Hindi if we are in Hindi mode, otherwise default premium English
        const langPrefix = isHindiMode ? 'hi' : 'en';
        const bestVoice = 
          filteredVoices.find(v => v.lang.startsWith(langPrefix) && v.name.toLowerCase().includes('natural')) ||
          filteredVoices.find(v => v.lang.startsWith(langPrefix) && v.name.toLowerCase().includes('google')) ||
          filteredVoices.find(v => v.lang.startsWith(langPrefix) && v.name.toLowerCase().includes('siri')) ||
          filteredVoices.find(v => v.lang.startsWith(langPrefix)) ||
          filteredVoices[0];
        
        setSelectedVoice(bestVoice);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, [isHindiMode]);

  // Strip Markdown markers to ensure smooth text-to-speech reading
  const cleanTextForSpeech = (rawText) => {
    if (!rawText) return '';
    let cleaned = rawText;
    cleaned = cleaned.replace(/```[\s\S]*?```/g, ''); // strip block code
    cleaned = cleaned.replace(/`([^`]+)`/g, '$1'); // strip inline code
    cleaned = cleaned.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    cleaned = cleaned.replace(/<\/?[^>]+(>|$)/g, ''); // strip HTML tags
    cleaned = cleaned.replace(/^#+\s+/gm, ''); // strip headers
    cleaned = cleaned.replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1'); // strip bold/italics
    cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); // strip links
    cleaned = cleaned.replace(/^[-*+]\s+/gm, ''); // strip bullets
    cleaned = cleaned.replace(/^\d+\.\s+/gm, ''); // strip numbers
    return cleaned.trim();
  };

  // Speaks using browser speech synthesis
  const startSpeech = (startIndex = 0) => {
    if (!('speechSynthesis' in window)) return;

    if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    window.speechSynthesis.cancel();

    // Determine target text
    const textToClean = isHindiMode ? (hindiTranslation || '') : (text || '');
    const fullText = cleanTextForSpeech(textToClean);
    if (!fullText) return;

    currentCharIndexRef.current = startIndex;

    const slicedText = fullText.slice(startIndex);
    const utterance = new SpeechSynthesisUtterance(slicedText);
    utteranceRef.current = utterance;

    utterance.rate = playbackSpeed;
    utterance.pitch = pitch;
    utterance.volume = volume;

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        const absoluteIndex = startIndex + event.charIndex;
        currentCharIndexRef.current = absoluteIndex;
        const progress = (absoluteIndex / fullText.length) * 100;
        setAudioProgress(progress);
      }
    };

    utterance.onend = () => {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
      if (utteranceRef.current !== utterance) return;

      const hasFinished = currentCharIndexRef.current >= (fullText.length - 15);
      if (hasFinished) {
        setIsPlaying(false);
        setAudioProgress(0);
        currentCharIndexRef.current = 0;
      } else {
        setIsPlaying(false);
      }
    };

    utterance.onerror = (e) => {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
      if (utteranceRef.current !== utterance) return;

      if (e.error === 'interrupted') {
        setIsPlaying(false);
        return;
      }
      console.error('SpeechSynthesis error:', e);
      setIsPlaying(false);
    };

    // Fallback timer to slide progress bar smoothly if onboundary events fail
    audioIntervalRef.current = setInterval(() => {
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        currentCharIndexRef.current = Math.min(
          currentCharIndexRef.current + (1.5 * playbackSpeed),
          fullText.length
        );
        const progress = (currentCharIndexRef.current / fullText.length) * 100;
        setAudioProgress(progress);
      }
    }, 100);

    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  const togglePlay = () => {
    if (!('speechSynthesis' in window)) {
      alert("Text-to-Speech is not supported in this browser.");
      return;
    }

    if (isPlaying) {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      startSpeech(currentCharIndexRef.current);
    }
  };

  // Re-trigger speech synthesis when parameters change mid-speech
  useEffect(() => {
    if (isPlaying) {
      startSpeech(currentCharIndexRef.current);
    }
  }, [playbackSpeed, selectedVoice, pitch, volume]);

  // Request Hindi translation via backend API
  const handleHindiTranslation = async () => {
    if (isTranslating) return;

    if (isHindiMode) {
      // Toggle back to English
      setIsHindiMode(false);
      if (isPlaying) {
        // Stop current play and trigger English Speech
        if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        // Let state settle, then resume in English
        setTimeout(() => startSpeech(0), 100);
      } else {
        setAudioProgress(0);
        currentCharIndexRef.current = 0;
      }
      return;
    }

    if (hindiTranslation) {
      // Already translated before, just activate Hindi mode
      setIsHindiMode(true);
      if (isPlaying) {
        if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        setTimeout(() => startSpeech(0), 100);
      } else {
        setAudioProgress(0);
        currentCharIndexRef.current = 0;
      }
      return;
    }

    // Call translation API
    setIsTranslating(true);
    try {
      const response = await translateText(text);
      if (response.success && response.text) {
        setHindiTranslation(response.text);
        setIsHindiMode(true);
        
        // Auto-select a Hindi voice actor if available
        const hiVoice = voices.find(v => v.lang.startsWith('hi'));
        if (hiVoice) {
          setSelectedVoice(hiVoice);
        }

        // Cancel previous play and trigger Hindi Speech
        if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        setAudioProgress(0);
        currentCharIndexRef.current = 0;

        setTimeout(() => startSpeech(0), 200);
      }
    } catch (err) {
      console.error('Failed to translate blog content:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="w-full rounded-2xl glass border border-slate-200 dark:border-slate-800/80 p-5 mt-4 text-left shadow-lg overflow-hidden bg-white/60 dark:bg-slate-950/60 relative">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        
        {/* Play/Pause controls & title */}
        <div className="flex items-center gap-4">
          <button
            onClick={togglePlay}
            disabled={isTranslating}
            className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center shadow-lg hover:shadow-primary/30 hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
          </button>
          
          <div>
            <span className="text-[10px] font-bold text-primary dark:text-primary-light uppercase tracking-widest block font-mono">
              AI Speech Synthesizer
            </span>
            <h3 className="text-sm font-bold text-slate-800 dark:text-white font-heading mt-0.5 flex items-center gap-1.5">
              Listen to Article
              {isHindiMode && (
                <span className="px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 rounded text-[9px] font-bold font-mono">
                  HINDI LITE
                </span>
              )}
            </h3>
          </div>
        </div>

        {/* Audio Waveform animation & configuration buttons */}
        <div className="flex items-center gap-3">
          {/* Translation button */}
          <button
            onClick={handleHindiTranslation}
            disabled={isTranslating}
            className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              isHindiMode
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/20'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
            }`}
          >
            {isTranslating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Translating...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                {isHindiMode ? 'Read in English' : 'Translate to Hindi'}
              </>
            )}
          </button>

          {/* Collapsible settings button */}
          <button
            onClick={() => setShowSettings(prev => !prev)}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
              showSettings
                ? 'bg-primary/10 border-primary/30 text-primary'
                : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900'
            }`}
            title="Audio Settings"
          >
            <Sliders size={15} />
          </button>

          {/* Speech animation waveform */}
          <div className="flex items-end gap-[3px] h-6 px-2">
            {[...Array(6)].map((_, i) => {
              const randomHeight = isPlaying ? [8, 20, 10, 18, 6, 22][i] : 6;
              return (
                <motion.div
                  key={i}
                  animate={{ height: isPlaying ? [6, randomHeight, 6] : 6 }}
                  transition={{
                    duration: 0.8 + i * 0.1,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-[3px] bg-gradient-to-t from-primary to-secondary rounded-full"
                />
              );
            })}
          </div>
        </div>

      </div>

      {/* Horizontal timeline bar */}
      <div className="w-full bg-slate-200 dark:bg-slate-850 h-1 rounded-full mt-4 overflow-hidden">
        <motion.div 
          className="bg-gradient-to-r from-primary to-secondary h-full origin-left"
          style={{ width: `${audioProgress}%` }}
          layoutId="timeline-progress"
        />
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-200 dark:border-slate-850 pt-4 mt-4 text-xs">
              
              {/* Voice selector */}
              <div className="flex flex-col gap-1.5 text-left">
                <label className="font-bold text-slate-500 font-mono tracking-wider uppercase text-[9px]">
                  Voice Actor Profile
                </label>
                <div className="relative">
                  <select
                    value={selectedVoice ? selectedVoice.name : ''}
                    onChange={(e) => {
                      const voice = voices.find(v => v.name === e.target.value);
                      if (voice) setSelectedVoice(voice);
                    }}
                    className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 font-medium cursor-pointer focus:outline-none appearance-none pr-8"
                  >
                    {voices.map((voice) => (
                      <option key={voice.name} value={voice.name}>
                        {voice.name} ({voice.lang})
                      </option>
                    ))}
                    {voices.length === 0 && (
                      <option value="">No custom voices loaded</option>
                    )}
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-3 top-2.5 pointer-events-none text-slate-500" />
                </div>
              </div>

              {/* Pitch, Volume, Speed sliders container */}
              <div className="grid grid-cols-3 gap-3">
                {/* Volume slider */}
                <div className="flex flex-col gap-1.5 text-left">
                  <label className="font-bold text-slate-500 font-mono tracking-wider uppercase text-[9px]">
                    Volume ({Math.round(volume * 100)}%)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-full accent-primary h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Pitch slider */}
                <div className="flex flex-col gap-1.5 text-left">
                  <label className="font-bold text-slate-500 font-mono tracking-wider uppercase text-[9px]">
                    Pitch ({pitch}x)
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    value={pitch}
                    onChange={(e) => setPitch(parseFloat(e.target.value))}
                    className="w-full accent-secondary h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Speed selector */}
                <div className="flex flex-col gap-1.5 text-left">
                  <label className="font-bold text-slate-500 font-mono tracking-wider uppercase text-[9px]">
                    Speed
                  </label>
                  <div className="relative">
                    <select
                      value={playbackSpeed}
                      onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                      className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1 text-slate-800 dark:text-slate-200 font-medium cursor-pointer focus:outline-none appearance-none pr-6"
                    >
                      <option value="0.5">0.5x</option>
                      <option value="0.75">0.75x</option>
                      <option value="1">1.0x</option>
                      <option value="1.25">1.25x</option>
                      <option value="1.5">1.5x</option>
                      <option value="2">2.0x</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-2 pointer-events-none text-slate-500" />
                  </div>
                </div>

              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

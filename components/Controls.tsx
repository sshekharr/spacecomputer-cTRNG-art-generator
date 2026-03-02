'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ControlsProps {
  onGenerate: (seed?: string) => void;
  onDownloadPNG: () => void;
  isLoading: boolean;
  generated: boolean;
  currentSeed: string | null;
}

export function Controls({ onGenerate, onDownloadPNG, isLoading, generated, currentSeed }: ControlsProps) {
  const [seedInput, setSeedInput] = useState('');
  const [showSeedInput, setShowSeedInput] = useState(false);
  const [copied, setCopied] = useState(false);

  // Sync seed input with URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlSeed = params.get('seed');
    if (urlSeed) {
      setSeedInput(urlSeed);
      onGenerate(urlSeed);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGenerate = () => {
    const seed = showSeedInput && seedInput.trim() ? seedInput.trim() : undefined;
    onGenerate(seed);
  };

  const handleCopyLink = () => {
    if (!currentSeed) return;
    const url = new URL(window.location.href);
    url.searchParams.set('seed', currentSeed);
    navigator.clipboard.writeText(url.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Seed input toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowSeedInput(v => !v)}
          className="text-[11px] font-mono text-white/30 hover:text-white/60 transition-colors flex items-center gap-1.5"
        >
          <svg
            className={`w-3 h-3 transition-transform ${showSeedInput ? 'rotate-90' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          USE CUSTOM SEED
        </button>
      </div>

      {showSeedInput && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
        >
          <input
            type="text"
            value={seedInput}
            onChange={e => setSeedInput(e.target.value)}
            placeholder="Enter 64-char hex seed..."
            className="w-full px-4 py-2.5 rounded-xl glass font-mono text-xs text-white/70 
                       placeholder:text-white/20 outline-none focus:border-[#7c3aed]/60 
                       border border-transparent transition-colors"
          />
        </motion.div>
      )}

      {/* Main generate button */}
      <motion.button
        onClick={handleGenerate}
        disabled={isLoading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="relative w-full py-4 rounded-xl font-mono text-sm tracking-widest uppercase
                   btn-shine overflow-hidden transition-all duration-300 disabled:opacity-50
                   disabled:cursor-not-allowed"
        style={{
          background: isLoading
            ? 'linear-gradient(135deg, #1a0a2e, #0a1a2e)'
            : 'linear-gradient(135deg, #7c3aed, #2563eb, #7c3aed)',
          backgroundSize: '200% 100%',
          boxShadow: isLoading ? 'none' : '0 0 30px rgba(124,58,237,0.4), 0 0 60px rgba(124,58,237,0.1)',
        }}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2 text-white/60">
            <span className="inline-block w-3 h-3 border border-white/40 border-t-white/80 rounded-full animate-spin" />
            Fetching Cosmic Entropy...
          </span>
        ) : (
          <span className="text-white">
            {generated ? '⟳ REGENERATE' : '✦ GENERATE COSMIC ART'}
          </span>
        )}
      </motion.button>

      {/* Secondary actions */}
      {generated && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-2"
        >
          <button
            onClick={onDownloadPNG}
            className="flex-1 py-3 rounded-xl glass glass-hover font-mono text-xs 
                       text-white/60 hover:text-white transition-all duration-200
                       hover:border-white/20 border border-transparent btn-shine
                       flex items-center justify-center gap-2"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            PNG
          </button>

          <button
            onClick={handleCopyLink}
            className="flex-1 py-3 rounded-xl glass font-mono text-xs 
                       text-white/60 hover:text-white transition-all duration-200
                       hover:border-white/20 border border-transparent
                       flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <svg className="w-3.5 h-3.5 text-[#00ff9f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-[#00ff9f]">COPIED</span>
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                SHARE
              </>
            )}
          </button>
        </motion.div>
      )}
    </div>
  );
}

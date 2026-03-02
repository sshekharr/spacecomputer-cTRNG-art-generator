'use client';

import { RefObject } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ArtCanvasProps {
  canvasRef: RefObject<HTMLCanvasElement>;
  isLoading: boolean;
  generated: boolean;
}

function LoadingState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col items-center justify-center gap-6"
    >
      {/* Orbital rings */}
      <div className="relative w-20 h-20">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="absolute inset-0 rounded-full border border-[#7c3aed]/40"
            style={{
              animation: `spin ${3 + i}s linear infinite ${i % 2 === 0 ? '' : 'reverse'}`,
              transform: `scale(${1 + i * 0.25})`,
              borderTopColor: ['#7c3aed', '#00f5ff', '#ff2d78'][i],
            }}
          />
        ))}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-[#00f5ff] animate-pulse" />
        </div>
      </div>

      <div className="text-center space-y-1">
        <p className="font-mono text-xs text-white/60 tracking-widest uppercase">
          Harvesting Cosmic Entropy
        </p>
        <div className="flex gap-1 justify-center">
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-[#7c3aed]"
              style={{ animation: `pulse ${0.8 + i * 0.2}s ease-in-out infinite`, animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function PlaceholderState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 flex flex-col items-center justify-center gap-5 p-8"
    >
      {/* Orbit graphic */}
      <div className="relative w-32 h-32 opacity-30">
        <div className="absolute inset-0 rounded-full border border-white/20" />
        <div
          className="absolute inset-4 rounded-full border border-[#7c3aed]/40"
          style={{ animation: 'spin 12s linear infinite' }}
        />
        <div
          className="absolute inset-8 rounded-full border border-[#00f5ff]/30"
          style={{ animation: 'spin 8s linear infinite reverse' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-white/20" />
        </div>
        {/* Orbiting dot */}
        <div
          className="absolute w-2 h-2 rounded-full bg-[#7c3aed] top-1/2 -translate-y-1/2"
          style={{
            transformOrigin: '56px 1px',
            animation: 'spin 4s linear infinite',
            left: '50%',
          }}
        />
      </div>

      <div className="text-center space-y-2">
        <p className="font-display text-xl text-white/40 italic">
          Your cosmos awaits
        </p>
        <p className="font-mono text-[11px] text-white/25 tracking-wider uppercase">
          Generate to receive cosmic art
        </p>
      </div>
    </motion.div>
  );
}

export function ArtCanvas({ canvasRef, isLoading, generated }: ArtCanvasProps) {
  return (
    <div className="relative w-full aspect-square max-w-[600px] mx-auto">
      {/* Glow ring wrapper */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden">
        {generated && (
          <div
            className="absolute inset-0 opacity-50"
            style={{
              background: 'conic-gradient(from 0deg, #7c3aed, #00f5ff, #ff2d78, #ffd700, #7c3aed)',
              animation: 'spin 8s linear infinite',
              filter: 'blur(8px)',
              zIndex: 0,
            }}
          />
        )}
      </div>

      {/* Canvas container */}
      <div className="relative m-[2px] rounded-2xl overflow-hidden bg-void" style={{ zIndex: 1 }}>
        {/* Canvas element */}
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
          style={{
            opacity: generated && !isLoading ? 1 : 0,
            transition: 'opacity 0.6s ease',
          }}
        />

        {/* Overlay states */}
        <div className={`absolute inset-0 ${generated && !isLoading ? 'pointer-events-none' : ''}`}>
          <AnimatePresence mode="wait">
            {isLoading ? (
              <LoadingState key="loading" />
            ) : !generated ? (
              <PlaceholderState key="placeholder" />
            ) : null}
          </AnimatePresence>
        </div>

        {/* Edge vignette */}
        {generated && !isLoading && (
          <div
            className="absolute inset-0 pointer-events-none rounded-2xl"
            style={{
              boxShadow: 'inset 0 0 60px rgba(0,0,0,0.4)',
            }}
          />
        )}
      </div>
    </div>
  );
}

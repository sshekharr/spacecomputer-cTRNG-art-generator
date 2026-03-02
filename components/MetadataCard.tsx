'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { ArtState } from '@/hooks/useCosmicArt';

interface MetadataCardProps {
  state: ArtState;
  onExport: () => void;
}

function SourceBadge({ source, usedFallback }: { source: string; usedFallback: boolean }) {
  const configs: Record<string, { color: string; label: string; dot: string }> = {
    trng: { color: 'text-[#00ff9f]', label: 'SATELLITE cTRNG', dot: 'bg-[#00ff9f]' },
    aptosorbital: { color: 'text-[#00ff9f]', label: 'APTOS ORBITAL', dot: 'bg-[#00ff9f]' },
    ipfs: { color: 'text-[#00f5ff]', label: 'IPFS BEACON', dot: 'bg-[#00f5ff]' },
    'ipfs-beacon': { color: 'text-[#00f5ff]', label: 'IPFS BEACON', dot: 'bg-[#00f5ff]' },
    fallback: { color: 'text-[#ffd700]', label: 'LOCAL CRYPTO', dot: 'bg-[#ffd700]' },
    custom: { color: 'text-[#a855f7]', label: 'CUSTOM SEED', dot: 'bg-[#a855f7]' },
    derived: { color: 'text-[#00f5ff]', label: 'DERIVED cTRNG', dot: 'bg-[#00f5ff]' },
  };

  const cfg = configs[source] || { color: 'text-white', label: source.toUpperCase(), dot: 'bg-white' };

  return (
    <div className="flex items-center gap-2">
      <span className={`inline-block w-2 h-2 rounded-full ${cfg.dot} animate-pulse`} />
      <span className={`font-mono text-xs ${cfg.color} ${usedFallback ? 'opacity-70' : ''}`}>
        {cfg.label}
      </span>
      {usedFallback && (
        <span className="text-[10px] text-[#ffd700] opacity-70 font-mono">[FALLBACK]</span>
      )}
    </div>
  );
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] text-white/30 font-mono uppercase tracking-widest">{label}</span>
      <span className="text-xs text-white/80 font-mono break-all leading-relaxed">{value}</span>
    </div>
  );
}

export function MetadataCard({ state, onExport }: MetadataCardProps) {
  const { seed, source, provider, sequence, timestamp, usedFallback, style, palette, generated } = state;

  return (
    <AnimatePresence>
      {generated && seed && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="glass rounded-2xl p-5 space-y-4 w-full"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-1">Entropy Source</p>
              {source && <SourceBadge source={source} usedFallback={usedFallback} />}
            </div>
            <div className="text-right">
              <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-1">Style</p>
              <span className="text-xs font-mono text-[#a855f7] uppercase tracking-wide">
                {style || '—'}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-white/5" />

          {/* Seed */}
          <DataRow
            label="Cosmic Seed"
            value={`${seed.slice(0, 16)}...${seed.slice(-8)}`}
          />

          {/* Metadata rows */}
          <div className="grid grid-cols-2 gap-3">
            {timestamp && (
              <DataRow
                label="Timestamp"
                value={new Date(timestamp).toISOString().slice(11, 23) + 'Z'}
              />
            )}
            {sequence && (
              <DataRow label="IPFS Sequence" value={sequence.toString()} />
            )}
            {provider && (
              <DataRow label="Provider" value={provider} />
            )}
          </div>

          {/* Palette */}
          {palette.length > 0 && (
            <div>
              <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-2">Palette</p>
              <div className="flex gap-1.5 flex-wrap">
                {palette.map((color, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-md border border-white/10"
                    style={{ background: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Export button */}
          <button
            onClick={onExport}
            className="w-full py-2 rounded-lg glass text-[11px] font-mono text-white/50 
                       hover:text-white/80 transition-colors duration-200 
                       hover:border-white/20 border border-transparent"
          >
            EXPORT METADATA JSON
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

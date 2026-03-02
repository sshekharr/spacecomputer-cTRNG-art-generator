'use client';

import { useState, useCallback, useRef } from 'react';
import type { RandomResponse } from '@/app/api/random/route';

export interface ArtState {
  seed: string | null;
  source: string | null;
  provider?: string;
  sequence?: number;
  timestamp: number | null;
  usedFallback: boolean;
  style: string | null;
  palette: string[];
  isLoading: boolean;
  error: string | null;
  generated: boolean;
}

const INITIAL_STATE: ArtState = {
  seed: null,
  source: null,
  provider: undefined,
  sequence: undefined,
  timestamp: null,
  usedFallback: false,
  style: null,
  palette: [],
  isLoading: false,
  error: null,
  generated: false,
};

export function useCosmicArt() {
  const [state, setState] = useState<ArtState>(INITIAL_STATE);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const generate = useCallback(async (customSeed?: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      let randomData: RandomResponse;

      if (customSeed) {
        randomData = {
          seed: customSeed,
          source: 'custom',
          timestamp: Date.now(),
          usedFallback: false,
        };
      } else {
        const res = await fetch('/api/random');
        if (!res.ok) throw new Error('Failed to fetch cosmic randomness');
        randomData = await res.json();
      }

      // Dynamic import art engine (client only)
      const { generateArt } = await import('@/lib/artEngine');

      if (!canvasRef.current) throw new Error('Canvas not ready');

      const config = generateArt(canvasRef.current, randomData.seed);

      setState({
        seed: randomData.seed,
        source: randomData.source,
        provider: randomData.provider,
        sequence: randomData.sequence,
        timestamp: randomData.timestamp,
        usedFallback: randomData.usedFallback,
        style: config.style,
        palette: config.palette,
        isLoading: false,
        error: null,
        generated: true,
      });

      // Update URL with seed
      const url = new URL(window.location.href);
      url.searchParams.set('seed', randomData.seed);
      window.history.replaceState({}, '', url.toString());

    } catch (err) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Unknown error',
      }));
    }
  }, []);

  const downloadPNG = useCallback(() => {
    if (!canvasRef.current || !state.seed) return;
    const link = document.createElement('a');
    link.download = `cosmic-art-${state.seed.slice(0, 8)}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  }, [state.seed]);

  const exportMetadata = useCallback(() => {
    if (!state.seed) return;
    const meta = {
      seed: state.seed,
      style: state.style,
      source: state.source,
      provider: state.provider,
      sequence: state.sequence,
      timestamp: state.timestamp,
      usedFallback: state.usedFallback,
      palette: state.palette,
      generated: new Date(state.timestamp || Date.now()).toISOString(),
    };
    const blob = new Blob([JSON.stringify(meta, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.download = `cosmic-art-metadata-${state.seed.slice(0, 8)}.json`;
    link.href = URL.createObjectURL(blob);
    link.click();
  }, [state]);

  return {
    state,
    canvasRef,
    generate,
    downloadPNG,
    exportMetadata,
  };
}

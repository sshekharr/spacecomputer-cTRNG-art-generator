'use client';

import { useMemo } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

export function StarField() {
  const stars = useMemo<Star[]>(() => {
    return Array.from({ length: 120 }, (_, i) => ({
      x: (i * 137.508 + 23) % 100,
      y: (i * 97.631 + 11) % 100,
      size: ((i * 53.7) % 2) + 0.3,
      duration: 2 + ((i * 31) % 5),
      delay: (i * 0.7) % 5,
      opacity: 0.2 + ((i * 0.13) % 0.6),
    }));
  }, []);

  const particles = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      x: (i * 157.3) % 100,
      size: 1 + ((i * 43) % 3),
      speed: 6 + ((i * 37) % 10),
      delay: (i * 1.3) % 8,
      drift: -30 + ((i * 53) % 60),
      color: ['#7c3aed', '#00f5ff', '#ff2d78', '#ffd700', '#00ff9f'][i % 5],
    }));
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Gradient backdrop */}
      <div className="absolute inset-0 bg-gradient-radial from-[#0a0a1a] via-[#030308] to-[#000000]" />

      {/* Subtle nebula glow */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 20% 30%, rgba(124, 58, 237, 0.3) 0%, transparent 70%),
            radial-gradient(ellipse 40% 60% at 80% 70%, rgba(0, 245, 255, 0.2) 0%, transparent 70%),
            radial-gradient(ellipse 50% 40% at 50% 50%, rgba(255, 45, 120, 0.1) 0%, transparent 70%)
          `,
        }}
      />

      {/* Stars */}
      {stars.map((star, i) => (
        <div
          key={i}
          className="star"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            '--duration': `${star.duration}s`,
            '--delay': `${star.delay}s`,
          } as React.CSSProperties}
        />
      ))}

      {/* Floating particles */}
      {particles.map((p, i) => (
        <div
          key={`p-${i}`}
          className="particle absolute rounded-full"
          style={{
            left: `${p.x}%`,
            bottom: '-4px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
            '--speed': `${p.speed}s`,
            '--delay': `${p.delay}s`,
            '--drift': `${p.drift}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

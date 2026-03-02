import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Space Future', 'Space Mono', 'monospace'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        void: '#030308',
        nebula: {
          50: '#f0e7ff',
          100: '#dfc9ff',
          200: '#c49bff',
          300: '#a855f7',
          400: '#8b22ff',
          500: '#7c3aed',
        },
        cosmic: {
          cyan: '#00f5ff',
          gold: '#ffd700',
          rose: '#ff2d78',
          green: '#00ff9f',
        }
      },
      animation: {
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}

export default config

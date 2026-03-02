'use client';

import { motion } from 'framer-motion';
import { StarField } from '@/components/StarField';
import { ArtCanvas } from '@/components/ArtCanvas';
import { MetadataCard } from '@/components/MetadataCard';
import { Controls } from '@/components/Controls';
import { useCosmicArt } from '@/hooks/useCosmicArt';

export default function HomePage() {
  const { state, canvasRef, generate, downloadPNG, exportMetadata } = useCosmicArt();

  return (
    <main className="min-h-screen relative noise scanlines">
      {/* Animated star background */}
      <StarField />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="pt-8 pb-4 px-6 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#fdd400]/80" />
            <span className="font-mono text-[10px] text-[#fdd400]/80 tracking-widest uppercase">
              SpaceComputer Orbitport
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#fdd400]/80" />
          </div>

          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-widest uppercase">
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 40%, #00f5ff 60%, #e0c3fc 100%)',
                backgroundSize: '200% auto',
                animation: 'shimmer 4s linear infinite',
              }}
            >
              COSMIC ART
            </span>
          </h1>

          <p className="mt-2 font-mono text-xs text-[#fdd400]/80 tracking-wider max-w-md mx-auto">
            True random generative art seeded from satellite-harvested cosmic radiation
          </p>
        </motion.header>

        {/* Main content grid */}
        <div className="flex-1 flex items-start justify-center px-4 pb-12">
          <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">

            {/* Canvas column */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-4"
            >
              <ArtCanvas
                canvasRef={canvasRef}
                isLoading={state.isLoading}
                generated={state.generated}
              />

              {/* Error display */}
              {state.error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass rounded-xl p-3 border border-[#ff2d78]/20"
                >
                  <p className="font-mono text-xs text-[#ff2d78]">⚠ {state.error}</p>
                </motion.div>
              )}
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-4"
            >
              {/* Controls */}
              <div className="glass rounded-2xl p-5">
                <h2 className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-4">
                  Art Generator
                </h2>
                <Controls
                  onGenerate={generate}
                  onDownloadPNG={downloadPNG}
                  isLoading={state.isLoading}
                  generated={state.generated}
                  currentSeed={state.seed}
                />
              </div>

              {/* Metadata */}
              <MetadataCard state={state} onExport={exportMetadata} />

              {/* Art style info */}
              {state.generated && state.style && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass rounded-2xl p-5"
                >
                  <h3 className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-3">
                    Generation Style
                  </h3>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex-shrink-0"
                      style={{
                        background: state.palette.length > 1
                          ? `linear-gradient(135deg, ${state.palette[1]}, ${state.palette[3] || state.palette[0]})`
                          : '#7c3aed',
                      }}
                    />
                    <div>
                      <p className="font-display text-sm uppercase tracking-widest text-white/90">{state.style?.replace(/_/g, ' ')}</p>
                      <p className="font-mono text-[10px] text-white/30 mt-0.5">
                        {STYLE_DESCRIPTIONS[state.style as keyof typeof STYLE_DESCRIPTIONS] || 'Generative art'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center pb-6 px-4">
          <p className="font-mono text-[10px] text-white/50 tracking-wider">
            Powered by{' '}
            <a
              href="https://spacecomputer.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#fdd400]/80 hover:text-[#fdd400] transition-colors"
            >
              SpaceComputer Orbitport
            </a>
            {' '}cTRNG · Cosmic True Random Number Generator
          </p>
        </footer>
      </div>
    </main>
  );
}

const STYLE_DESCRIPTIONS: Record<string, string> = {
  nebula: 'Deep space gas clouds & star fields',
  crystalline: 'Voronoi crystal lattice structures',
  flowfield: 'Perlin noise particle flow fields',
  mandala: 'Sacred geometry & radial symmetry',
  constellation: 'Connected star maps & nebulae',
  aurora: 'Northern lights curtain simulation',
  fractal: 'Julia set fractal exploration',
  supernova: 'Stellar explosion shock waves',
  blackhole: 'Event horizon & accretion disk',
  wormhole: 'Relativistic tunnel perspective',
  plasma: 'Multi-frequency sine interference',
  galaxy: 'Spiral arm star distribution',
  magnetar: 'Magnetic field line geometry',
  quasar: 'Active galactic nucleus jets',
  pulsar: 'Rotating neutron star beams',
  interference: 'Multi-source wave patterns',
  voronoi_lines: 'Crystalline cell boundaries',
  lissajous: 'Harmonic oscillator figures',
  spirograph: 'Hypotrochoid gear traces',
  trefoil: 'Three-lobed parametric curves',
  reaction_diffusion: 'Turing morphogenesis patterns',
  strange_attractor: 'Lorenz chaotic trajectory',
  penrose: 'Quasicrystal aperiodic tiling',
  celtic_knot: 'Interlaced knotwork geometry',
  amoeba: 'Organic cell colony growth',
  bioluminescence: 'Deep sea light organisms',
  coral: 'Recursive fractal reef growth',
  mycelium: 'Fungal network filaments',
  lightning: 'Recursive discharge branching',
  ice_crystal: 'Dendritic snowflake lattice',
  oil_slick: 'Thin-film iridescence blobs',
  chromatic_aberration: 'RGB channel displacement',
  glitch: 'Digital artifact corruption',
  circuit: 'PCB trace routing paths',
  datamosh: 'Video compression artifacts',
  watercolor: 'Wet-on-wet pigment diffusion',
  impressionist: 'Visible brushstroke textures',
  pointillist: 'Chromatic dot decomposition',
  chalkboard: 'Chalk drawing on slate',
  neon_sign: 'Glowing gas tube art',
  stained_glass: 'Lead-camed glass panels',
  topography: 'Elevation contour lines',
  geode: 'Crystal cave cross-section',
  'moiré': 'Overlapping interference grids',
  diffraction: 'Light grating patterns',
  hypercube: '4D tesseract projection',
  klein_bottle: 'Non-orientable surface',
  torus_knot: 'Toroidal knotted curves',
  rose_curve: 'Rhodonea polar flowers',
  epitrochoid: 'Outer roulette spirals',
  interference_rings: "Newton's ring patterns",
  bismuth: 'Stepped hopper crystal growth',
  soap_bubble: 'Iridescent thin film spheres',
  aurora_borealis: 'Mountain aurora landscape',
  dark_matter: 'Cosmic web filament halos',
};

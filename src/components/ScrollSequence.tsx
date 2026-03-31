'use client';

/**
 * ScrollSequence — Apple / Lusion-inspired premium scroll component
 *
 * Philosophy: Space, restraint, every element earns its place.
 * Think Apple.com, Lusion.co, Awwwards SOTD.
 *
 * Structure:
 *  - 600vh sticky section (inner 100vh)
 *  - Soft entry: opacity 0→1, scale 1.05→1, blur 8px→0 on entry
 *  - Image: centered, max-width 420px, mix-blend-mode screen — floats in space
 *  - Text: right of image, max-width 320px, gap ~8vw
 *  - Frames: odd-only (1,3,5...29) → 15 per product, 45 total
 *  - Crossfade A/B: 80ms ease-in-out
 *  - Scroll indicator: bottom-left, number + progress bar + rotated label
 *  - Particles: 40 max, opacity 0.04, radius 1px max
 *  - Product transitions: blur+opacity on image, staggered text
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// ─── GSAP plugin registration ─────────────────────────────────────────────────
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface Ingredient {
  name: string;
  dose: string;
}

interface FlavorData {
  id: number;
  name: string;
  label: string;
  accent: string;
  frameDir: string;
  accroche: string;
  ingredients: Ingredient[];
  ctaText: string;
}

// ─── Product data ─────────────────────────────────────────────────────────────
const FLAVORS: FlavorData[] = [
  {
    id: 0,
    name: 'Blue Razz',
    label: 'ELECTRIC PRE-WORKOUT',
    accent: '#4F9EF8',
    frameDir: '/images/Frames_blue',
    accroche: 'Laser focus. Explosive energy.',
    ingredients: [
      { name: 'Caffeine Anhydrous', dose: '200mg' },
      { name: 'L-Theanine',         dose: '150mg' },
      { name: 'Beta-Alanine',       dose: '2,000mg' },
      { name: 'Citrulline Malate',  dose: '4,000mg' },
      { name: 'Alpha GPC',          dose: '200mg' },
    ],
    ctaText: 'Shop Blue Razz →',
  },
  {
    id: 1,
    name: 'Mango',
    label: 'ELECTRIC PRE-WORKOUT',
    accent: '#F5B942',
    frameDir: '/images/Frames_orange',
    accroche: 'Tropical surge. Peak performance.',
    ingredients: [
      { name: 'Caffeine Anhydrous', dose: '200mg' },
      { name: 'Beta-Alanine',       dose: '2,500mg' },
      { name: 'Citrulline Malate',  dose: '6,000mg' },
      { name: 'Vitamin B6',         dose: '5mg' },
      { name: 'Vitamin B12',        dose: '100mcg' },
    ],
    ctaText: 'Shop Mango →',
  },
  {
    id: 2,
    name: 'Grape',
    label: 'ELECTRIC PRE-WORKOUT',
    accent: '#9B72F5',
    frameDir: '/images/Frames_purple',
    accroche: 'Dark focus. Night-mode power.',
    ingredients: [
      { name: 'Caffeine Anhydrous', dose: '200mg' },
      { name: 'L-Tyrosine',         dose: '1,000mg' },
      { name: 'Alpha GPC',          dose: '300mg' },
      { name: 'Citrulline Malate',  dose: '6,000mg' },
      { name: 'Grape Seed Extract', dose: '100mg' },
    ],
    ctaText: 'Shop Grape →',
  },
];

// ─── Frame configuration ──────────────────────────────────────────────────────
// Odd-only frames: 1, 3, 5, ... 29 → 15 frames per flavor
const FRAME_NUMBERS = Array.from({ length: 15 }, (_, i) => i * 2 + 1); // [1,3,5,...,29]
const FRAMES_PER_FLAVOR = FRAME_NUMBERS.length; // 15
const TOTAL_FRAMES = FRAMES_PER_FLAVOR * FLAVORS.length; // 45

// ─── Utility ──────────────────────────────────────────────────────────────────
function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

function getFramePath(globalIdx: number): string {
  const flavorIdx = Math.min(Math.floor(globalIdx / FRAMES_PER_FLAVOR), FLAVORS.length - 1);
  const localIdx  = globalIdx % FRAMES_PER_FLAVOR;
  const frameNum  = FRAME_NUMBERS[localIdx];
  return `${FLAVORS[flavorIdx].frameDir}/frame-${frameNum}.png`;
}

// ─── Particle canvas ──────────────────────────────────────────────────────────
interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  radius: number; opacity: number;
}

// ─── Framer Motion variants ───────────────────────────────────────────────────

/** Soft entry when section enters viewport */
const sectionEntryVariants = {
  hidden: {
    opacity: 0,
    scale: 1.05,
    filter: 'blur(8px)',
  },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number], // expo approximation
    },
  },
};

/** Image block: blur+opacity transition on flavor change */
const imageVariants = {
  enter: {
    opacity: 0,
    filter: 'blur(4px)',
  },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.5,
      delay: 0.2,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
  exit: {
    opacity: 0,
    filter: 'blur(4px)',
    transition: {
      duration: 0.5,
      ease: [0.55, 0, 1, 0.45] as [number, number, number, number],
    },
  },
};

/** Text stagger container */
const textContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.3,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.03,
    },
  },
};

/** Each text line: y + opacity */
const textLineVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
  exit: {
    y: -10,
    opacity: 0,
    transition: {
      duration: 0.25,
      ease: [0.55, 0, 1, 0.45] as [number, number, number, number],
    },
  },
};

// ─── Main Component ───────────────────────────────────────────────────────────
export function ScrollSequence() {
  const sectionRef  = useRef<HTMLElement>(null);
  const innerRef    = useRef<HTMLDivElement>(null);
  const canvasRef   = useRef<HTMLCanvasElement>(null);

  // Track accent color for particles via ref (avoids stale closure)
  const accentRef         = useRef<string>(FLAVORS[0].accent);
  const scrollVelocityRef = useRef<number>(0);

  // ─── Frame & flavor state ─────────────────────────────────────────────────
  const [flavorIndex, setFlavorIndex] = useState(0);

  // ─── Crossfade A/B state ──────────────────────────────────────────────────
  const [slotA, setSlotA]               = useState<string>('');
  const [slotB, setSlotB]               = useState<string>('');
  const [slotAOpacity, setSlotAOpacity] = useState(1);
  const [slotBOpacity, setSlotBOpacity] = useState(0);
  const activeSlotRef                   = useRef<'A' | 'B'>('A');
  const lastFrameRef                    = useRef<number>(-1);
  const crossfadeTimer                  = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── Progress within current flavor (0–1) ────────────────────────────────
  const [flavorProgress, setFlavorProgress] = useState(0);

  // ─── Section in-view trigger for entry animation ──────────────────────────
  const isInView = useInView(sectionRef, { once: true, amount: 0.05 });

  // ─── Preload: only odd frames for all flavors ─────────────────────────────
  const [loadedCount, setLoadedCount]   = useState(0);
  const [allLoaded, setAllLoaded]       = useState(false);
  const [loaderFading, setLoaderFading] = useState(false);

  useEffect(() => {
    let loaded = 0;
    const total = TOTAL_FRAMES;

    FLAVORS.forEach((flavor) => {
      FRAME_NUMBERS.forEach((n) => {
        const img    = new Image();
        img.src      = `${flavor.frameDir}/frame-${n}.png`;
        const finish = () => {
          loaded++;
          setLoadedCount(loaded);
          if (loaded >= total) {
            setLoaderFading(true);
            setTimeout(() => setAllLoaded(true), 500);
          }
        };
        img.onload  = finish;
        img.onerror = finish;
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Init: set first frame in slot A ─────────────────────────────────────
  useEffect(() => {
    setSlotA(getFramePath(0));
    setSlotAOpacity(1);
  }, []);

  // ─── Crossfade frame update ───────────────────────────────────────────────
  const updateFrame = useCallback((globalIdx: number) => {
    if (globalIdx === lastFrameRef.current) return;
    lastFrameRef.current = globalIdx;

    const path = getFramePath(globalIdx);

    if (crossfadeTimer.current) clearTimeout(crossfadeTimer.current);

    if (activeSlotRef.current === 'A') {
      // Load into B, fade A→0 B→1
      setSlotB(path);
      setSlotBOpacity(1);
      setSlotAOpacity(0);
      crossfadeTimer.current = setTimeout(() => {
        activeSlotRef.current = 'B';
      }, 80);
    } else {
      // Load into A, fade B→0 A→1
      setSlotA(path);
      setSlotAOpacity(1);
      setSlotBOpacity(0);
      crossfadeTimer.current = setTimeout(() => {
        activeSlotRef.current = 'A';
      }, 80);
    }
  }, []);

  // ─── ScrollTrigger setup ──────────────────────────────────────────────────
  useEffect(() => {
    if (!sectionRef.current) return;

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.2,
      onUpdate: (self) => {
        const progress = self.progress; // 0 → 1

        // Map progress to global frame index (0–44)
        const globalIdx = Math.min(
          Math.floor(progress * TOTAL_FRAMES),
          TOTAL_FRAMES - 1
        );

        // Map to flavor index (0–2)
        const newFlavorIdx = Math.min(
          Math.floor(globalIdx / FRAMES_PER_FLAVOR),
          FLAVORS.length - 1
        );

        // Progress within current flavor (0–1)
        const withinFlavor = (progress * FLAVORS.length) - newFlavorIdx;
        setFlavorProgress(Math.max(0, Math.min(withinFlavor, 1)));

        // Update scroll velocity for particles
        scrollVelocityRef.current = self.getVelocity();

        // Update frame (crossfade)
        updateFrame(globalIdx);

        // Update flavor if changed
        if (newFlavorIdx !== flavorIndex) {
          setFlavorIndex(newFlavorIdx);
          accentRef.current = FLAVORS[newFlavorIdx].accent;
        }
      },
    });

    return () => trigger.kill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateFrame, flavorIndex]);

  // ─── Sync accent ref ──────────────────────────────────────────────────────
  useEffect(() => {
    accentRef.current = FLAVORS[flavorIndex].accent;
  }, [flavorIndex]);

  // ─── Cleanup crossfade timer ──────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (crossfadeTimer.current) clearTimeout(crossfadeTimer.current);
    };
  }, []);

  // ─── Particle canvas RAF ──────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const PARTICLE_COUNT = 40; // reduced for subtlety

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Seed particles
    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => ({
      x:       Math.random() * canvas.width,
      y:       Math.random() * canvas.height,
      vx:      (Math.random() - 0.5) * 0.25,
      vy:      Math.random() * 0.18 + 0.04,
      radius:  Math.random() * 0.8 + 0.2, // max 1px
      opacity: Math.random() * 0.03 + 0.01, // max 0.04
    }));

    let rafId: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const [r, g, b] = hexToRgb(accentRef.current);
      const velocity  = Math.abs(scrollVelocityRef.current);
      const boost     = Math.min(velocity / 1000, 1);

      for (const p of particles) {
        p.y += p.vy * (1 + boost * 4);
        p.x += p.vx;

        // Wrap
        if (p.y > canvas.height + 2) p.y = -2;
        if (p.x < -2) p.x = canvas.width + 2;
        if (p.x > canvas.width + 2) p.x = -2;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${p.opacity})`;
        ctx.fill();
      }

      rafId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // ─── Derived values ───────────────────────────────────────────────────────
  const flavor       = FLAVORS[flavorIndex];
  const loadPercent  = Math.round((loadedCount / TOTAL_FRAMES) * 100);
  const productLabel = String(flavorIndex + 1).padStart(2, '0');

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Preload progress bar (bottom, 2px) ─────────────────────────── */}
      {!allLoaded && (
        <div
          style={{
            position: 'fixed',
            bottom: 0, left: 0,
            width: '100%', height: '2px',
            zIndex: 9999,
            background: 'rgba(255,255,255,0.06)',
            opacity: loaderFading ? 0 : 1,
            transition: 'opacity 0.5s ease',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${loadPercent}%`,
              background: flavor.accent,
              transition: 'width 0.1s linear',
            }}
          />
        </div>
      )}

      {/* ── Sticky section — 600vh ──────────────────────────────────────── */}
      <section
        ref={sectionRef}
        style={{ height: '600vh', position: 'relative' }}
        aria-label="Axion flavor showcase"
      >
        {/* ── Sticky inner — 100vh ──────────────────────────────────────── */}
        <div
          ref={innerRef}
          style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            overflow: 'hidden',
            background: '#050505', // premium near-black
          }}
        >
          {/* ── Soft entry animation wrapper ─────────────────────────────── */}
          <motion.div
            variants={sectionEntryVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            style={{ position: 'absolute', inset: 0 }}
          >
            {/* ── Particle canvas (background layer) ──────────────────────── */}
            <canvas
              ref={canvasRef}
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                zIndex: 0, pointerEvents: 'none',
              }}
            />

            {/* ── Main layout: image + text ──────────────────────────────── */}
            <div
              style={{
                position: 'absolute', inset: 0,
                zIndex: 1,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                // gap ~8vw between image and text
                gap: '8vw',
                padding: '0 5vw',
              }}
            >
              {/* ── Image block ──────────────────────────────────────────── */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`img-${flavorIndex}`}
                  variants={imageVariants}
                  initial="enter"
                  animate="visible"
                  exit="exit"
                  style={{
                    // floats in space — not stretched
                    position: 'relative',
                    maxWidth: '420px',
                    width: '100%',
                    // aspect ratio: roughly square-ish for product bottle
                    aspectRatio: '3 / 4',
                    flexShrink: 0,
                  }}
                >
                  {/* Crossfade slot A */}
                  <img
                    src={slotA}
                    alt=""
                    aria-hidden="true"
                    draggable={false}
                    style={{
                      position: 'absolute',
                      top: 0, left: 0,
                      width: '100%', height: '100%',
                      objectFit: 'contain',
                      mixBlendMode: 'screen',
                      opacity: slotAOpacity,
                      transition: 'opacity 80ms ease-in-out',
                    }}
                  />
                  {/* Crossfade slot B */}
                  <img
                    src={slotB}
                    alt=""
                    aria-hidden="true"
                    draggable={false}
                    style={{
                      position: 'absolute',
                      top: 0, left: 0,
                      width: '100%', height: '100%',
                      objectFit: 'contain',
                      mixBlendMode: 'screen',
                      opacity: slotBOpacity,
                      transition: 'opacity 80ms ease-in-out',
                    }}
                  />
                </motion.div>
              </AnimatePresence>

              {/* ── Text block ───────────────────────────────────────────── */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`text-${flavorIndex}`}
                  variants={textContainerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  style={{
                    maxWidth: '320px',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0,
                  }}
                >
                  {/* Label: ELECTRIC PRE-WORKOUT */}
                  <motion.span
                    variants={textLineVariants}
                    style={{
                      fontFamily: '"DM Sans", sans-serif',
                      fontWeight: 300,
                      fontSize: '0.7rem',
                      letterSpacing: '0.25em',
                      textTransform: 'uppercase',
                      color: flavor.accent,
                      marginBottom: '0.75rem',
                      display: 'block',
                    }}
                  >
                    {flavor.label}
                  </motion.span>

                  {/* Product name */}
                  <motion.h2
                    variants={textLineVariants}
                    style={{
                      fontFamily: '"PP Neue Corp Wide", sans-serif',
                      fontWeight: 800,
                      fontSize: '3.2rem',
                      color: '#ffffff',
                      lineHeight: 1.0,
                      margin: 0,
                      marginBottom: '0.6rem',
                    }}
                  >
                    {flavor.name}
                  </motion.h2>

                  {/* Accroche */}
                  <motion.p
                    variants={textLineVariants}
                    style={{
                      fontFamily: '"DM Sans", sans-serif',
                      fontWeight: 300,
                      fontStyle: 'italic',
                      fontSize: '1rem',
                      color: 'rgba(255,255,255,0.6)',
                      margin: 0,
                      marginBottom: '1.5rem',
                      lineHeight: 1.5,
                    }}
                  >
                    {flavor.accroche}
                  </motion.p>

                  {/* Separator line */}
                  <motion.div
                    variants={textLineVariants}
                    style={{
                      width: '40px',
                      height: '1px',
                      background: flavor.accent,
                      marginBottom: '1.5rem',
                    }}
                  />

                  {/* Ingredient table */}
                  <motion.div
                    variants={textLineVariants}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 0,
                      marginBottom: '2rem',
                    }}
                  >
                    {flavor.ingredients.map((ing, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '0.45rem 0',
                          borderBottom: '1px solid rgba(255,255,255,0.06)',
                          cursor: 'default',
                          transition: 'color 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          // Hover: name + dose → 80% white
                          const divEl = e.currentTarget;
                          divEl.querySelectorAll('span').forEach((s: HTMLSpanElement) => {
                            s.style.color = 'rgba(255,255,255,0.8)';
                          });
                        }}
                        onMouseLeave={(e) => {
                          const divEl = e.currentTarget;
                          divEl.querySelectorAll('span').forEach((s: HTMLSpanElement) => {
                            s.style.color = 'rgba(255,255,255,0.5)';
                          });
                        }}
                      >
                        {/* Ingredient name */}
                        <span
                          style={{
                            fontFamily: '"DM Sans", sans-serif',
                            fontWeight: 400,
                            fontSize: '0.85rem',
                            color: 'rgba(255,255,255,0.5)',
                            transition: 'color 0.15s ease',
                          }}
                        >
                          {ing.name}
                        </span>
                        {/* Dose */}
                        <span
                          style={{
                            fontFamily: '"DM Sans", sans-serif',
                            fontWeight: 400,
                            fontSize: '0.85rem',
                            color: 'rgba(255,255,255,0.5)',
                            transition: 'color 0.15s ease',
                          }}
                        >
                          {ing.dose}
                        </span>
                      </div>
                    ))}
                  </motion.div>

                  {/* CTA */}
                  <motion.a
                    variants={textLineVariants}
                    href="#"
                    style={{
                      fontFamily: '"DM Sans", sans-serif',
                      fontWeight: 400,
                      fontSize: '0.8rem',
                      letterSpacing: '0.2em',
                      color: flavor.accent,
                      textDecoration: 'underline',
                      textDecorationColor: flavor.accent,
                      textDecorationThickness: '1px',
                      textUnderlineOffset: '3px',
                      alignSelf: 'flex-start',
                      transition: 'opacity 0.2s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.7'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
                  >
                    {flavor.ctaText}
                  </motion.a>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ── Scroll indicator — bottom-left ────────────────────────── */}
            <div
              style={{
                position: 'absolute',
                bottom: '2.5rem',
                left: '3rem',
                zIndex: 10,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-end',
                gap: '0.75rem',
              }}
              aria-label={`Product ${flavorIndex + 1} of ${FLAVORS.length}`}
            >
              {/* Product number */}
              <span
                style={{
                  fontFamily: '"PP Neue Corp Wide", sans-serif',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  color: 'rgba(255,255,255,0.3)',
                  lineHeight: 1,
                  letterSpacing: '0.05em',
                  marginBottom: '0.1rem',
                }}
              >
                {productLabel}
              </span>

              {/* Vertical progress bar */}
              <div
                style={{
                  width: '2px',
                  height: '60px',
                  background: 'rgba(255,255,255,0.15)',
                  position: 'relative',
                  borderRadius: '1px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0, left: 0,
                    width: '100%',
                    height: `${flavorProgress * 100}%`,
                    background: flavor.accent,
                    transition: 'height 0.1s linear, background 0.5s ease',
                    borderRadius: '1px',
                  }}
                />
              </div>

              {/* Rotated product name label */}
              <span
                style={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontWeight: 300,
                  fontSize: '0.7rem',
                  color: 'rgba(255,255,255,0.25)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  transform: 'rotate(90deg)',
                  transformOrigin: 'left bottom',
                  whiteSpace: 'nowrap',
                  // Offset to align nicely with the bar
                  position: 'relative',
                  left: '0.5rem',
                  bottom: '0.2rem',
                }}
              >
                {flavor.name}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Global styles for responsive + fonts ───────────────────────── */}
      <style>{`
        /* Mobile layout: image top, text below, centered */
        @media (max-width: 768px) {
          /* Override flex row → column */
          .axion-layout-inner {
            flex-direction: column !important;
            align-items: center !important;
            justify-content: flex-start !important;
            padding-top: 3rem !important;
            gap: 2rem !important;
          }
          .axion-image-wrap {
            max-width: 280px !important;
            aspect-ratio: 3 / 4 !important;
          }
          .axion-text-wrap {
            max-width: 90vw !important;
            text-align: center !important;
          }
          .axion-text-wrap a {
            align-self: center !important;
          }
          .axion-indicator {
            left: 1.5rem !important;
            bottom: 1.5rem !important;
          }
        }
      `}</style>
    </>
  );
}

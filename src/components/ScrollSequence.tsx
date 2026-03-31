/**
 * ScrollSequence — AXION Arc Cinématique
 *
 * Les 90 frames (3 produits × 30) défilent le long d'un arc de cercle
 * au scroll : entrée par la droite, sommet au centre, sortie par la gauche.
 * 6-7 vignettes sont visibles simultanément sur l'arc.
 *
 * Layout général :
 *   - Fond #000000
 *   - Section sticky height: 400vh
 *   - Vignettes fixes (280×400 desktop, 140×200 mobile)
 *   - Arc paramétrique : x = cx + R·cos(θ), y = cy + R·sin(θ)
 *   - mix-blend-mode: screen → zones sombres transparentes
 *   - Texte produit animé (Framer Motion AnimatePresence) à gauche
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger);

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const FRAMES_PER_FLAVOR = 30;
const TOTAL_FRAMES = 90; // 3 × 30

/** Maximum slots allocated in DOM — enough for desktop (7) + buffer */
const MAX_SLOTS = 7;

/** Angular separation between adjacent frame slots (degrees) */
const ANGLE_STEP_DEG = 24;

// ---------------------------------------------------------------------------
// Product / flavor data
// ---------------------------------------------------------------------------

interface Flavor {
  folder: string;
  name: string;
  subtitle: string;
  accent: string;
}

const FLAVORS: Flavor[] = [
  {
    folder: "Frames_blue",
    name: "Blue Razz",
    subtitle: "Electrifying Berry Burst",
    accent: "#3B82F6",
  },
  {
    folder: "Frames_orange",
    name: "Mango",
    subtitle: "Tropical Surge",
    accent: "#F0A830",
  },
  {
    folder: "Frames_purple",
    name: "Grape",
    subtitle: "Dark Grape Focus",
    accent: "#8B5CF6",
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build the full ordered list of frame image paths (1-indexed filenames) */
function buildFramePaths(): string[] {
  const paths: string[] = [];
  for (const flavor of FLAVORS) {
    for (let i = 1; i <= FRAMES_PER_FLAVOR; i++) {
      paths.push(`/images/${flavor.folder}/frame-${i}.png`);
    }
  }
  return paths;
}

/** Preload all frames into the browser cache. Calls onProgress after each load. */
function preloadAll(
  paths: string[],
  onProgress: (loaded: number) => void
): Promise<void> {
  let loaded = 0;
  return Promise.all(
    paths.map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new window.Image();
          const done = () => {
            loaded += 1;
            onProgress(loaded);
            resolve();
          };
          img.onload = done;
          img.onerror = done; // continue even if a frame is missing
          img.src = src;
        })
    )
  ).then(() => undefined);
}

// ---------------------------------------------------------------------------
// Responsive configuration (re-computed on resize)
// ---------------------------------------------------------------------------

interface ArcConfig {
  frameW: number;
  frameH: number;
  /** Arc radius in px */
  R: number;
  /** Horizontal center of arc in px */
  cx: number;
  /** Vertical center-anchor of arc in px (arc curves upward from here) */
  cy: number;
  /** Number of frames visible on each side of active frame */
  visibleRadius: number;
  /** Total visible slots = visibleRadius * 2 + 1 */
  visibleCount: number;
}

function getArcConfig(): ArcConfig {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const mobile = vw < 768;
  return {
    frameW: mobile ? 140 : 280,
    frameH: mobile ? 200 : 400,
    R: mobile ? vw * 0.9 : vw * 0.6,
    cx: vw / 2,
    cy: vh * 0.8,
    visibleRadius: mobile ? 2 : 3,
    visibleCount: mobile ? 5 : 7,
  };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ScrollSequence() {
  /** Outer scroll wrapper — 400vh */
  const wrapperRef = useRef<HTMLDivElement>(null);

  /** DOM refs for each arc frame slot */
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);

  /** Loading progress (0 → TOTAL_FRAMES) */
  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  /** Active flavor for product text */
  const [activeFlavor, setActiveFlavor] = useState<Flavor>(FLAVORS[0]);
  /** Key increment triggers AnimatePresence re-mount on flavor change */
  const [flavorKey, setFlavorKey] = useState(0);

  /** Tracks last flavor index to avoid redundant setState calls */
  const prevFlavorIdxRef = useRef<number>(0);

  useEffect(() => {
    const paths = buildFramePaths();

    // -----------------------------------------------------------------------
    // Phase 1 — Preload all frames
    // -----------------------------------------------------------------------
    preloadAll(paths, (n) => setLoadProgress(n)).then(() => {
      setIsLoaded(true);

      const wrapper = wrapperRef.current;
      if (!wrapper) return;

      // Responsive config (mutable, refreshed on resize)
      let cfg = getArcConfig();
      const onResize = () => {
        cfg = getArcConfig();
      };
      window.addEventListener("resize", onResize);

      // -------------------------------------------------------------------
      // Core arc update — called on every ScrollTrigger tick
      // -------------------------------------------------------------------
      const updateArc = (progress: number) => {
        // rawIndex: continuous float 0 → 89
        const rawIndex = progress * (TOTAL_FRAMES - 1);

        // Center frame index (integer, nearest frame)
        const centerIdx = Math.round(rawIndex);
        // Fractional offset: how far rawIndex is from centerIdx (-0.5 to +0.5)
        const frac = rawIndex - centerIdx;

        const { frameW, frameH, R, cx, cy, visibleRadius, visibleCount } = cfg;

        // -- Update product text --
        // Use clamped floor so the last frame doesn't overflow FLAVORS array
        const flavorIdx = Math.min(
          Math.floor(centerIdx / FRAMES_PER_FLAVOR),
          FLAVORS.length - 1
        );
        if (flavorIdx !== prevFlavorIdxRef.current) {
          prevFlavorIdxRef.current = flavorIdx;
          setActiveFlavor(FLAVORS[flavorIdx]);
          setFlavorKey(flavorIdx);
        }

        // -- Update each DOM slot --
        for (let i = 0; i < MAX_SLOTS; i++) {
          const slot = slotRefs.current[i];
          const img = imgRefs.current[i];
          if (!slot || !img) continue;

          // Hide slots beyond current visibleCount (mobile uses fewer)
          if (i >= visibleCount) {
            slot.style.opacity = "0";
            continue;
          }

          // Frame index this slot should display
          // slots 0..visibleCount-1 map to centerIdx-visR .. centerIdx+visR
          const frameIdx = centerIdx - visibleRadius + i;

          // Hide out-of-range frames (beginning / end of sequence)
          if (frameIdx < 0 || frameIdx >= TOTAL_FRAMES) {
            slot.style.opacity = "0";
            continue;
          }

          // Update image src (instant — image is preloaded)
          const newSrc = paths[frameIdx];
          if (img.src !== newSrc && !img.src.endsWith(newSrc)) {
            img.src = newSrc;
          }

          // Fractional offset of this slot from the continuous rawIndex
          // offset = 0 → sommet de l'arc; offset > 0 → droite; offset < 0 → gauche
          const offset = i - visibleRadius - frac;

          // Arc position (degrees → radians)
          // -90° = sommet de l'arc (haut), frames entrent par la droite (+offset)
          const angleDeg = -90 + offset * ANGLE_STEP_DEG;
          const angleRad = (angleDeg * Math.PI) / 180;
          const x = cx + R * Math.cos(angleRad);
          const y = cy + R * Math.sin(angleRad);

          // Scale & opacity: 1.2 at center → 0.7 at far edge
          const absOffset = Math.abs(offset);
          const normalized = Math.min(absOffset / visibleRadius, 1);
          const scale = 1.2 - normalized * 0.5; // 1.2 → 0.7
          const opacity = Math.max(0, 1 - normalized * 0.7); // 1.0 → 0.3

          // Z-index: active frame on top
          const zIndex = Math.round(20 - absOffset * 3);

          // Apply transforms directly (bypass React render cycle for perf)
          slot.style.width = `${frameW}px`;
          slot.style.height = `${frameH}px`;
          slot.style.transform = `translate(${x - frameW / 2}px, ${
            y - frameH / 2
          }px) scale(${scale.toFixed(4)})`;
          slot.style.opacity = opacity.toFixed(4);
          slot.style.zIndex = String(zIndex);
        }
      };

      // Initial render at progress = 0
      updateArc(0);

      // -------------------------------------------------------------------
      // ScrollTrigger wiring
      // -------------------------------------------------------------------
      const st = ScrollTrigger.create({
        trigger: wrapper,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => updateArc(self.progress),
      });

      // Cleanup
      return () => {
        st.kill();
        window.removeEventListener("resize", onResize);
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    /* 400vh scroll container — canvas sticks to viewport */
    <div
      ref={wrapperRef}
      className="relative"
      style={{ height: "400vh", backgroundColor: "#000000" }}
    >
      {/* Sticky viewport — fills screen height */}
      <div
        className="sticky top-0 w-full overflow-hidden"
        style={{ height: "100vh", backgroundColor: "#000000" }}
      >

        {/* ----------------------------------------------------------------
            Arc frame slots — absolutely positioned, updated via direct DOM
        ----------------------------------------------------------------- */}
        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{ pointerEvents: "none" }}
        >
          {Array.from({ length: MAX_SLOTS }, (_, i) => (
            <div
              key={i}
              ref={(el) => {
                slotRefs.current[i] = el;
              }}
              className="absolute"
              style={{
                /* Initial size; overridden per-tick for responsive */
                width: "280px",
                height: "400px",
                willChange: "transform, opacity",
                transformOrigin: "center center",
                opacity: 0,
              }}
            >
              {/* Frame image — mix-blend-mode: screen removes dark background */}
              <img
                ref={(el) => {
                  imgRefs.current[i] = el;
                }}
                alt=""
                draggable={false}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  mixBlendMode: "screen",
                  display: "block",
                  userSelect: "none",
                }}
              />
            </div>
          ))}
        </div>

        {/* ----------------------------------------------------------------
            Product text — left side, animated on flavor change
        ----------------------------------------------------------------- */}
        <div
          className="absolute z-20"
          style={{
            left: "clamp(1.5rem, 4vw, 5rem)",
            top: "50%",
            transform: "translateY(-50%)",
            maxWidth: "32vw",
            pointerEvents: "none",
          }}
        >
          {/*
            Stable anchor div always in DOM (satisfies layoutId rule).
            AnimatePresence handles enter/exit transitions inside.
          */}
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={flavorKey}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{
                  duration: 0.6,
                  ease: [0.25, 0.46, 0.45, 0.94] as [
                    number,
                    number,
                    number,
                    number
                  ],
                }}
              >
                {/* Subtitle — DM Sans 300, accent color */}
                <p
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontWeight: 300,
                    fontSize: "1.2rem",
                    color: activeFlavor.accent,
                    marginBottom: "1rem",
                    letterSpacing: "0.1em",
                  }}
                >
                  {activeFlavor.subtitle}
                </p>

                {/* Product name — PP Neue Corp Wide 800, ~8vw */}
                <h2
                  style={{
                    fontFamily: "'PP Neue Corp Wide', sans-serif",
                    fontWeight: 800,
                    fontSize: "clamp(2.5rem, 8vw, 9rem)",
                    color: "#FFFFFF",
                    lineHeight: 1,
                    textTransform: "uppercase",
                    margin: 0,
                  }}
                >
                  {activeFlavor.name}
                </h2>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ----------------------------------------------------------------
            Preload progress bar — thin line at bottom, accent-colored
        ----------------------------------------------------------------- */}
        {!isLoaded && (
          <div
            className="absolute bottom-0 left-0 right-0 z-50"
            style={{ height: "2px", backgroundColor: "#111111" }}
          >
            <div
              style={{
                height: "100%",
                width: `${(loadProgress / TOTAL_FRAMES) * 100}%`,
                backgroundColor: FLAVORS[0].accent,
                transition: "width 0.08s linear",
              }}
            />
          </div>
        )}

        {/* ----------------------------------------------------------------
            Bottom vignette — soften the lower edge into pure black
        ----------------------------------------------------------------- */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 right-0 pointer-events-none z-10"
          style={{
            height: "18%",
            background: "linear-gradient(to bottom, transparent, #000000)",
          }}
        />
      </div>
    </div>
  );
}

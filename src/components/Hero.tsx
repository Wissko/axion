/**
 * Hero
 * Full-viewport parallax hero with 4 depth layers.
 * Each layer moves at a different yPercent rate on scroll (Osmo-style),
 * creating a deep parallax illusion.
 *
 * Layer depths (back to front):
 *   0 — background gradient (yPercent 70)
 *   1 — mid-ground glow (yPercent 55)
 *   2 — lightning particles (yPercent 40)
 *   3 — title + tagline (yPercent 10)
 *
 * A fade-to-black gradient at the bottom transitions into ScrollSequence.
 */

"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LAYERS = [
  {
    depth: 0,
    yPercent: 70,
    className: "layer-0",
    style: {
      background:
        "radial-gradient(ellipse 120% 80% at 50% 60%, #1a1000 0%, #050505 100%)",
    },
  },
  {
    depth: 1,
    yPercent: 55,
    className: "layer-1",
    style: {
      background:
        "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(240,168,48,0.12) 0%, transparent 70%)",
    },
  },
  {
    depth: 2,
    yPercent: 40,
    className: "layer-2",
    style: {},
  },
  {
    depth: 3,
    yPercent: 10,
    className: "layer-3",
    style: {},
  },
];

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      layerRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.to(el, {
          yPercent: -LAYERS[i].yPercent,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 0,
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden"
      style={{ backgroundColor: "#050505" }}
    >
      {/* Layer 0 — deep background */}
      <div
        ref={(el) => {
          layerRefs.current[0] = el;
        }}
        className="absolute inset-0 will-change-transform"
        style={LAYERS[0].style}
      />

      {/* Layer 1 — electric glow pulse */}
      <div
        ref={(el) => {
          layerRefs.current[1] = el;
        }}
        className="absolute inset-0 will-change-transform"
        style={LAYERS[1].style}
      />

      {/* Layer 2 — lightning particle field */}
      <div
        ref={(el) => {
          layerRefs.current[2] = el;
        }}
        className="absolute inset-0 will-change-transform layer-lightning"
      >
        <LightningField />
      </div>

      {/* Layer 3 — title and tagline */}
      <div
        ref={(el) => {
          layerRefs.current[3] = el;
        }}
        className="absolute inset-0 will-change-transform flex flex-col items-center justify-center gap-4 z-10"
      >
        <img
          src="/images/products/AXION.PNG"
          alt="AXION"
          className="select-none"
          style={{
            width: "clamp(200px, 40vw, 500px)",
            height: "auto",
            objectFit: "contain",
            filter: "drop-shadow(0 0 80px rgba(240,168,48,0.35))",
          }}
        />
        <p
          className="tracking-widest uppercase"
          style={{
            fontFamily: "DM Sans, sans-serif",
            fontWeight: 300,
            fontSize: "clamp(0.85rem, 1.4vw, 1.25rem)",
            letterSpacing: "0.45em",
            color: "rgba(245,240,230,0.55)",
          }}
        >
          Focus + Drive
        </p>
      </div>

      {/* Black line overflow — 2px bottom border */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20"
        style={{ height: "2px", background: "#050505" }}
      />

      {/* Fade gradient to product sections */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none"
        style={{
          height: "35%",
          background:
            "linear-gradient(to bottom, transparent 0%, #050505 100%)",
        }}
      />
    </section>
  );
}

/**
 * LightningField
 * Pure CSS animated lightning bolts — no canvas, no JS animation loop.
 * Bolt paths are SVG polylines with opacity keyframe animations.
 */
function LightningField() {
  const bolts = [
    { x1: 48, y1: 5, x2: 44, y2: 35, x3: 50, y3: 60, delay: "0s", dur: "4s" },
    { x1: 52, y1: 0, x2: 56, y2: 28, x3: 50, y3: 50, delay: "1.5s", dur: "5s" },
    { x1: 35, y1: 10, x2: 38, y2: 40, x3: 42, y3: 70, delay: "0.8s", dur: "6s" },
    { x1: 65, y1: 8, x2: 62, y2: 38, x3: 58, y3: 65, delay: "2.2s", dur: "4.5s" },
  ];

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 100 100"
    >
      {bolts.map((b, i) => (
        <polyline
          key={i}
          points={`${b.x1},${b.y1} ${b.x2},${b.y2} ${b.x3},${b.y3}`}
          fill="none"
          stroke="#F0A830"
          strokeWidth="0.15"
          strokeLinecap="round"
          style={{
            opacity: 0,
            animation: `lightning-flash ${b.dur} ${b.delay} infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes lightning-flash {
          0%   { opacity: 0; }
          2%   { opacity: 0.9; }
          4%   { opacity: 0.1; }
          6%   { opacity: 0.7; }
          8%   { opacity: 0; }
          100% { opacity: 0; }
        }
      `}</style>
    </svg>
  );
}

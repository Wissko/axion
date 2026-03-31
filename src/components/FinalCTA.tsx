/**
 * FinalCTA
 * Closing section with the three product bottles side by side
 * and a pre-order call-to-action.
 * Uses Framer Motion for entrance animations.
 * layoutId is always present in DOM (opacity toggle, no conditional render).
 */

"use client";

import { motion } from "framer-motion";

const BOTTLES: { flavor: Flavor; accent: string; label: string }[] = [
  { flavor: "Blue Razz", accent: "#3B82F6", label: "Frames_blue" },
  { flavor: "Mango", accent: "#F0A830", label: "Frames_orange" },
  { flavor: "Grape", accent: "#8B5CF6", label: "Frames_purple" },
];

type Flavor = "Blue Razz" | "Mango" | "Grape";

export function FinalCTA() {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center gap-20 px-6"
      style={{ backgroundColor: "#0A0804" }}
    >
      {/* Top fade in from scroll sequence */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: "120px",
          background: "linear-gradient(to bottom, #0A0804, transparent)",
        }}
      />

      {/* Section headline */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      >
        <p
          className="uppercase tracking-widest mb-4"
          style={{
            fontFamily: "DM Sans, sans-serif",
            fontWeight: 300,
            fontSize: "clamp(0.7rem, 1vw, 0.9rem)",
            letterSpacing: "0.4em",
            color: "rgba(245,240,230,0.4)",
          }}
        >
          Three flavors. One mission.
        </p>
        <h2
          className="uppercase leading-none"
          style={{
            fontFamily: "PP Neue Corp Wide, sans-serif",
            fontWeight: 800,
            fontSize: "clamp(3rem, 8vw, 9rem)",
            color: "#F5F0E6",
          }}
        >
          Electric Pre
        </h2>
      </motion.div>

      {/* Bottle placeholders — always in DOM */}
      <div className="flex items-end justify-center gap-8 md:gap-14 w-full max-w-4xl">
        {BOTTLES.map((bottle, i) => (
          <motion.div
            key={bottle.label}
            layoutId={`bottle-${bottle.label}`}
            className="flex flex-col items-center gap-4"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
              duration: 0.8,
              delay: i * 0.12,
              ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
            }}
          >
            {/* Bottle placeholder */}
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                width: "clamp(80px, 12vw, 160px)",
                height: "clamp(200px, 30vw, 400px)",
                background: `linear-gradient(175deg, ${bottle.accent}18 0%, ${bottle.accent}06 100%)`,
                border: `1px solid ${bottle.accent}30`,
                boxShadow: `0 0 40px ${bottle.accent}20, inset 0 1px 0 ${bottle.accent}40`,
              }}
            >
              {/* Glow reflection line at top */}
              <div
                className="absolute top-0 left-0 right-0"
                style={{
                  height: "1px",
                  background: `linear-gradient(90deg, transparent, ${bottle.accent}80, transparent)`,
                }}
              />
              {/* AXION label stub */}
              <div
                className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-1"
              >
                <span
                  className="uppercase"
                  style={{
                    fontFamily: "PP Neue Corp Wide, sans-serif",
                    fontWeight: 800,
                    fontSize: "clamp(0.45rem, 0.9vw, 0.75rem)",
                    color: "#F5F0E6",
                    letterSpacing: "0.2em",
                  }}
                >
                  AXION
                </span>
                <div
                  style={{
                    width: "40%",
                    height: "1px",
                    background: `${bottle.accent}60`,
                  }}
                />
              </div>
            </div>

            {/* Flavor name */}
            <p
              className="uppercase tracking-widest text-center"
              style={{
                fontFamily: "DM Sans, sans-serif",
                fontWeight: 300,
                fontSize: "clamp(0.6rem, 0.85vw, 0.8rem)",
                letterSpacing: "0.3em",
                color: bottle.accent,
              }}
            >
              {bottle.flavor}
            </p>
          </motion.div>
        ))}
      </div>

      {/* CTA button */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{
          duration: 0.7,
          delay: 0.3,
          ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
        }}
      >
        <button
          className="group relative uppercase tracking-widest px-12 py-4 overflow-hidden"
          style={{
            fontFamily: "DM Sans, sans-serif",
            fontWeight: 400,
            fontSize: "clamp(0.75rem, 1vw, 0.9rem)",
            letterSpacing: "0.35em",
            color: "#0A0804",
            background: "#F0A830",
            border: "none",
            cursor: "pointer",
          }}
        >
          Pre-order Now
          {/* Hover shimmer */}
          <span
            className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
            style={{ background: "white" }}
          />
        </button>
      </motion.div>

      {/* Bottom padding */}
      <div style={{ height: "6rem" }} />
    </section>
  );
}

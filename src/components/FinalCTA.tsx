/**
 * FinalCTA — "Closing Statement"
 * Editorial luxury finale. No bottles, no glows, no gaming energy.
 * Inspired by Byredo, Le Labo, Aesop, Maison Margiela.
 * Reveal driven by useInView from Framer Motion.
 */

"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const FLAVORS: { name: string; accent: string }[] = [
  { name: "Blue Razz", accent: "#3B82F6" },
  { name: "Mango",     accent: "#F0A830" },
  { name: "Grape",     accent: "#8B5CF6" },
];

const EASE_LUXURY = [0.76, 0, 0.24, 1] as [number, number, number, number];

export function FinalCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-15%" });

  return (
    <section
      ref={sectionRef}
      style={{
        minHeight: "100vh",
        backgroundColor: "#030303",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "6rem 1.5rem",
        position: "relative",
      }}
    >
      {/* Inner column */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2.5rem",
          width: "100%",
          maxWidth: "720px",
          textAlign: "center",
        }}
      >
        {/* Decorative top line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={inView ? { scaleX: 1, opacity: 1 } : {}}
          transition={{ duration: 0.8, ease: EASE_LUXURY }}
          style={{
            width: "80px",
            height: "1px",
            backgroundColor: "rgba(255,255,255,0.2)",
            transformOrigin: "left center",
          }}
        />

        {/* AXION — clip-path reveal left→right */}
        <div style={{ overflow: "hidden" }}>
          <motion.h2
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={inView ? { clipPath: "inset(0 0% 0 0)" } : {}}
            transition={{ duration: 1.0, ease: EASE_LUXURY }}
            style={{
              fontFamily: "PP Neue Corp Wide, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(6rem, 12vw, 11rem)",
              color: "#ffffff",
              letterSpacing: "-0.02em",
              lineHeight: 1,
              margin: 0,
            }}
          >
            AXION
          </motion.h2>
        </div>

        {/* Sub-label */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.6, ease: EASE_LUXURY }}
          style={{
            fontFamily: "DM Sans, sans-serif",
            fontWeight: 300,
            fontSize: "1rem",
            color: "rgba(255,255,255,0.25)",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          Electric Pre-Workout
        </motion.p>

        {/* Divider line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={inView ? { scaleX: 1, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.75, ease: EASE_LUXURY }}
          style={{
            width: "120px",
            height: "1px",
            backgroundColor: "rgba(255,255,255,0.1)",
            transformOrigin: "center",
          }}
        />

        {/* Statement paragraph */}
        <motion.p
          initial={{ y: 15, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.9, ease: EASE_LUXURY }}
          style={{
            fontFamily: "DM Sans, sans-serif",
            fontWeight: 300,
            fontSize: "1rem",
            color: "rgba(255,255,255,0.4)",
            lineHeight: 1.9,
            maxWidth: "480px",
            margin: 0,
          }}
        >
          Three flavors. One formula.<br />
          Designed for those who train with intention.
        </motion.p>

        {/* Flavor names */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 1.1, ease: EASE_LUXURY }}
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          {FLAVORS.map((flavor, i) => (
            <span
              key={flavor.name}
              style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
            >
              <FlavorName name={flavor.name} accent={flavor.accent} />
              {i < FLAVORS.length - 1 && (
                <span
                  style={{
                    color: "rgba(255,255,255,0.2)",
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "0.85rem",
                    lineHeight: 1,
                  }}
                >
                  ·
                </span>
              )}
            </span>
          ))}
        </motion.div>

        {/* CTA button */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 1.1, ease: EASE_LUXURY }}
        >
          <CTAButton />
        </motion.div>
      </div>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 1.4, ease: EASE_LUXURY }}
        style={{
          position: "absolute",
          bottom: "2rem",
          fontFamily: "DM Sans, sans-serif",
          fontWeight: 300,
          fontSize: "0.7rem",
          color: "rgba(255,255,255,0.15)",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          margin: 0,
        }}
      >
        © 2025 AXION. All rights reserved.
      </motion.p>
    </section>
  );
}

/* ─── Sub-components ──────────────────────────────────────────── */

function FlavorName({ name, accent }: { name: string; accent: string }) {
  return (
    <motion.span
      whileHover={{ opacity: 1 }}
      initial={{ opacity: 0.6 }}
      style={{
        fontFamily: "DM Sans, sans-serif",
        fontWeight: 400,
        fontSize: "0.85rem",
        color: accent,
        cursor: "default",
        letterSpacing: "0.02em",
        textDecoration: "none",
        transition: "text-decoration 200ms",
        display: "inline-block",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.textDecoration = `underline 1px ${accent}`;
        (e.currentTarget as HTMLElement).style.opacity = "1";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.textDecoration = "none";
        (e.currentTarget as HTMLElement).style.opacity = "0.6";
      }}
    >
      {name}
    </motion.span>
  );
}

function CTAButton() {
  return (
    <button
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.borderColor = "rgba(255,255,255,1)";
        el.style.color = "rgba(255,255,255,1)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.borderColor = "rgba(255,255,255,0.3)";
        el.style.color = "rgba(255,255,255,0.7)";
      }}
      style={{
        fontFamily: "DM Sans, sans-serif",
        fontWeight: 400,
        fontSize: "0.8rem",
        color: "rgba(255,255,255,0.7)",
        letterSpacing: "0.25em",
        textTransform: "uppercase",
        padding: "1rem 3rem",
        border: "1px solid rgba(255,255,255,0.3)",
        background: "transparent",
        cursor: "pointer",
        transition: "border-color 400ms ease, color 400ms ease",
        outline: "none",
      }}
    >
      Explore the collection
    </button>
  );
}

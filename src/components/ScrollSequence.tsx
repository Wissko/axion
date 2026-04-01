"use client";

/**
 * ScrollSequence.tsx — AXION Editorial Product Showcase
 * ──────────────────────────────────────────────────────
 * 3 sections empilées, chacune 100vh, scroll naturel.
 * Concept : "Split Editorial" — direction Dom Pérignon / Byredo.
 * Pas de carousel, pas de navigation, pas de dots.
 * Chaque produit vit comme une page de magazine de luxe.
 */

import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";

// ──────────────────────────────────────────────────────
// CONSTANTES D'EASE — Framer Motion
// ──────────────────────────────────────────────────────

/** Ease luxe — utilisé pour toutes les animations d'entrée */
const EASE_LUXURY = [0.16, 1, 0.3, 1] as [number, number, number, number];

// ──────────────────────────────────────────────────────
// TYPES
// ──────────────────────────────────────────────────────

interface ProductData {
  /** Identifiant unique */
  id: string;
  /** Numéro affiché en haut à droite : "01", "02", "03" */
  number: string;
  /** Label au-dessus du nom */
  label: string;
  /** Nom du produit (très grand) */
  name: string;
  /** Accroche italique */
  tagline: string;
  /** Description longue */
  description: string;
  /** Ligne de specs */
  specs: string;
  /** Texte du CTA */
  cta: string;
  /** Couleur accent unique au produit */
  accent: string;
  /** Couleur de fond spécifique au produit */
  background: string;
  /** Chemin de l'image */
  imageSrc: string;
  /** Image à gauche (true) ou à droite (false) */
  imageLeft: boolean;
}

// ──────────────────────────────────────────────────────
// DONNÉES PRODUITS
// ──────────────────────────────────────────────────────

const PRODUCTS: ProductData[] = [
  {
    id: "blue-razz",
    number: "01",
    label: "ELECTRIC PRE-WORKOUT",
    name: "Blue Razz",
    tagline: "Razor sharp focus.",
    description:
      "Engineered for athletes who demand precision. Blue Razz delivers clean, sustained energy with zero crash — powered by 200mg caffeine, L-Theanine, and 4g Citrulline Malate.",
    specs: "200mg Caffeine  ·  150mg L-Theanine  ·  4g Citrulline",
    cta: "Shop Blue Razz",
    accent: "#4F9EF8",
    background: "#040810",
    imageSrc: "/images/Frames_blue/frame-1.png",
    imageLeft: true,
  },
  {
    id: "mango",
    number: "02",
    label: "ELECTRIC PRE-WORKOUT",
    name: "Mango",
    tagline: "Tropical surge, peak output.",
    description:
      "Fuel your longest sessions with a tropical explosion of performance. 6g Citrulline Malate, Beta-Alanine complex, and B-vitamins to keep you locked in from rep one to the last.",
    specs: "200mg Caffeine  ·  2.5g Beta-Alanine  ·  6g Citrulline",
    cta: "Shop Mango",
    accent: "#F5B942",
    background: "#0D0800",
    imageSrc: "/images/Frames_orange/frame-1.png",
    imageLeft: false,
  },
  {
    id: "grape",
    number: "03",
    label: "ELECTRIC PRE-WORKOUT",
    name: "Grape",
    tagline: "Dark focus. Night mode power.",
    description:
      "When the lights go down, your performance doesn't. Alpha GPC, L-Tyrosine, and Grape Seed Extract combined with 6g Citrulline for an unmatched mind-muscle connection.",
    specs: "200mg Caffeine  ·  1g L-Tyrosine  ·  300mg Alpha GPC",
    cta: "Shop Grape",
    accent: "#9B72F5",
    background: "#07040F",
    imageSrc: "/images/Frames_purple/frame-1.png",
    imageLeft: true,
  },
];

// ──────────────────────────────────────────────────────
// COMPOSANT RACINE — ScrollSequence
// ──────────────────────────────────────────────────────

export function ScrollSequence() {
  return (
    /* Wrapper : empilement vertical des 3 sections */
    <div style={{ width: "100%" }}>
      {PRODUCTS.map((product) => (
        <ProductSection key={product.id} product={product} />
      ))}

      {/* Styles globaux injectés une seule fois */}
      <style>{`
        /* Reset bouton CTA */
        .axion-cta {
          cursor: pointer;
          outline: none;
          background: transparent;
          transition: background-color 400ms ease, color 400ms ease;
        }

        /* Mobile : empilement image/texte */
        @media (max-width: 768px) {
          .axion-split {
            flex-direction: column !important;
          }
          .axion-image-col {
            width: 100% !important;
            height: 40vh !important;
            min-height: unset !important;
          }
          .axion-text-col {
            width: 100% !important;
            height: 60vh !important;
            align-items: center !important;
            text-align: center !important;
            padding: 2rem 1.5rem !important;
          }
          .axion-divider {
            align-self: center !important;
          }
          .axion-separator {
            margin: 1rem auto !important;
          }
          .axion-vertical-line {
            display: none !important;
          }
          .axion-section-number {
            top: 1rem !important;
            right: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
}

// ──────────────────────────────────────────────────────
// SECTION PRODUIT — 100vh éditoriale
// ──────────────────────────────────────────────────────

function ProductSection({ product }: { product: ProductData }) {
  /** Ref de la section pour déclencher le scroll reveal */
  const sectionRef = useRef<HTMLDivElement>(null);

  /** useInView — threshold 0.3 : animation dès que 30% de la section est visible */
  const isInView = useInView(sectionRef, {
    once: false,
    amount: 0.3,
  });

  // ── Variantes d'animation image ────────────────────

  const imageVariants = {
    hidden: {
      opacity: 0,
      scale: 0.94,
      filter: "blur(6px)",
    },
    visible: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 1.0,
        ease: EASE_LUXURY,
      },
    },
  };

  // ── Variantes d'animation texte (stagger) ──────────

  /**
   * Container texte : stagger children avec delay après l'image (0.3s)
   * Chaque enfant : 0.1s entre eux
   */
  const textContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1,
      },
    },
  };

  /** Chaque ligne de texte : y: 40→0 + opacity: 0→1 */
  const textLineVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.7,
        ease: EASE_LUXURY,
      },
    },
  };

  // ── Rendu de la section ─────────────────────────────

  return (
    <section
      ref={sectionRef}
      style={{
        /* Section pleine hauteur avec fond couleur produit */
        position: "relative",
        width: "100%",
        height: "100vh",
        backgroundColor: product.background,
        display: "flex",
        alignItems: "stretch",
        overflow: "hidden",
      }}
    >
      {/* ── Numéro de section — top-right ─────────────── */}
      <div
        className="axion-section-number"
        style={{
          position: "absolute",
          top: "2rem",
          right: "2rem",
          zIndex: 10,
          fontFamily: "'PP Neue Corp Wide', sans-serif",
          fontWeight: 800,
          fontSize: "0.7rem",
          letterSpacing: "0.2em",
          color: `${product.accent}33`, /* accent à 20% opacité */
          userSelect: "none",
        }}
      >
        {product.number}
      </div>

      {/* ── Layout split desktop ──────────────────────── */}
      <div
        className="axion-split"
        style={{
          display: "flex",
          flexDirection: product.imageLeft ? "row" : "row-reverse",
          width: "100%",
          height: "100%",
        }}
      >
        {/* ── Colonne image (55%) ──────────────────────── */}
        <div
          className="axion-image-col"
          style={{
            position: "relative",
            width: "55%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Glow radial sous l'image */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              bottom: "-30px",
              width: "70%",
              height: "220px",
              background: `radial-gradient(ellipse, ${product.accent}30 0%, transparent 70%)`,
              filter: "blur(60px)",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />

          {/* Image produit avec animation scroll reveal */}
          <motion.div
            variants={imageVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            style={{
              position: "relative",
              zIndex: 1,
              width: "100%",
              maxWidth: "420px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 2rem",
            }}
          >
            <Image
              src={product.imageSrc}
              alt={product.name}
              width={420}
              height={520}
              priority
              style={{
                width: "100%",
                maxWidth: "420px",
                maxHeight: "70vh",
                objectFit: "contain",
                /* mix-blend-mode screen : fond sombre disparaît */
                mixBlendMode: "screen",
                display: "block",
              }}
            />
          </motion.div>
        </div>

        {/* ── Ligne décorative verticale (desktop) ──────── */}
        <div
          className="axion-vertical-line"
          style={{
            position: "relative",
            width: "1px",
            height: "100%",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "1px",
              height: "40%",
              background: `linear-gradient(to bottom, transparent, ${product.accent}40, transparent)`,
            }}
          />
        </div>

        {/* ── Colonne texte (45%) ──────────────────────── */}
        <div
          className="axion-text-col"
          style={{
            width: "45%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            padding: "2rem 4rem 2rem 3rem",
          }}
        >
          {/* Container texte avec stagger animation */}
          <motion.div
            variants={textContainerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              maxWidth: "420px",
            }}
          >
            {/* Label produit */}
            <motion.span
              variants={textLineVariants}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 400,
                fontSize: "0.65rem",
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color: product.accent,
                marginBottom: "1.2rem",
                display: "block",
              }}
            >
              {product.label}
            </motion.span>

            {/* Nom du produit — très grand */}
            <motion.h2
              variants={textLineVariants}
              style={{
                fontFamily: "'PP Neue Corp Wide', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(3rem, 6vw, 5.5rem)",
                color: product.accent,
                margin: "0 0 0.5rem",
                lineHeight: 1,
                letterSpacing: "-0.01em",
              }}
            >
              {product.name}
            </motion.h2>

            {/* Tagline — italic léger */}
            <motion.p
              variants={textLineVariants}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 300,
                fontStyle: "italic",
                fontSize: "1.1rem",
                color: `${product.accent}A6`, /* 65% opacité */
                margin: "0 0 1.4rem",
              }}
            >
              {product.tagline}
            </motion.p>

            {/* Séparateur horizontal 60px */}
            <motion.div
              variants={textLineVariants}
              className="axion-separator"
              style={{
                width: "60px",
                height: "1px",
                backgroundColor: `${product.accent}66`, /* 40% opacité */
                marginBottom: "1.4rem",
              }}
            />

            {/* Description */}
            <motion.p
              variants={textLineVariants}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 400,
                fontSize: "0.95rem",
                color: `${product.accent}99`, /* 60% opacité */
                maxWidth: "360px",
                lineHeight: 1.8,
                margin: "0 0 1.5rem",
              }}
            >
              {product.description}
            </motion.p>

            {/* Specs */}
            <motion.p
              variants={textLineVariants}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 300,
                fontSize: "0.72rem",
                letterSpacing: "0.12em",
                color: `${product.accent}80`, /* 50% opacité */
                margin: "0 0 2rem",
                textTransform: "uppercase",
              }}
            >
              {product.specs}
            </motion.p>

            {/* CTA */}
            <motion.div variants={textLineVariants}>
              <CTAButton accent={product.accent} background={product.background} label={product.cta} />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────
// BOUTON CTA — outline luxe, hover fill
// ──────────────────────────────────────────────────────

function CTAButton({
  accent,
  background,
  label,
}: {
  accent: string;
  background: string;
  label: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      className="axion-cta"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: 400,
        fontSize: "0.8rem",
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        padding: "0.75rem 2rem",
        border: `1px solid ${accent}`,
        backgroundColor: hovered ? accent : "transparent",
        /* Texte : accent par défaut, fond produit au hover */
        color: hovered ? background : accent,
        transition: "background-color 400ms ease, color 400ms ease",
        cursor: "pointer",
        outline: "none",
      }}
    >
      {label}
    </button>
  );
}

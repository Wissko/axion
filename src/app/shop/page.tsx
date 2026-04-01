"use client";

/**
 * Shop — immersive product showcase
 * Chaque produit = une section plein écran avec frame-1
 * Style magazine éditorial, pas un catalogue e-commerce
 */

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { PRODUCTS } from "@/data/products";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const FRAME_FOLDERS: Record<string, string> = {
  "blue-razz": "Frames_blue",
  mango: "Frames_orange",
  grape: "Frames_purple",
};

export default function ShopPage() {
  return (
    <main style={{ background: "#050505" }}>
      {/* Hero intro */}
      <section
        style={{
          height: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "0 2rem",
          position: "relative",
        }}
      >
        <motion.span
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300,
            fontSize: "0.65rem",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.2)",
            marginBottom: "1.5rem",
          }}
        >
          3 FLAVORS. 1 FORMULA. 0 COMPROMISE.
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
          style={{
            fontFamily: "'PP Neue Corp Wide', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(3rem, 10vw, 8rem)",
            color: "#fff",
            margin: 0,
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
          }}
        >
          THE
          <br />
          LINEUP
        </motion.h1>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "80px" }}
          transition={{ duration: 1, ease: EASE, delay: 0.6 }}
          style={{
            height: "1px",
            background: "rgba(255,255,255,0.15)",
            marginTop: "2rem",
          }}
        />
        {/* Scroll hint */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          style={{
            position: "absolute",
            bottom: "2rem",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300,
            fontSize: "0.65rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.15)",
          }}
        >
          Scroll to explore
        </motion.span>
      </section>

      {/* Product sections */}
      {PRODUCTS.map((product, i) => (
        <ProductShowcase key={product.slug} product={product} index={i} />
      ))}
    </main>
  );
}

// ────────────────────────────────────────────────
// Chaque produit = une section plein écran
// ────────────────────────────────────────────────

function ProductShowcase({
  product,
  index,
}: {
  product: (typeof PRODUCTS)[number];
  index: number;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: false, amount: 0.3 });
  const [hovered, setHovered] = useState(false);
  const isReversed = index % 2 !== 0;
  const frameFolder = FRAME_FOLDERS[product.slug] || "Frames_blue";

  return (
    <motion.section
      ref={sectionRef}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8, ease: EASE }}
      style={{
        minHeight: "100vh",
        background: product.background,
        display: "flex",
        flexDirection: isReversed ? "row-reverse" : "row",
        position: "relative",
        overflow: "hidden",
      }}
      className="shop-section"
    >
      {/* ── Image column (55%) ── */}
      <div
        style={{
          width: "55%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
        className="shop-section-img"
      >
        {/* Large accent number background */}
        <span
          style={{
            position: "absolute",
            fontFamily: "'PP Neue Corp Wide', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(12rem, 25vw, 22rem)",
            color: `${product.accent}08`,
            lineHeight: 1,
            userSelect: "none",
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          {product.number}
        </span>

        {/* Glow */}
        <div
          style={{
            position: "absolute",
            bottom: "5%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "80%",
            height: "300px",
            background: `radial-gradient(ellipse, ${product.accent}20 0%, transparent 70%)`,
            filter: "blur(60px)",
            pointerEvents: "none",
            zIndex: 0,
            opacity: hovered ? 1 : 0.5,
            transition: "opacity 600ms ease",
          }}
        />

        {/* Product image */}
        <Link href={`/shop/${product.slug}`}>
          <motion.img
            src={`/images/${frameFolder}/frame-1.png`}
            alt={product.name}
            initial={{ scale: 0.9, filter: "blur(8px)", opacity: 0 }}
            animate={
              inView
                ? { scale: 1, filter: "blur(0px)", opacity: 1 }
                : { scale: 0.9, filter: "blur(8px)", opacity: 0 }
            }
            transition={{ duration: 1, ease: EASE, delay: 0.2 }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              maxWidth: "360px",
              maxHeight: "65vh",
              width: "auto",
              height: "auto",
              objectFit: "contain",
              mixBlendMode: "screen",
              position: "relative",
              zIndex: 1,
              cursor: "pointer",
              transform: hovered ? "scale(1.06) rotate(-1.5deg)" : "scale(1)",
              transition: "transform 600ms cubic-bezier(0.16,1,0.3,1)",
            }}
          />
        </Link>
      </div>

      {/* ── Text column (45%) ── */}
      <div
        style={{
          width: "45%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: isReversed ? "4rem 3rem 4rem 5rem" : "4rem 5rem 4rem 3rem",
        }}
        className="shop-section-text"
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
        >
          {/* Label */}
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 300,
              fontSize: "0.6rem",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: product.accent,
              marginBottom: "1.2rem",
              display: "block",
            }}
          >
            {product.label}
          </span>

          {/* Name */}
          <h2
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
          </h2>

          {/* Tagline */}
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 300,
              fontStyle: "italic",
              fontSize: "1.05rem",
              color: `${product.accent}70`,
              margin: "0 0 2rem",
            }}
          >
            {product.tagline}
          </p>

          {/* Separator */}
          <div
            style={{
              width: "60px",
              height: "1px",
              background: `${product.accent}40`,
              marginBottom: "2rem",
            }}
          />

          {/* Description */}
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 400,
              fontSize: "0.95rem",
              color: "rgba(255,255,255,0.45)",
              lineHeight: 1.8,
              maxWidth: "380px",
              margin: "0 0 2rem",
            }}
          >
            {product.description}
          </p>

          {/* Key stats row */}
          <div
            style={{
              display: "flex",
              gap: "2rem",
              marginBottom: "2.5rem",
            }}
          >
            {product.ingredients.slice(0, 3).map((ing) => (
              <div key={ing.name} style={{ display: "flex", flexDirection: "column" }}>
                <span
                  style={{
                    fontFamily: "'PP Neue Corp Wide', sans-serif",
                    fontWeight: 800,
                    fontSize: "1.3rem",
                    color: `${product.accent}80`,
                    lineHeight: 1,
                  }}
                >
                  {ing.dose}
                </span>
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 300,
                    fontSize: "0.65rem",
                    color: "rgba(255,255,255,0.3)",
                    letterSpacing: "0.08em",
                    marginTop: "0.3rem",
                  }}
                >
                  {ing.name}
                </span>
              </div>
            ))}
          </div>

          {/* Price + CTA */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <span
              style={{
                fontFamily: "'PP Neue Corp Wide', sans-serif",
                fontWeight: 800,
                fontSize: "1.5rem",
                color: "#fff",
              }}
            >
              $39.99
            </span>
            <Link
              href={`/shop/${product.slug}`}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500,
                fontSize: "0.75rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                textDecoration: "none",
                padding: "0.85rem 2rem",
                background: product.accent,
                color: product.background,
                transition: "opacity 300ms ease",
              }}
            >
              Explore
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 768px) {
          .shop-section { flex-direction: column !important; min-height: auto !important; }
          .shop-section-img { width: 100% !important; height: 50vh !important; }
          .shop-section-text { width: 100% !important; padding: 2rem !important; text-align: center; align-items: center; }
        }
      `}</style>
    </motion.section>
  );
}

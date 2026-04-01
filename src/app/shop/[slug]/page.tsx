"use client";

/**
 * Product page — ultra-premium full experience
 * 4 sections: Hero / Formula / Experience / Stack
 */

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PRODUCTS } from "@/data/products";

// ── Frame folder map ──
const FRAME_FOLDERS: Record<string, string> = {
  "blue-razz": "Frames_blue",
  mango: "Frames_orange",
  grape: "Frames_purple",
};

// ── Ease constant ──
const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

// ── Animated section wrapper ──
function RevealSection({
  children,
  style,
  className,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.25 });
  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, ease: EASE }}
      style={style}
      className={className}
    >
      {children}
    </motion.section>
  );
}

export default function ProductPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const product = PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    return (
      <main style={{ background: "#050505", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>Product not found.</p>
      </main>
    );
  }

  const frameFolder = FRAME_FOLDERS[product.slug] || "Frames_blue";
  const imageSrc = `/images/${frameFolder}/frame-1.png`;
  const otherProducts = PRODUCTS.filter((p) => p.slug !== product.slug);

  return (
    <main style={{ background: "#050505" }}>
      {/* ════════════════════════════════════════════════
          SECTION 1 — Hero produit (100vh)
          ════════════════════════════════════════════════ */}
      <section
        style={{
          height: "100vh",
          background: product.background,
          display: "flex",
          position: "relative",
          overflow: "hidden",
        }}
        className="pdp-hero"
      >
        {/* Image — left 60% */}
        <div
          style={{
            width: "60%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
          className="pdp-hero-img"
        >
          {/* Glow */}
          <div
            style={{
              position: "absolute",
              bottom: "10%",
              left: "50%",
              transform: "translateX(-50%)",
              width: "70%",
              height: "250px",
              background: `radial-gradient(ellipse, ${product.accent}25 0%, transparent 70%)`,
              filter: "blur(60px)",
              pointerEvents: "none",
            }}
          />
          <motion.img
            src={imageSrc}
            alt={product.name}
            initial={{ scale: 0.92, filter: "blur(6px)", opacity: 0 }}
            animate={{ scale: 1, filter: "blur(0px)", opacity: 1 }}
            transition={{ duration: 1.2, ease: EASE }}
            style={{
              maxWidth: "380px",
              maxHeight: "65vh",
              width: "auto",
              height: "auto",
              objectFit: "contain",
              position: "relative",
              zIndex: 1,
            }}
          />
        </div>

        {/* Text — right 40% */}
        <div
          style={{
            width: "40%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "3rem 4rem 3rem 2rem",
          }}
          className="pdp-hero-text"
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.3 }}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 300,
              fontSize: "0.6rem",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: product.accent,
              marginBottom: "1rem",
            }}
          >
            {product.label}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.4 }}
            style={{
              fontFamily: "'PP Neue Corp Wide', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(3.5rem, 7vw, 6rem)",
              color: product.accent,
              margin: "0 0 0.4rem",
              lineHeight: 1,
            }}
          >
            {product.name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.5 }}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 300,
              fontStyle: "italic",
              fontSize: "1.05rem",
              color: `${product.accent}80`,
              margin: "0 0 2rem",
            }}
          >
            {product.tagline}
          </motion.p>

          {/* Separator */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "60px" }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.6 }}
            style={{ height: "1px", background: `${product.accent}50`, marginBottom: "2rem" }}
          />

          {/* Price */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            style={{
              fontFamily: "'PP Neue Corp Wide', sans-serif",
              fontWeight: 800,
              fontSize: "2rem",
              color: "#fff",
              margin: "0 0 1.8rem",
            }}
          >
            $39.99
          </motion.p>

          {/* Add to Cart */}
          <motion.button
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.8 }}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500,
              fontSize: "0.85rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              padding: "1.1rem 3rem",
              border: "none",
              background: product.accent,
              color: product.background,
              cursor: "pointer",
              marginBottom: "1rem",
              transition: "opacity 300ms ease",
            }}
          >
            Add to Cart
          </motion.button>

          {/* Secondary */}
          <motion.a
            href="#formula"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 300,
              fontSize: "0.75rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.35)",
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            See Ingredients ↓
          </motion.a>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          SECTION 2 — The Formula
          ════════════════════════════════════════════════ */}
      <RevealSection
        style={{
          minHeight: "100vh",
          background: "#050505",
          padding: "8rem 2rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <span
          id="formula"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300,
            fontSize: "0.65rem",
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.25)",
            marginBottom: "1.2rem",
          }}
        >
          THE FORMULA
        </span>
        <h2
          style={{
            fontFamily: "'PP Neue Corp Wide', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(2rem, 5vw, 4rem)",
            color: "#fff",
            margin: "0 0 4rem",
            textAlign: "center",
          }}
        >
          {"What's Inside"}
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "2.5rem",
            maxWidth: "900px",
            width: "100%",
          }}
        >
          {product.ingredients.map((ing) => (
            <div
              key={ing.name}
              style={{
                borderBottom: `1px solid ${product.accent}15`,
                paddingBottom: "1.5rem",
              }}
            >
              <span
                style={{
                  fontFamily: "'PP Neue Corp Wide', sans-serif",
                  fontWeight: 800,
                  fontSize: "2.5rem",
                  color: `${product.accent}30`,
                  display: "block",
                  lineHeight: 1,
                  marginBottom: "0.6rem",
                }}
              >
                {ing.dose}
              </span>
              <span
                style={{
                  fontFamily: "'PP Neue Corp Wide', sans-serif",
                  fontWeight: 800,
                  fontSize: "0.9rem",
                  color: "#fff",
                  letterSpacing: "0.05em",
                  display: "block",
                  marginBottom: "0.4rem",
                }}
              >
                {ing.name}
              </span>
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 400,
                  fontSize: "0.85rem",
                  color: "rgba(255,255,255,0.45)",
                  lineHeight: 1.6,
                }}
              >
                {ing.role}
              </span>
            </div>
          ))}
        </div>
      </RevealSection>

      {/* ════════════════════════════════════════════════
          SECTION 3 — How It Feels
          ════════════════════════════════════════════════ */}
      <RevealSection
        style={{
          minHeight: "100vh",
          background: product.background,
          padding: "8rem 2rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h2
          style={{
            fontFamily: "'PP Neue Corp Wide', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            color: "#fff",
            margin: "0 0 5rem",
            textAlign: "center",
          }}
        >
          How It Feels
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "3rem",
            maxWidth: "900px",
            width: "100%",
            textAlign: "center",
          }}
          className="pdp-stats"
        >
          {[
            { big: "< 10 MIN", sub: "Time to kick in" },
            { big: "60 ML", sub: "One shot. That's all." },
            { big: "0 SUGAR", sub: "Clean energy. No crash." },
          ].map((stat) => (
            <div key={stat.big}>
              <span
                style={{
                  fontFamily: "'PP Neue Corp Wide', sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(1.8rem, 4vw, 3rem)",
                  color: product.accent,
                  display: "block",
                  marginBottom: "0.6rem",
                }}
              >
                {stat.big}
              </span>
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 300,
                  fontSize: "0.85rem",
                  color: "rgba(255,255,255,0.4)",
                  letterSpacing: "0.1em",
                }}
              >
                {stat.sub}
              </span>
            </div>
          ))}
        </div>

        {/* Testimonial */}
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300,
            fontStyle: "italic",
            fontSize: "1.1rem",
            color: "rgba(255,255,255,0.3)",
            maxWidth: "500px",
            textAlign: "center",
            marginTop: "5rem",
            lineHeight: 1.7,
          }}
        >
          {'"Hits way faster than any pre I\'ve used. No crash. Just clean focus the entire session."'}
        </p>
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 400,
            fontSize: "0.7rem",
            color: "rgba(255,255,255,0.2)",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            marginTop: "1rem",
          }}
        >
          Beta Tester
        </span>
      </RevealSection>

      {/* ════════════════════════════════════════════════
          SECTION 4 — Complete the Stack
          ════════════════════════════════════════════════ */}
      <RevealSection
        style={{
          minHeight: "50vh",
          background: "#050505",
          padding: "6rem 2rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300,
            fontSize: "0.65rem",
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.25)",
            marginBottom: "1.2rem",
          }}
        >
          ALSO AVAILABLE
        </span>
        <h2
          style={{
            fontFamily: "'PP Neue Corp Wide', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(1.8rem, 4vw, 3rem)",
            color: "#fff",
            margin: "0 0 3rem",
          }}
        >
          Complete the Stack
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "2rem",
            maxWidth: "700px",
            width: "100%",
          }}
        >
          {otherProducts.map((op) => {
            const opFolder = FRAME_FOLDERS[op.slug] || "Frames_blue";
            return (
              <Link
                key={op.slug}
                href={`/shop/${op.slug}`}
                style={{
                  textDecoration: "none",
                  border: `1px solid ${op.accent}20`,
                  padding: "2rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  background: op.background,
                  transition: "border-color 400ms ease, transform 300ms ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = op.accent;
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = `${op.accent}20`;
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <img
                  src={`/images/${opFolder}/frame-1.png`}
                  alt={op.name}
                  style={{
                    maxWidth: "160px",
                    maxHeight: "200px",
                    objectFit: "contain",
                    marginBottom: "1.2rem",
                  }}
                />
                <span
                  style={{
                    fontFamily: "'PP Neue Corp Wide', sans-serif",
                    fontWeight: 800,
                    fontSize: "1.5rem",
                    color: op.accent,
                  }}
                >
                  {op.name}
                </span>
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 300,
                    fontStyle: "italic",
                    fontSize: "0.85rem",
                    color: `${op.accent}70`,
                    marginTop: "0.3rem",
                  }}
                >
                  {op.tagline}
                </span>
              </Link>
            );
          })}
        </div>
      </RevealSection>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .pdp-hero { flex-direction: column !important; height: auto !important; min-height: 100vh; }
          .pdp-hero-img { width: 100% !important; height: 40vh !important; min-height: 280px !important; }
          .pdp-hero-text { width: 100% !important; padding: 1.5rem !important; text-align: center; align-items: center; }
          .pdp-hero-text h1 { font-size: clamp(2.5rem, 10vw, 4rem) !important; }
          .pdp-hero-text button { width: 100% !important; min-height: 48px; }
          .pdp-stats { grid-template-columns: 1fr !important; gap: 2rem !important; }
          .pdp-hero-img img { max-width: 240px !important; max-height: 35vh !important; }
        }
      `}</style>
    </main>
  );
}

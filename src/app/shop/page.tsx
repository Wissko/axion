"use client";

/**
 * Shop — Carrousel incurvé infini (style Red Bull)
 * Chaque produit est positionné sur un arc 3D.
 * Le produit central est en avant, les côtés reculent en perspective.
 */

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { PRODUCTS } from "@/data/products";

// Images sans background
const PRODUCT_IMAGES: Record<string, string> = {
  "blue-razz": "/images/products/bleu.PNG",
  mango: "/images/products/or.PNG",
  grape: "/images/products/violtte.PNG",
};

const TOTAL = PRODUCTS.length; // 3

export default function ShopPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 gauche, 0 idle, 1 droite
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef(0);
  const isTransitioning = useRef(false);

  const activeProduct = PRODUCTS[currentIndex];
  const accentColor = "#fff"; // Couleur unique, pas de changement par produit

  // Navigation
  const goTo = useCallback(
    (dir: number) => {
      if (isTransitioning.current) return;
      isTransitioning.current = true;
      setDirection(dir);
      setCurrentIndex((prev) => (prev + dir + TOTAL) % TOTAL);
      setTimeout(() => {
        isTransitioning.current = false;
      }, 600);
    },
    []
  );

  // Wheel
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (Math.abs(e.deltaY) > 20) {
        goTo(e.deltaY > 0 ? 1 : -1);
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [goTo]);

  // Touch/swipe
  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(dx) > 50) {
      goTo(dx > 0 ? -1 : 1);
    }
  };

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goTo(-1);
      if (e.key === "ArrowRight") goTo(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo]);

  // Positions sur l'arc pour chaque produit relatif au centre
  const getItemStyle = (offset: number): React.CSSProperties => {
    // offset: -1 (gauche), 0 (centre), 1 (droite), -2/2 (très loin)
    const configs: Record<number, { x: string; z: number; rotY: number; scale: number; opacity: number; blur: number }> = {
      "-2": { x: "-130%", z: -400, rotY: 45, scale: 0.5, opacity: 0, blur: 6 },
      "-1": { x: "-75%", z: -200, rotY: 30, scale: 0.7, opacity: 0.5, blur: 2 },
      "0":  { x: "0%", z: 0, rotY: 0, scale: 1, opacity: 1, blur: 0 },
      "1":  { x: "75%", z: -200, rotY: -30, scale: 0.7, opacity: 0.5, blur: 2 },
      "2":  { x: "130%", z: -400, rotY: -45, scale: 0.5, opacity: 0, blur: 6 },
    };

    const clamped = Math.max(-2, Math.min(2, offset));
    const key = String(clamped) as unknown as keyof typeof configs;
    const cfg = configs[key] || configs["0"];

    return {
      position: "absolute" as const,
      left: "50%",
      top: "50%",
      transform: `
        translateX(calc(-50% + ${cfg.x}))
        translateY(-50%)
        translateZ(${cfg.z}px)
        rotateY(${cfg.rotY}deg)
        scale(${cfg.scale})
      `,
      opacity: cfg.opacity,
      filter: cfg.blur > 0 ? `blur(${cfg.blur}px) brightness(0.6)` : "none",
      transition: "all 600ms cubic-bezier(0.16, 1, 0.3, 1)",
      zIndex: clamped === 0 ? 10 : 5 - Math.abs(clamped),
      pointerEvents: clamped === 0 ? "auto" as const : "none" as const,
    };
  };

  return (
    <main
      style={{
        background: "#000",
        minHeight: "100vh",
        overflow: "hidden",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Top branding ── */}
      <div style={{ textAlign: "center", paddingTop: "7rem", position: "relative", zIndex: 20 }}>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: "0.6rem",
          letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)",
          marginBottom: "0.8rem",
        }}>
          PRE-WORKOUT SHOT · 60ML
        </p>
        <h1 style={{
          fontFamily: "'PP Neue Corp Wide', sans-serif", fontWeight: 800,
          fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "#fff", margin: 0,
          letterSpacing: "-0.02em",
        }}>
          CHOOSE YOUR FLAVOR
        </h1>
      </div>

      {/* ── Carrousel zone ── */}
      <div
        ref={containerRef}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={{
          flex: 1,
          position: "relative",
          perspective: "1200px",
          perspectiveOrigin: "50% 50%",
          minHeight: "50vh",
          cursor: "grab",
          userSelect: "none",
          touchAction: "pan-y",
        }}
      >
        {/* Glow sous produit actif */}
        <div style={{
          position: "absolute", bottom: "5%", left: "50%", transform: "translateX(-50%)",
          width: "350px", height: "180px",
          background: `radial-gradient(ellipse, ${accentColor}30 0%, transparent 70%)`,
          filter: "blur(50px)", pointerEvents: "none", zIndex: 0,
          transition: "background 600ms ease",
        }} />

        {/* Left arrow */}
        <button
          onClick={() => goTo(-1)}
          style={{
            position: "absolute", left: "3%", top: "50%", transform: "translateY(-50%)",
            background: "none", border: "none", cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif", fontSize: "2rem",
            color: "rgba(255,255,255,0.2)", zIndex: 20,
            transition: "color 300ms ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.2)")}
          aria-label="Previous"
        >
          ‹
        </button>

        {/* Right arrow */}
        <button
          onClick={() => goTo(1)}
          style={{
            position: "absolute", right: "3%", top: "50%", transform: "translateY(-50%)",
            background: "none", border: "none", cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif", fontSize: "2rem",
            color: "rgba(255,255,255,0.2)", zIndex: 20,
            transition: "color 300ms ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.2)")}
          aria-label="Next"
        >
          ›
        </button>

        {/* Products on the arc */}
        {PRODUCTS.map((product, i) => {
          // Calculate offset from current
          let offset = i - currentIndex;
          // Wrap for infinite feel
          if (offset > 1) offset -= TOTAL;
          if (offset < -1) offset += TOTAL;

          return (
            <div key={product.slug} style={getItemStyle(offset)}>
              <Link href={`/shop/${product.slug}`} style={{ textDecoration: "none", display: "block" }}>
                <img
                  src={PRODUCT_IMAGES[product.slug]}
                  alt={product.name}
                  draggable={false}
                  className="shop-carousel-img"
                  style={{
                    width: "320px",
                    height: "440px",
                    objectFit: "contain",
                  }}
                />
              </Link>
            </div>
          );
        })}
      </div>

      {/* ── Product info ── */}
      <div style={{ textAlign: "center", padding: "0 2rem 1.5rem", position: "relative", zIndex: 20 }}>
        <p style={{
          fontFamily: "'PP Neue Corp Wide', sans-serif", fontWeight: 800,
          fontSize: "clamp(2rem, 4vw, 3rem)", color: "#fff",
          margin: "0 0 0.3rem",
        }}>
          {activeProduct.name}
        </p>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontStyle: "italic",
          fontSize: "0.95rem", color: "rgba(255,255,255,0.45)",
          margin: "0 0 1.2rem",
        }}>
          {activeProduct.tagline}
        </p>

        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1.2rem" }}>
          <span style={{
            fontFamily: "'PP Neue Corp Wide', sans-serif", fontWeight: 800,
            fontSize: "1.4rem", color: "#fff",
          }}>
            $39.99
          </span>
          <Link
            href={`/shop/${activeProduct.slug}`}
            style={{
              fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
              fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase",
              textDecoration: "none", padding: "0.9rem 2.2rem",
              background: "transparent", color: "#fff",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: "999px",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              transition: "transform 300ms cubic-bezier(0.16,1,0.3,1), box-shadow 300ms ease",
            }}
          >
            Explore
          </Link>
        </div>
      </div>

      {/* ── Nav dots ── */}
      <div style={{
        display: "flex", justifyContent: "center", gap: "0.8rem",
        paddingBottom: "2.5rem", position: "relative", zIndex: 20,
      }}>
        {PRODUCTS.map((p, i) => (
          <button
            key={p.slug}
            onClick={() => { setCurrentIndex(i); setDirection(i > currentIndex ? 1 : -1); }}
            style={{
              width: i === currentIndex ? "32px" : "8px",
              height: "8px",
              borderRadius: "999px",
              border: "none",
              background: i === currentIndex ? "#fff" : "rgba(255,255,255,0.2)",
              cursor: "pointer",
              transition: "all 400ms cubic-bezier(0.16,1,0.3,1)",
              padding: 0,
            }}
            aria-label={p.name}
          />
        ))}
      </div>
      {/* Mobile styles */}
      <style>{`
        @media (max-width: 768px) {
          .shop-carousel-img {
            width: 200px !important;
            height: 300px !important;
          }
        }
      `}</style>
    </main>
  );
}

"use client";

/**
 * Shop — Carrousel 3D incurvé infini (style Red Bull)
 * Les bouteilles sont disposées sur un cylindre virtuel.
 * Le produit au centre est mis en avant. Rotation infinie au drag/scroll.
 */

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { PRODUCTS } from "@/data/products";

// Images produit (nouvelles photos)
const PRODUCT_IMAGES: Record<string, string> = {
  "blue-razz": "/images/products/blue-razz.jpg",
  mango: "/images/products/mango.jpg",
  grape: "/images/products/grape.jpg",
};

// On duplique les produits pour l'effet infini (3 → 9 minimum)
const ITEMS = [...PRODUCTS, ...PRODUCTS, ...PRODUCTS];
const REAL_COUNT = PRODUCTS.length; // 3

export default function ShopPage() {
  const [rotation, setRotation] = useState(0); // angle en degrés
  const [isDragging, setIsDragging] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const dragStart = useRef(0);
  const dragRotation = useRef(0);
  const velocity = useRef(0);
  const animFrame = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const ANGLE_PER_ITEM = 360 / REAL_COUNT; // 120° entre chaque produit

  // Calculer quel produit est actif (au centre)
  useEffect(() => {
    const normalized = ((rotation % 360) + 360) % 360;
    const idx = Math.round(normalized / ANGLE_PER_ITEM) % REAL_COUNT;
    setActiveIndex(idx);
  }, [rotation, ANGLE_PER_ITEM]);

  // Inertie après drag
  useEffect(() => {
    if (isDragging) return;

    let vel = velocity.current;
    const decelerate = () => {
      if (Math.abs(vel) < 0.1) {
        // Snap au produit le plus proche
        const normalized = ((rotation % 360) + 360) % 360;
        const nearestAngle = Math.round(normalized / ANGLE_PER_ITEM) * ANGLE_PER_ITEM;
        setRotation((prev) => {
          const diff = nearestAngle - (((prev % 360) + 360) % 360);
          return prev + diff * 0.15;
        });
        return;
      }
      vel *= 0.95; // friction
      setRotation((prev) => prev + vel);
      animFrame.current = requestAnimationFrame(decelerate);
    };
    animFrame.current = requestAnimationFrame(decelerate);
    return () => cancelAnimationFrame(animFrame.current);
  }, [isDragging, ANGLE_PER_ITEM, rotation]);

  // Mouse/touch handlers
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      setIsDragging(true);
      dragStart.current = e.clientX;
      dragRotation.current = rotation;
      velocity.current = 0;
      cancelAnimationFrame(animFrame.current);
    },
    [rotation]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStart.current;
      const newVel = dx * 0.15 - (rotation - dragRotation.current);
      velocity.current = newVel * 0.3;
      setRotation(dragRotation.current + dx * 0.15);
    },
    [isDragging, rotation]
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Wheel handler
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    setRotation((prev) => prev + e.deltaY * 0.08);
    velocity.current = e.deltaY * 0.05;
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  // Nav dots
  const goTo = (idx: number) => {
    const target = idx * ANGLE_PER_ITEM;
    setRotation(target);
    velocity.current = 0;
  };

  const activeProduct = PRODUCTS[activeIndex];
  const bgColor = activeProduct?.background || "#050505";
  const accentColor = activeProduct?.accent || "#fff";

  return (
    <main
      style={{
        background: bgColor,
        minHeight: "100vh",
        transition: "background 800ms ease",
        overflow: "hidden",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Top section: branding ── */}
      <div
        style={{
          textAlign: "center",
          paddingTop: "8rem",
          paddingBottom: "1rem",
          position: "relative",
          zIndex: 10,
        }}
      >
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300,
            fontSize: "0.6rem",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.2)",
            marginBottom: "0.8rem",
          }}
        >
          PRE-WORKOUT SHOT · 60ML
        </p>
        <h1
          style={{
            fontFamily: "'PP Neue Corp Wide', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            color: "#fff",
            margin: 0,
            letterSpacing: "-0.02em",
          }}
        >
          CHOOSE YOUR FLAVOR
        </h1>
      </div>

      {/* ── Carrousel 3D ── */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          perspective: "1200px",
          cursor: isDragging ? "grabbing" : "grab",
          userSelect: "none",
          touchAction: "none",
          position: "relative",
          minHeight: "55vh",
        }}
      >
        {/* Glow sous le produit actif */}
        <div
          style={{
            position: "absolute",
            bottom: "5%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "400px",
            height: "200px",
            background: `radial-gradient(ellipse, ${accentColor}30 0%, transparent 70%)`,
            filter: "blur(60px)",
            pointerEvents: "none",
            transition: "background 600ms ease",
          }}
        />

        {/* Le cylindre */}
        <div
          style={{
            position: "relative",
            width: "300px",
            height: "420px",
            transformStyle: "preserve-3d",
            transform: `rotateY(${-rotation}deg)`,
            transition: isDragging ? "none" : "transform 0.4s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          {PRODUCTS.map((product, i) => {
            const angle = i * ANGLE_PER_ITEM;
            const radius = 400; // distance du centre
            const isActive = i === activeIndex;

            return (
              <div
                key={product.slug}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "opacity 400ms ease, filter 400ms ease",
                  opacity: isActive ? 1 : 0.4,
                  filter: isActive ? "none" : "brightness(0.5) blur(1px)",
                  pointerEvents: isActive ? "auto" : "none",
                }}
              >
                <Link href={`/shop/${product.slug}`} style={{ textDecoration: "none" }}>
                  <img
                    src={PRODUCT_IMAGES[product.slug]}
                    alt={product.name}
                    draggable={false}
                    style={{
                      width: "260px",
                      height: "380px",
                      objectFit: "contain",
                      transition: "transform 400ms cubic-bezier(0.16,1,0.3,1)",
                      transform: isActive ? "scale(1.08)" : "scale(0.9)",
                    }}
                  />
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Product info (sous le carrousel) ── */}
      <div
        style={{
          textAlign: "center",
          padding: "0 2rem 2rem",
          position: "relative",
          zIndex: 10,
        }}
      >
        <p
          style={{
            fontFamily: "'PP Neue Corp Wide', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(2rem, 4vw, 3rem)",
            color: accentColor,
            margin: "0 0 0.3rem",
            transition: "color 600ms ease",
          }}
        >
          {activeProduct?.name}
        </p>
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300,
            fontStyle: "italic",
            fontSize: "0.95rem",
            color: `${accentColor}80`,
            margin: "0 0 1.5rem",
            transition: "color 600ms ease",
          }}
        >
          {activeProduct?.tagline}
        </p>

        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1.2rem" }}>
          <span
            style={{
              fontFamily: "'PP Neue Corp Wide', sans-serif",
              fontWeight: 800,
              fontSize: "1.4rem",
              color: "#fff",
            }}
          >
            $39.99
          </span>
          <Link
            href={`/shop/${activeProduct?.slug}`}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500,
              fontSize: "0.75rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              textDecoration: "none",
              padding: "0.8rem 2rem",
              background: accentColor,
              color: bgColor,
              transition: "background 600ms ease, color 600ms ease",
            }}
          >
            Explore
          </Link>
        </div>
      </div>

      {/* ── Nav dots ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "0.8rem",
          paddingBottom: "3rem",
          position: "relative",
          zIndex: 10,
        }}
      >
        {PRODUCTS.map((p, i) => (
          <button
            key={p.slug}
            onClick={() => goTo(i)}
            style={{
              width: i === activeIndex ? "32px" : "8px",
              height: "8px",
              borderRadius: "999px",
              border: "none",
              background: i === activeIndex ? p.accent : "rgba(255,255,255,0.2)",
              cursor: "pointer",
              transition: "all 400ms cubic-bezier(0.16,1,0.3,1)",
              padding: 0,
            }}
            aria-label={p.name}
          />
        ))}
      </div>
    </main>
  );
}

"use client";

/**
 * Navbar — floating pill, glass morphism
 * Style Lemurian Labs : centrée, pill shape, compact, glass blur
 * Disparaît au scroll down, réapparaît au scroll up
 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const NAV_ITEMS = [
  { label: "Science", href: "/science" },
  { label: "Shop", href: "/shop" },
  { label: "About", href: "/about" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setHidden(y > lastScrollY.current && y > 80);
      setScrolled(y > 50);
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Floating pill navbar */}
      <nav
        style={{
          position: "fixed",
          top: "1rem",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 50,
          transition: "transform 500ms cubic-bezier(0.16,1,0.3,1), background 400ms ease, box-shadow 400ms ease",
          background: scrolled ? "rgba(10,10,10,0.55)" : "rgba(10,10,10,0.3)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderRadius: "999px",
          border: scrolled ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(255,255,255,0.05)",
          boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.3)" : "none",
          display: "flex",
          alignItems: "center",
          padding: "0.5rem 0.6rem 0.5rem 1.4rem",
          gap: "0.2rem",
          height: "48px",
        }}
      >
        {/* Logo — left side of pill */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            marginRight: "1.2rem",
          }}
        >
          <img
            src="/images/products/AXION.PNG"
            alt="AXION"
            style={{
              height: "28px",
              width: "auto",
              objectFit: "contain",
            }}
          />
        </Link>

        {/* Desktop nav items — center of pill */}
        <div className="axion-nav-desktop" style={{ display: "flex", alignItems: "center", gap: "0.15rem" }}>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 400,
                fontSize: "0.7rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.5)",
                textDecoration: "none",
                transition: "color 250ms ease, background 250ms ease",
                padding: "0.4rem 0.75rem",
                borderRadius: "999px",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#fff";
                e.currentTarget.style.background = "rgba(255,255,255,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(255,255,255,0.5)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* CTA — right side of pill */}
        <Link
          href="/shop"
          className="axion-nav-cta"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 500,
            fontSize: "0.65rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#050505",
            background: "#fff",
            textDecoration: "none",
            padding: "0.45rem 1rem",
            borderRadius: "999px",
            marginLeft: "0.8rem",
            whiteSpace: "nowrap",
            transition: "background 300ms ease, color 300ms ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.85)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#fff";
          }}
        >
          Get Started
        </Link>

        {/* Mobile hamburger */}
        <button
          className="axion-nav-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: "none",
            background: "none",
            border: "none",
            cursor: "pointer",
            flexDirection: "column",
            gap: "4px",
            padding: "6px",
            marginLeft: "0.5rem",
          }}
          aria-label="Menu"
        >
          <span style={{ width: "20px", height: "1.5px", background: "#fff", borderRadius: "1px", transition: "all 300ms" }} />
          <span style={{ width: "20px", height: "1.5px", background: "#fff", borderRadius: "1px", transition: "all 300ms" }} />
          <span style={{ width: "14px", height: "1.5px", background: "#fff", borderRadius: "1px", transition: "all 300ms" }} />
        </button>
      </nav>

      {/* Mobile overlay menu */}
      {menuOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 49,
            background: "rgba(5,5,5,0.96)",
            backdropFilter: "blur(24px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1.8rem",
          }}
          onClick={() => setMenuOpen(false)}
        >
          <Link
            href="/"
            style={{ textDecoration: "none", marginBottom: "1.5rem" }}
            onClick={() => setMenuOpen(false)}
          >
            <img
              src="/images/products/AXION.PNG"
              alt="AXION"
              style={{ height: "36px", width: "auto", objectFit: "contain" }}
            />
          </Link>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 400,
                fontSize: "1.1rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.55)",
                textDecoration: "none",
                transition: "color 300ms ease",
              }}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .axion-nav-desktop { display: none !important; }
          .axion-nav-cta { display: none !important; }
          .axion-nav-hamburger { display: flex !important; }
          nav { padding: 0.5rem 1rem 0.5rem 1rem !important; }
        }
      `}</style>
    </>
  );
}

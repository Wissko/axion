"use client";

/**
 * Navbar — ghost navigation bar
 * Transparent par défaut, glass blur au scroll, disparaît au scroll down, réapparaît au scroll up
 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
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
      setScrolled(y > 100);
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 50,
          transform: hidden ? "translateY(-100%)" : "translateY(0)",
          transition: "transform 400ms cubic-bezier(0.16,1,0.3,1), background 400ms ease",
          background: scrolled ? "rgba(5,5,5,0.75)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1.2rem 3rem",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            fontFamily: "'PP Neue Corp Wide', sans-serif",
            fontWeight: 800,
            fontSize: "1.2rem",
            color: "#fff",
            letterSpacing: "0.1em",
            textDecoration: "none",
          }}
        >
          AXION
        </Link>

        {/* Desktop nav items */}
        <div className="axion-nav-desktop" style={{ display: "flex", gap: "2rem" }}>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 400,
                fontSize: "0.75rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.5)",
                textDecoration: "none",
                transition: "color 300ms ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
            >
              {item.label}
            </Link>
          ))}
        </div>

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
            gap: "5px",
            padding: "4px",
          }}
          aria-label="Menu"
        >
          <span style={{ width: "24px", height: "2px", background: "#fff", transition: "all 300ms" }} />
          <span style={{ width: "24px", height: "2px", background: "#fff", transition: "all 300ms" }} />
          <span style={{ width: "24px", height: "2px", background: "#fff", transition: "all 300ms" }} />
        </button>
      </nav>

      {/* Mobile overlay menu */}
      {menuOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 49,
            background: "rgba(5,5,5,0.95)",
            backdropFilter: "blur(20px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "2rem",
          }}
          onClick={() => setMenuOpen(false)}
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                fontFamily: "'PP Neue Corp Wide', sans-serif",
                fontWeight: 800,
                fontSize: "1.5rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.7)",
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
          .axion-nav-hamburger { display: flex !important; }
        }
      `}</style>
    </>
  );
}

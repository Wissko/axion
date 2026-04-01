/**
 * Shop overview — 3 products side by side
 */

import { Metadata } from "next";
import Link from "next/link";
import { PRODUCTS } from "@/data/products";

export const metadata: Metadata = {
  title: "Shop | AXION",
  description: "Shop AXION Electric Pre-Workout. Blue Razz, Mango, Grape.",
};

export default function ShopPage() {
  return (
    <main style={{ background: "#050505", minHeight: "100vh", paddingTop: "8rem", paddingBottom: "4rem" }}>
      <section style={{ textAlign: "center", padding: "0 2rem", marginBottom: "4rem" }}>
        <h1 style={{
          fontFamily: "'PP Neue Corp Wide', sans-serif", fontWeight: 800,
          fontSize: "clamp(2.5rem, 6vw, 5rem)", color: "#fff", margin: "0 0 1rem",
        }}>
          Shop
        </h1>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
          fontSize: "1rem", color: "rgba(255,255,255,0.4)",
        }}>
          Three flavors. One formula. Choose your weapon.
        </p>
      </section>

      <section style={{
        maxWidth: "1000px", margin: "0 auto", padding: "0 2rem",
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem",
      }}>
        {PRODUCTS.map((p) => (
          <Link
            key={p.slug}
            href={`/shop/${p.slug}`}
            style={{
              textDecoration: "none",
              border: `1px solid ${p.accent}30`,
              borderRadius: "2px",
              padding: "2.5rem 2rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              transition: "border-color 400ms ease, transform 300ms ease",
              background: p.background,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = p.accent;
              e.currentTarget.style.transform = "translateY(-4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = `${p.accent}30`;
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <span style={{
              fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: "0.65rem",
              letterSpacing: "0.3em", textTransform: "uppercase", color: p.accent, marginBottom: "1rem",
            }}>
              {p.label}
            </span>
            <h2 style={{
              fontFamily: "'PP Neue Corp Wide', sans-serif", fontWeight: 800,
              fontSize: "2.5rem", color: p.accent, margin: "0 0 0.5rem",
            }}>
              {p.name}
            </h2>
            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontStyle: "italic",
              fontSize: "0.95rem", color: `${p.accent}99`, margin: 0,
            }}>
              {p.tagline}
            </p>
          </Link>
        ))}
      </section>
    </main>
  );
}

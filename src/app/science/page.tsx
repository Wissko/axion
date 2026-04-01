/**
 * Science page — "The Science Behind AXION"
 * Ingrédients, dosages, rôle de chaque composant
 */

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Science | AXION",
  description: "The science behind AXION Electric Pre-Workout. Clinical doses, no fillers.",
};

const INGREDIENTS = [
  { name: "Caffeine Anhydrous", dose: "200mg", desc: "Rapid energy delivery. Stimulates the central nervous system for immediate alertness and drive." },
  { name: "L-Theanine", dose: "150mg", desc: "Amino acid from green tea. Smooths caffeine's edge for clean, jitter-free focus." },
  { name: "Beta-Alanine", dose: "2,000-2,500mg", desc: "Buffers lactic acid in muscles. Push through fatigue barriers and extend your working sets." },
  { name: "Citrulline Malate", dose: "4,000-6,000mg", desc: "Nitric oxide precursor. Maximizes blood flow, oxygen delivery, and the pump you feel." },
  { name: "Alpha GPC", dose: "200-300mg", desc: "Choline source for acetylcholine synthesis. Sharpens the mind-muscle connection." },
  { name: "L-Tyrosine", dose: "1,000mg", desc: "Dopamine precursor. Builds stress resilience and sustained mental performance." },
  { name: "Grape Seed Extract", dose: "100mg", desc: "Potent antioxidant. Supports vascular health and post-training recovery." },
  { name: "Vitamin B6 + B12", dose: "5mg / 100mcg", desc: "Essential coenzymes in energy metabolism. Convert fuel into usable ATP." },
];

export default function SciencePage() {
  return (
    <main style={{ background: "#050505", minHeight: "100vh", paddingTop: "8rem", paddingBottom: "4rem" }}>
      {/* Hero */}
      <section style={{ textAlign: "center", padding: "0 2rem", marginBottom: "5rem" }}>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: "0.7rem",
          letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)",
          marginBottom: "1.5rem",
        }}>
          THE FORMULA
        </p>
        <h1 style={{
          fontFamily: "'PP Neue Corp Wide', sans-serif", fontWeight: 800,
          fontSize: "clamp(2.5rem, 6vw, 5rem)", color: "#fff", margin: "0 0 1rem",
          letterSpacing: "-0.02em", lineHeight: 1,
        }}>
          Engineered Performance
        </h1>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontStyle: "italic",
          fontSize: "1.1rem", color: "rgba(255,255,255,0.4)", maxWidth: "500px", margin: "0 auto",
        }}>
          Every ingredient dosed at clinical levels. No fillers. No proprietary blends. Just results.
        </p>
      </section>

      {/* Ingredients grid */}
      <section style={{
        maxWidth: "900px", margin: "0 auto", padding: "0 2rem",
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "2.5rem",
      }}>
        {INGREDIENTS.map((ing) => (
          <div key={ing.name} style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.6rem" }}>
              <h3 style={{
                fontFamily: "'PP Neue Corp Wide', sans-serif", fontWeight: 800,
                fontSize: "0.9rem", color: "#fff", letterSpacing: "0.05em", margin: 0,
              }}>
                {ing.name}
              </h3>
              <span style={{
                fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
                fontSize: "0.75rem", color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em",
              }}>
                {ing.dose}
              </span>
            </div>
            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
              fontSize: "0.9rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, margin: 0,
            }}>
              {ing.desc}
            </p>
          </div>
        ))}
      </section>
    </main>
  );
}

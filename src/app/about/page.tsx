/**
 * About page — AXION brand story
 */

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | AXION",
  description: "The story behind AXION. No fillers. No compromises.",
};

export default function AboutPage() {
  return (
    <main style={{ background: "#050505", minHeight: "100vh", paddingTop: "8rem", paddingBottom: "4rem", overflowX: "hidden" }}>
      <section style={{ maxWidth: "680px", margin: "0 auto", padding: "0 2rem" }}>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: "0.7rem",
          letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)",
          marginBottom: "1.5rem",
        }}>
          OUR STORY
        </p>

        <h1 style={{
          fontFamily: "'PP Neue Corp Wide', sans-serif", fontWeight: 800,
          fontSize: "clamp(2.5rem, 6vw, 4.5rem)", color: "#fff",
          margin: "0 0 2rem", lineHeight: 1.05,
        }}>
          Born from the gym floor.
        </h1>

        <div style={{ width: "60px", height: "1px", background: "rgba(255,255,255,0.15)", marginBottom: "2.5rem" }} />

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
            fontSize: "1rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.8, margin: 0,
          }}>
            AXION was born from a simple frustration: every pre-workout on the shelf was either underdosed, 
            overhyped, or loaded with fillers. We wanted something different. Something honest.
          </p>

          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
            fontSize: "1rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.8, margin: 0,
          }}>
            We built AXION with one principle: clinical doses of every ingredient, fully transparent labels, 
            and flavors you actually look forward to. No proprietary blends. No hidden formulas. 
            Every milligram accounted for.
          </p>

          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
            fontSize: "1rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.8, margin: 0,
          }}>
            Whether you train at 5 AM or midnight, in a garage gym or a competition floor, 
            AXION is engineered to match your intensity. Three flavors, one uncompromising formula.
          </p>

          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontStyle: "italic",
            fontSize: "1.1rem", color: "rgba(255,255,255,0.35)", lineHeight: 1.7, margin: "1rem 0 0",
          }}>
            "Train with intention. Fuel with precision."
          </p>
        </div>

        {/* Values */}
        <div style={{ marginTop: "4rem", display: "flex", flexDirection: "column", gap: "2rem" }}>
          {[
            { title: "Transparency", text: "Full label disclosure. Every ingredient, every dose, visible." },
            { title: "Clinical Dosing", text: "No pixie dusting. Ingredients at levels proven by research." },
            { title: "Clean Formulation", text: "No artificial colors. No unnecessary fillers. Just performance." },
          ].map((v) => (
            <div key={v.title} style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "1.2rem" }}>
              <h3 style={{
                fontFamily: "'PP Neue Corp Wide', sans-serif", fontWeight: 800,
                fontSize: "0.85rem", color: "#fff", letterSpacing: "0.1em", margin: "0 0 0.5rem",
              }}>
                {v.title}
              </h3>
              <p style={{
                fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
                fontSize: "0.9rem", color: "rgba(255,255,255,0.45)", margin: 0, lineHeight: 1.6,
              }}>
                {v.text}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

/**
 * Pricing page — 3 purchase options
 */

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing | AXION",
  description: "AXION pricing. Single, Duo, or Triple Stack.",
};

const PLANS = [
  {
    name: "Single Tub",
    price: "$39.99",
    desc: "One flavor, 30 servings.",
    features: ["30 servings", "Choose any flavor", "Free shipping over $50"],
    accent: "#4F9EF8",
    popular: false,
  },
  {
    name: "Duo Pack",
    price: "$69.99",
    desc: "Two flavors, save 12%.",
    features: ["60 servings total", "Mix any 2 flavors", "Free shipping", "10% off next order"],
    accent: "#F5B942",
    popular: true,
  },
  {
    name: "Triple Stack",
    price: "$94.99",
    desc: "All three flavors, save 20%.",
    features: ["90 servings total", "All 3 flavors", "Free shipping", "15% off next order", "Exclusive shaker"],
    accent: "#9B72F5",
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <main style={{ background: "#050505", minHeight: "100vh", paddingTop: "8rem", paddingBottom: "4rem" }}>
      <section style={{ textAlign: "center", padding: "0 2rem", marginBottom: "4rem" }}>
        <h1 style={{
          fontFamily: "'PP Neue Corp Wide', sans-serif", fontWeight: 800,
          fontSize: "clamp(2.5rem, 6vw, 5rem)", color: "#fff", margin: "0 0 1rem",
        }}>
          Pricing
        </h1>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
          fontSize: "1rem", color: "rgba(255,255,255,0.4)",
        }}>
          No subscriptions. No commitments. Just performance.
        </p>
      </section>

      <section style={{
        maxWidth: "1000px", margin: "0 auto", padding: "0 2rem",
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem",
        alignItems: "start",
      }}>
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            style={{
              border: `1px solid ${plan.popular ? plan.accent : "rgba(255,255,255,0.1)"}`,
              padding: "2.5rem 2rem",
              position: "relative",
              background: plan.popular ? `${plan.accent}08` : "transparent",
            }}
          >
            {plan.popular && (
              <div style={{
                position: "absolute", top: "-0.7rem", left: "50%", transform: "translateX(-50%)",
                fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: "0.65rem",
                letterSpacing: "0.2em", textTransform: "uppercase",
                background: plan.accent, color: "#050505", padding: "0.3rem 1rem",
              }}>
                Most Popular
              </div>
            )}

            <h3 style={{
              fontFamily: "'PP Neue Corp Wide', sans-serif", fontWeight: 800,
              fontSize: "1.2rem", color: "#fff", margin: "0 0 0.5rem",
            }}>
              {plan.name}
            </h3>

            <p style={{
              fontFamily: "'PP Neue Corp Wide', sans-serif", fontWeight: 800,
              fontSize: "2.5rem", color: plan.accent, margin: "0 0 0.5rem",
            }}>
              {plan.price}
            </p>

            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
              fontSize: "0.9rem", color: "rgba(255,255,255,0.4)", margin: "0 0 1.5rem",
            }}>
              {plan.desc}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "2rem" }}>
              {plan.features.map((f) => (
                <span key={f} style={{
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
                  fontSize: "0.85rem", color: "rgba(255,255,255,0.55)",
                }}>
                  {f}
                </span>
              ))}
            </div>

            <button style={{
              width: "100%", fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
              fontSize: "0.8rem", letterSpacing: "0.2em", textTransform: "uppercase",
              padding: "0.8rem", cursor: "pointer",
              border: `1px solid ${plan.accent}`,
              background: plan.popular ? plan.accent : "transparent",
              color: plan.popular ? "#050505" : plan.accent,
              transition: "all 400ms ease",
            }}>
              Select
            </button>
          </div>
        ))}
      </section>
    </main>
  );
}

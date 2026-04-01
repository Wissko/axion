/**
 * Individual product page — /shop/[slug]
 */

import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PRODUCTS } from "@/data/products";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const product = PRODUCTS.find((p) => p.slug === params.slug);
  return {
    title: product ? `${product.name} | AXION` : "Product | AXION",
    description: product?.description ?? "",
  };
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = PRODUCTS.find((p) => p.slug === params.slug);
  if (!product) return notFound();

  return (
    <main style={{ background: product.background, minHeight: "100vh", paddingTop: "8rem", paddingBottom: "4rem" }}>
      <section style={{ maxWidth: "800px", margin: "0 auto", padding: "0 2rem" }}>
        {/* Label */}
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: "0.65rem",
          letterSpacing: "0.35em", textTransform: "uppercase", color: product.accent, marginBottom: "1rem",
        }}>
          {product.label}
        </p>

        {/* Name */}
        <h1 style={{
          fontFamily: "'PP Neue Corp Wide', sans-serif", fontWeight: 800,
          fontSize: "clamp(3rem, 8vw, 6rem)", color: product.accent,
          margin: "0 0 0.5rem", lineHeight: 1,
        }}>
          {product.name}
        </h1>

        {/* Tagline */}
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontStyle: "italic",
          fontSize: "1.2rem", color: `${product.accent}A6`, margin: "0 0 2rem",
        }}>
          {product.tagline}
        </p>

        {/* Separator */}
        <div style={{ width: "60px", height: "1px", background: `${product.accent}66`, marginBottom: "2rem" }} />

        {/* Description */}
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
          fontSize: "1rem", color: `${product.accent}99`, lineHeight: 1.8,
          maxWidth: "560px", marginBottom: "3rem",
        }}>
          {product.description}
        </p>

        {/* Composition table */}
        <h3 style={{
          fontFamily: "'PP Neue Corp Wide', sans-serif", fontWeight: 800,
          fontSize: "0.8rem", letterSpacing: "0.2em", textTransform: "uppercase",
          color: "rgba(255,255,255,0.3)", marginBottom: "1.5rem",
        }}>
          Composition
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "3rem" }}>
          {product.ingredients.map((ing) => (
            <div
              key={ing.name}
              style={{
                display: "flex", justifyContent: "space-between", alignItems: "baseline",
                borderBottom: `1px solid ${product.accent}15`, paddingBottom: "0.8rem",
              }}
            >
              <div>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
                  fontSize: "0.9rem", color: "rgba(255,255,255,0.7)",
                }}>
                  {ing.name}
                </span>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
                  fontSize: "0.75rem", color: "rgba(255,255,255,0.35)", marginLeft: "0.8rem",
                }}>
                  {ing.role}
                </span>
              </div>
              <span style={{
                fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
                fontSize: "0.8rem", color: product.accent, letterSpacing: "0.1em",
              }}>
                {ing.dose}
              </span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
            fontSize: "0.85rem", letterSpacing: "0.2em", textTransform: "uppercase",
            padding: "1rem 2.5rem", border: `1px solid ${product.accent}`,
            background: product.accent, color: product.background,
            cursor: "pointer", transition: "all 400ms ease",
            marginBottom: "2rem",
          }}
        >
          Add to Cart
        </button>

        {/* Back link */}
        <div>
          <Link
            href="/shop"
            style={{
              fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
              fontSize: "0.8rem", color: "rgba(255,255,255,0.3)", textDecoration: "none",
              letterSpacing: "0.1em",
            }}
          >
            ← Back to Shop
          </Link>
        </div>
      </section>
    </main>
  );
}

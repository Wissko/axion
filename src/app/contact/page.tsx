"use client";

/**
 * Contact page — minimal form
 */

export default function ContactPage() {
  return (
    <main style={{ background: "#050505", minHeight: "100vh", paddingTop: "8rem", paddingBottom: "4rem" }}>
      <section style={{ maxWidth: "520px", margin: "0 auto", padding: "0 2rem" }}>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: "0.7rem",
          letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)",
          marginBottom: "1.5rem",
        }}>
          GET IN TOUCH
        </p>

        <h1 style={{
          fontFamily: "'PP Neue Corp Wide', sans-serif", fontWeight: 800,
          fontSize: "clamp(2.5rem, 6vw, 4rem)", color: "#fff",
          margin: "0 0 1rem", lineHeight: 1,
        }}>
          Contact
        </h1>

        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
          fontSize: "1rem", color: "rgba(255,255,255,0.4)", marginBottom: "3rem",
        }}>
          Questions, partnerships, or wholesale inquiries.
        </p>

        <form style={{ display: "flex", flexDirection: "column", gap: "2rem" }} onSubmit={(e) => e.preventDefault()}>
          <div>
            <label style={{
              fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: "0.7rem",
              letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)",
              display: "block", marginBottom: "0.5rem",
            }}>
              Name
            </label>
            <input
              type="text"
              style={{
                width: "100%", background: "transparent",
                border: "none", borderBottom: "1px solid rgba(255,255,255,0.15)",
                padding: "0.8rem 0", color: "#fff",
                fontFamily: "'DM Sans', sans-serif", fontSize: "1rem",
                outline: "none", transition: "border-color 300ms ease",
              }}
            />
          </div>

          <div>
            <label style={{
              fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: "0.7rem",
              letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)",
              display: "block", marginBottom: "0.5rem",
            }}>
              Email
            </label>
            <input
              type="email"
              style={{
                width: "100%", background: "transparent",
                border: "none", borderBottom: "1px solid rgba(255,255,255,0.15)",
                padding: "0.8rem 0", color: "#fff",
                fontFamily: "'DM Sans', sans-serif", fontSize: "1rem",
                outline: "none",
              }}
            />
          </div>

          <div>
            <label style={{
              fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: "0.7rem",
              letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)",
              display: "block", marginBottom: "0.5rem",
            }}>
              Message
            </label>
            <textarea
              rows={4}
              style={{
                width: "100%", background: "transparent", resize: "vertical",
                border: "none", borderBottom: "1px solid rgba(255,255,255,0.15)",
                padding: "0.8rem 0", color: "#fff",
                fontFamily: "'DM Sans', sans-serif", fontSize: "1rem",
                outline: "none",
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
              fontSize: "0.8rem", letterSpacing: "0.2em", textTransform: "uppercase",
              padding: "1rem 2rem", border: "1px solid rgba(255,255,255,0.3)",
              background: "transparent", color: "rgba(255,255,255,0.7)",
              cursor: "pointer", transition: "all 400ms ease",
              alignSelf: "stretch",
              minHeight: "48px",
            }}
          >
            Send Message
          </button>
        </form>
      </section>
    </main>
  );
}

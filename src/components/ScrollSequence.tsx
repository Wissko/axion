/**
 * ScrollSequence
 * Sticky canvas section that plays 90 frames across 3 product flavors
 * as the user scrolls through a 300vh pinned container.
 *
 * Frame layout:
 *   frames  1-30  → Frames_blue  (Blue Razz)
 *   frames 31-60  → Frames_orange (Mango)
 *   frames 61-90  → Frames_purple (Grape)
 *
 * Each frame image lives at /images/Frames_blue/frame-{n}.png etc.
 * At the start of each product block, an overlay fades in the product name.
 */

"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FRAMES_PER_FLAVOR = 30;
const TOTAL_FRAMES = 90; // 3 flavors x 30

interface Flavor {
  folder: string;
  name: string;
  subtitle: string;
  accent: string;
}

const FLAVORS: Flavor[] = [
  {
    folder: "Frames_blue",
    name: "Blue Razz",
    subtitle: "Electrifying Berry Burst",
    accent: "#3B82F6",
  },
  {
    folder: "Frames_orange",
    name: "Mango",
    subtitle: "Tropical Surge",
    accent: "#F0A830",
  },
  {
    folder: "Frames_purple",
    name: "Grape",
    subtitle: "Dark Grape Focus",
    accent: "#8B5CF6",
  },
];

/** Build the full ordered array of image paths (1-indexed frame names) */
function buildFramePaths(): string[] {
  const paths: string[] = [];
  for (const flavor of FLAVORS) {
    for (let i = 1; i <= FRAMES_PER_FLAVOR; i++) {
      paths.push(`/images/${flavor.folder}/frame-${i}.png`);
    }
  }
  return paths;
}

/** Pre-load all frames into HTMLImageElement cache */
function preloadFrames(paths: string[]): Promise<HTMLImageElement[]> {
  return Promise.all(
    paths.map(
      (src) =>
        new Promise<HTMLImageElement>((resolve) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => resolve(img); // continue even if a frame is missing
          img.src = src;
        })
    )
  );
}

export function ScrollSequence() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Tracks which flavor overlay is currently visible
  const [activeFlavor, setActiveFlavor] = useState<Flavor>(FLAVORS[0]);
  const [overlayVisible, setOverlayVisible] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const paths = buildFramePaths();
    let images: HTMLImageElement[] = [];
    let currentFrame = 0;

    // Resize canvas to fill viewport
    function resizeCanvas() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    /** Draw the frame at index `n` onto the canvas */
    function drawFrame(n: number) {
      if (!canvas || !ctx) return;
      const img = images[n];
      if (!img || !img.complete || !img.naturalWidth) return;

      // Cover-fit: center-crop the image to fill the canvas
      const scale = Math.max(
        canvas.width / img.naturalWidth,
        canvas.height / img.naturalHeight
      );
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      const dx = (canvas.width - dw) / 2;
      const dy = (canvas.height - dh) / 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, dx, dy, dw, dh);
    }

    /** Update overlay when entering a new flavor block */
    function updateOverlay(frameIndex: number) {
      const flavorIndex = Math.floor(frameIndex / FRAMES_PER_FLAVOR);
      const clamped = Math.min(flavorIndex, FLAVORS.length - 1);
      const flavor = FLAVORS[clamped];

      // Determine if we are near the start of a flavor block (first 5 frames)
      const localFrame = frameIndex % FRAMES_PER_FLAVOR;
      const visible = localFrame < 5;

      setActiveFlavor(flavor);
      setOverlayVisible(visible);
    }

    // Load images, then wire ScrollTrigger
    preloadFrames(paths).then((loaded) => {
      images = loaded;
      drawFrame(0);

      const st = ScrollTrigger.create({
        trigger: wrapper,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
        onUpdate: (self) => {
          const rawIndex = Math.round(self.progress * (TOTAL_FRAMES - 1));
          const frameIndex = Math.max(0, Math.min(rawIndex, TOTAL_FRAMES - 1));

          if (frameIndex !== currentFrame) {
            currentFrame = frameIndex;
            drawFrame(frameIndex);
            updateOverlay(frameIndex);
          }
        },
      });

      return () => st.kill();
    });

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    // 300vh scroll container — canvas sticks to viewport
    <div
      ref={wrapperRef}
      className="relative"
      style={{ height: "300vh", backgroundColor: "#0A0804" }}
    >
      {/* Sticky canvas */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ display: "block" }}
        />

        {/* Product overlay — always in DOM, toggled via opacity */}
        <div
          ref={overlayRef}
          className="absolute inset-0 flex flex-col items-center justify-end pb-24 z-10 pointer-events-none transition-opacity duration-500"
          style={{ opacity: overlayVisible ? 1 : 0 }}
        >
          <p
            className="uppercase tracking-widest mb-3"
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontWeight: 300,
              fontSize: "clamp(0.7rem, 1vw, 0.95rem)",
              letterSpacing: "0.35em",
              color: activeFlavor.accent,
            }}
          >
            AXION Electric Pre
          </p>
          <h2
            className="uppercase text-center leading-none"
            style={{
              fontFamily: "PP Neue Corp Wide, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(2.5rem, 7vw, 8rem)",
              color: "#F5F0E6",
              textShadow: `0 0 60px ${activeFlavor.accent}80`,
            }}
          >
            {activeFlavor.name}
          </h2>
          <p
            className="mt-4 uppercase tracking-widest"
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontWeight: 300,
              fontSize: "clamp(0.75rem, 1.1vw, 1rem)",
              letterSpacing: "0.3em",
              color: "rgba(245,240,230,0.5)",
            }}
          >
            {activeFlavor.subtitle}
          </p>
        </div>

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none z-20"
          style={{
            height: "20%",
            background: "linear-gradient(to bottom, transparent, #0A0804)",
          }}
        />
      </div>
    </div>
  );
}

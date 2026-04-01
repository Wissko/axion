"use client"

/**
 * ProductCanvas — affiche un modèle GLB avec autorotation et éclairage accent
 * Utilise React Three Fiber + @react-three/drei
 */

import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, ContactShadows } from '@react-three/drei'
import { useRef, Suspense } from 'react'
import * as THREE from 'three'

// ──────────────────────────────────────────────────────
// TYPES
// ──────────────────────────────────────────────────────

interface ProductCanvasProps {
  /** Chemin du modèle GLB, ex: "/models/blue-razz.glb" */
  modelPath: string
  /** Couleur accent du produit, ex: "#4F9EF8" */
  accentColor: string
  /** Autorotation active (default: true) */
  autoRotate?: boolean
}

// ──────────────────────────────────────────────────────
// SPINNER FALLBACK — pendant le chargement du GLB
// ──────────────────────────────────────────────────────

function SpinnerFallback({ accentColor }: { accentColor: string }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          border: `2px solid ${accentColor}33`,
          borderTopColor: accentColor,
          animation: 'axion-spin 0.8s linear infinite',
        }}
      />
      <style>{`
        @keyframes axion-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

// ──────────────────────────────────────────────────────
// MODEL — composant interne R3F
// ──────────────────────────────────────────────────────

function Model({ path, accentColor }: { path: string; accentColor: string }) {
  const { scene } = useGLTF(path)
  const groupRef = useRef<THREE.Group>(null)

  // Autorotation douce + breathing effect
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05
    }
  })

  return (
    <group ref={groupRef} rotation={[0, 0, Math.PI / 4.5]}>
      <primitive object={scene} scale={1.5} position={[0, -0.7, 0]} />
    </group>
  )
}

// ──────────────────────────────────────────────────────
// PRODUCTCANVAS — export principal
// ──────────────────────────────────────────────────────

export function ProductCanvas({
  modelPath,
  accentColor,
  autoRotate = true,
}: ProductCanvasProps) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Spinner supprimé — le canvas couvre tout dès le mount */}

      <Canvas
        camera={{ position: [0, 0, 3.5], fov: 45 }}
        style={{ background: 'transparent', position: 'relative', zIndex: 2 }}
        gl={{ alpha: true, antialias: true }}
      >
        <Suspense fallback={null}>
          {/* Lumière ambiante douce */}
          <ambientLight intensity={0.4} />

          {/* Lumière principale — couleur accent */}
          <pointLight position={[2, 3, 2]} intensity={2.5} color={accentColor} />

          {/* Lumière de remplissage opposée — blanc froid */}
          <pointLight position={[-2, -1, -2]} intensity={0.8} color="#ffffff" />

          {/* Lumière de contour (rim light) */}
          <pointLight position={[0, -2, -3]} intensity={1.2} color={accentColor} />

          {/* Modèle 3D */}
          <Model path={modelPath} accentColor={accentColor} />

          {/* Ombre de contact subtile */}
          <ContactShadows
            position={[0, -1.5, 0]}
            opacity={0.3}
            scale={3}
            blur={2}
            color={accentColor}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}

// Note: useGLTF.preload() calls are intentionally removed from module scope
// to avoid SSR initialization issues. Preloading is handled by the browser
// when the dynamic component hydrates client-side.

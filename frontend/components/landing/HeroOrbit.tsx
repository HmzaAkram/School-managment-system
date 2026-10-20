"use client";

import { useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, Sparkles } from "@react-three/drei";
import * as THREE from "three";

/* ---------- Theme ---------- */
const GOLD = "#C4993C";
const GOLD_LIGHT = "#D4A843";
const CORE_COLOR = "#23201B";

/* ---------- Orbiting cards ---------- */
const CARDS = [
  { icon: "🎓", label: "ATTENDANCE", text: "96.2% Present Today" },
  { icon: "💳", label: "RECOVERY ENGINE", text: "98.4% Fee Collection" },
  { icon: "📊", label: "RESULTS", text: "Term 2 Published" },
  { icon: "🗓️", label: "TIMETABLE", text: "Next: Math, 9:40" },
  { icon: "✨", label: "AI ASSISTANT", text: "Ask anything, role-safe" },
];

const ORBIT_RADIUS = 5.5;
const SPHERE_OFFSET_X = 3.5;  // Push sphere to the right so text on left stays clear

function InfoCard({ icon, label, text }: { icon: string; label: string; text: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 14px",
        borderRadius: 14,
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(201,162,75,0.3)",
        boxShadow:
          "0 8px 32px rgba(35,32,27,0.12), 0 2px 8px rgba(196,153,60,0.08)",
        whiteSpace: "nowrap",
        userSelect: "none",
        pointerEvents: "none",
      }}
    >
      <span
        style={{
          width: 30,
          height: 30,
          borderRadius: 9,
          display: "grid",
          placeItems: "center",
          fontSize: 15,
          background: "rgba(196,153,60,0.15)",
          flexShrink: 0,
        }}
      >
        {icon}
      </span>
      <span>
        <span
          style={{
            display: "block",
            fontFamily: "ui-monospace, Menlo, monospace",
            fontSize: 9.5,
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: "#8C877D",
            lineHeight: 1.3,
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#23201B",
            lineHeight: 1.3,
          }}
        >
          {text}
        </span>
      </span>
    </div>
  );
}

/* ---------- Thick visible gold ring ---------- */
function GoldRing({
  radius,
  tube,
  rotation,
  opacity,
}: {
  radius: number;
  tube: number;
  rotation: [number, number, number];
  opacity: number;
}) {
  return (
    <mesh rotation={rotation}>
      <torusGeometry args={[radius, tube, 16, 200]} />
      <meshStandardMaterial
        color={GOLD}
        emissive={GOLD}
        emissiveIntensity={0.3}
        metalness={0.9}
        roughness={0.25}
        transparent
        opacity={opacity}
      />
    </mesh>
  );
}

/* ---------- Main 3D Scene ---------- */
function Scene({ reduced }: { reduced: boolean }) {
  const root = useRef<THREE.Group>(null!);
  const core = useRef<THREE.Mesh>(null!);
  const wire1 = useRef<THREE.Mesh>(null!);
  const wire2 = useRef<THREE.Mesh>(null!);
  const glow = useRef<THREE.Mesh>(null!);
  const spin = useRef<THREE.Group>(null!);

  useFrame((state, delta) => {
    const speed = reduced ? 0.2 : 1;
    const { x, y } = state.pointer;

    // Smooth mouse tilt
    root.current.rotation.y += (x * 0.25 - root.current.rotation.y) * 0.04;
    root.current.rotation.x += (-y * 0.15 - root.current.rotation.x) * 0.04;

    // Core sphere slow rotation
    core.current.rotation.y += delta * 0.12 * speed;

    // Wireframe counter-rotations
    wire1.current.rotation.y -= delta * 0.06 * speed;
    wire1.current.rotation.x += delta * 0.04 * speed;
    wire2.current.rotation.y += delta * 0.1 * speed;
    wire2.current.rotation.z -= delta * 0.03 * speed;

    // Glow pulse
    const glowMat = glow.current.material as THREE.MeshBasicMaterial;
    glowMat.opacity = 0.08 + Math.sin(state.clock.elapsedTime * 1.5) * 0.04;

    // Card orbit speed
    spin.current.rotation.y += delta * 0.22 * speed;
  });

  return (
    <group ref={root} position={[SPHERE_OFFSET_X, 0, 0]}>
      {/* Lighting tuned for cream background */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 8, 6]} intensity={2.5} color="#ffffff" />
      <directionalLight
        position={[-4, -2, 3]}
        intensity={1.5}
        color={GOLD_LIGHT}
      />
      <pointLight position={[0, 2, 4]} intensity={15} color="#ffedc2" />
      <pointLight position={[-3, 3, -3]} intensity={10} color={GOLD} />

      {/* Main core sphere — 1.75 radius for ~55-60% of viewport height */}
      <mesh ref={core}>
        <sphereGeometry args={[1.75, 64, 48]} />
        <meshStandardMaterial
          color={CORE_COLOR}
          metalness={0.88}
          roughness={0.15}
          envMapIntensity={2}
        />
      </mesh>

      {/* Subtle warm glow behind sphere */}
      <mesh ref={glow}>
        <sphereGeometry args={[2.15, 32, 32]} />
        <meshBasicMaterial
          color={GOLD}
          transparent
          opacity={0.12}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Wireframe shell 1 - gold grid */}
      <mesh ref={wire1}>
        <sphereGeometry args={[1.92, 24, 16]} />
        <meshStandardMaterial
          color={GOLD}
          emissive={GOLD}
          emissiveIntensity={0.5}
          wireframe
          transparent
          opacity={0.4}
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      {/* Wireframe shell 2 - finer grid, opposite rotation */}
      <mesh ref={wire2}>
        <sphereGeometry args={[2.05, 36, 24]} />
        <meshStandardMaterial
          color={GOLD_LIGHT}
          emissive={GOLD_LIGHT}
          emissiveIntensity={0.3}
          wireframe
          transparent
          opacity={0.2}
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>

      {/* Decorative gold rings — scaled up proportionally */}
      <GoldRing
        radius={3.6}
        tube={0.04}
        rotation={[Math.PI / 2 + 0.35, 0, -0.15]}
        opacity={0.9}
      />
      <GoldRing
        radius={2.8}
        tube={0.03}
        rotation={[Math.PI / 2.5, 0, 0.5]}
        opacity={0.55}
      />
      <GoldRing
        radius={4.5}
        tube={0.022}
        rotation={[Math.PI / 2.15, 0, -0.55]}
        opacity={0.35}
      />

      {/* Gold sparkle particles — wider spread for full-bg */}
      <Sparkles
        count={80}
        scale={[18, 10, 14]}
        size={2.5}
        speed={0.25}
        color={GOLD}
        opacity={0.5}
      />

      {/* Orbiting cards — tilted plane */}
      <group rotation={[0.35, 0, -0.15]}>
        <group ref={spin}>
          {CARDS.map((c, i) => {
            const a = (i / CARDS.length) * Math.PI * 2;
            return (
              <group
                key={c.label}
                position={[
                  Math.cos(a) * ORBIT_RADIUS,
                  0,
                  Math.sin(a) * ORBIT_RADIUS,
                ]}
              >
                <Html
                  center
                  distanceFactor={8.5}
                  occlude={[core]}
                  zIndexRange={[20, 0]}
                  style={{
                    transition: "opacity 0.4s ease",
                    pointerEvents: "none",
                  }}
                >
                  <InfoCard {...c} />
                </Html>
              </group>
            );
          })}
        </group>
      </group>
    </group>
  );
}

/* Responsive camera — wider FOV for full-background mode */
function ResponsiveCamera() {
  const { camera, size } = useThree();
  useEffect(() => {
    // Pull camera back further since the canvas now covers the whole hero
    camera.position.z = size.width < 500 ? 12 : size.width < 900 ? 10 : 9;
    camera.updateProjectionMatrix();
  }, [camera, size]);
  return null;
}

export default function HeroOrbit({
  className = "",
  style = {},
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background:
          "radial-gradient(55% 55% at 50% 48%, rgba(196,153,60,0.12), transparent 70%)",
        ...style,
      }}
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 9], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
        style={{
          background: "transparent",
          outline: "none",
          border: "none",
        }}
        tabIndex={-1}
      >
        <ResponsiveCamera />
        <Scene reduced={reduced} />
      </Canvas>
    </div>
  );
}

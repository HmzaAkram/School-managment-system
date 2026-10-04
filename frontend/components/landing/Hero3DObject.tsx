"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Sparkles, Award, GraduationCap, ShieldCheck } from "lucide-react";

export default function Hero3DObject() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 480;
    const height = container.clientHeight || 480;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
    camera.position.set(0, 1.2, 5.8);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xfff8ee, 1.6);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 2.4);
    mainLight.position.set(5, 8, 6);
    scene.add(mainLight);

    const goldFillLight = new THREE.DirectionalLight(0xd4a843, 1.8);
    goldFillLight.position.set(-6, -2, -3);
    scene.add(goldFillLight);

    const warmPointLight = new THREE.PointLight(0xc4993c, 3, 10);
    warmPointLight.position.set(0, 2, 2.5);
    scene.add(warmPointLight);

    // Master Group for 3D Educational Object
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    const eduGroup = new THREE.Group();
    mainGroup.add(eduGroup);

    // Materials
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xc4993c,
      metalness: 0.85,
      roughness: 0.22,
    });

    const darkCapsuleMaterial = new THREE.MeshStandardMaterial({
      color: 0x23201b,
      roughness: 0.35,
      metalness: 0.15,
    });

    const ivoryBookCoverMat = new THREE.MeshStandardMaterial({
      color: 0x2d2823,
      roughness: 0.4,
      metalness: 0.2,
    });

    const pagesMat = new THREE.MeshStandardMaterial({
      color: 0xfaf6ef,
      roughness: 0.6,
      metalness: 0.05,
    });

    // ── 1. 3D Open Knowledge Book (Foundation) ──
    const bookGroup = new THREE.Group();
    bookGroup.position.set(0, -0.65, 0);
    eduGroup.add(bookGroup);

    // Left Page
    const pageLeftGeom = new THREE.BoxGeometry(1.35, 0.16, 1.8);
    const pageLeft = new THREE.Mesh(pageLeftGeom, pagesMat);
    pageLeft.position.set(-0.68, 0, 0);
    pageLeft.rotation.z = 0.14;
    bookGroup.add(pageLeft);

    // Right Page
    const pageRightGeom = new THREE.BoxGeometry(1.35, 0.16, 1.8);
    const pageRight = new THREE.Mesh(pageRightGeom, pagesMat);
    pageRight.position.set(0.68, 0, 0);
    pageRight.rotation.z = -0.14;
    bookGroup.add(pageRight);

    // Book Base Cover
    const coverGeom = new THREE.BoxGeometry(2.85, 0.08, 1.88);
    const cover = new THREE.Mesh(coverGeom, ivoryBookCoverMat);
    cover.position.set(0, -0.12, 0);
    bookGroup.add(cover);

    // Gold Ribbon Bookmark
    const ribbonGeom = new THREE.BoxGeometry(0.12, 0.02, 2.1);
    const ribbon = new THREE.Mesh(ribbonGeom, goldMaterial);
    ribbon.position.set(0, 0.1, 0.1);
    ribbon.rotation.x = 0.08;
    bookGroup.add(ribbon);

    // ── 2. 3D Graduation Cap (Mortarboard Floating on top) ──
    const capGroup = new THREE.Group();
    capGroup.position.set(0, 0.6, 0);
    eduGroup.add(capGroup);

    // Cap Skull Cap (Hemisphere / Cylinder base)
    const capBaseGeom = new THREE.CylinderGeometry(0.65, 0.55, 0.45, 32);
    const capBase = new THREE.Mesh(capBaseGeom, darkCapsuleMaterial);
    capBase.position.y = -0.22;
    capGroup.add(capBase);

    // Mortarboard Diamond Top Plate
    const topPlateGeom = new THREE.BoxGeometry(2.2, 0.06, 2.2);
    const topPlate = new THREE.Mesh(topPlateGeom, darkCapsuleMaterial);
    topPlate.rotation.y = Math.PI / 4; // Diamond rotation
    capGroup.add(topPlate);

    // Gold Edge Trim on Mortarboard
    const plateEdgesGeom = new THREE.EdgesGeometry(topPlateGeom);
    const plateEdgesMat = new THREE.LineBasicMaterial({ color: 0xffdf88, linewidth: 2, transparent: true, opacity: 0.8 });
    const plateEdges = new THREE.LineSegments(plateEdgesGeom, plateEdgesMat);
    plateEdges.rotation.y = Math.PI / 4;
    capGroup.add(plateEdges);

    // Center Gold Button
    const centerBtnGeom = new THREE.CylinderGeometry(0.1, 0.1, 0.08, 16);
    const centerBtn = new THREE.Mesh(centerBtnGeom, goldMaterial);
    centerBtn.position.y = 0.06;
    capGroup.add(centerBtn);

    // Tassel Band
    const tasselBandGeom = new THREE.BoxGeometry(0.04, 0.02, 0.85);
    const tasselBand = new THREE.Mesh(tasselBandGeom, goldMaterial);
    tasselBand.position.set(0.35, 0.05, 0.35);
    tasselBand.rotation.y = Math.PI / 4;
    capGroup.add(tasselBand);

    // Tassel Fringe (Hanging Gold Bell)
    const tasselFringeGeom = new THREE.ConeGeometry(0.08, 0.35, 16);
    const tasselFringe = new THREE.Mesh(tasselFringeGeom, goldMaterial);
    tasselFringe.position.set(0.72, -0.15, 0.72);
    tasselFringe.rotation.x = Math.PI;
    capGroup.add(tasselFringe);

    // ── 3. 3D Floating Gold Diploma Scroll ──
    const diplomaGroup = new THREE.Group();
    diplomaGroup.position.set(-1.4, 0.05, 0.4);
    diplomaGroup.rotation.set(0.3, 0.4, 0.5);
    eduGroup.add(diplomaGroup);

    const scrollGeom = new THREE.CylinderGeometry(0.14, 0.14, 1.2, 24);
    const scrollMesh = new THREE.Mesh(scrollGeom, pagesMat);
    diplomaGroup.add(scrollMesh);

    // Red/Gold Ribbon Ring on Scroll
    const scrollRibbonGeom = new THREE.CylinderGeometry(0.15, 0.15, 0.18, 24);
    const scrollRibbonMesh = new THREE.Mesh(scrollRibbonGeom, goldMaterial);
    diplomaGroup.add(scrollRibbonMesh);

    // ── 4. Floating 3D "A+" Academic Star Shield ──
    const shieldGroup = new THREE.Group();
    shieldGroup.position.set(1.4, 0.15, -0.2);
    shieldGroup.rotation.set(-0.2, -0.4, -0.2);
    eduGroup.add(shieldGroup);

    // Canvas Texture for A+ Seal
    const sealCanvas = document.createElement("canvas");
    sealCanvas.width = 256;
    sealCanvas.height = 256;
    const sCtx = sealCanvas.getContext("2d");
    if (sCtx) {
      sCtx.fillStyle = "#C4993C";
      sCtx.beginPath();
      sCtx.arc(128, 128, 120, 0, Math.PI * 2);
      sCtx.fill();

      sCtx.strokeStyle = "#FFFFFF";
      sCtx.lineWidth = 6;
      sCtx.beginPath();
      sCtx.arc(128, 128, 108, 0, Math.PI * 2);
      sCtx.stroke();

      sCtx.fillStyle = "#FFFFFF";
      sCtx.font = "bold 90px serif";
      sCtx.textAlign = "center";
      sCtx.textBaseline = "middle";
      sCtx.fillText("A+", 128, 125);
    }
    const sealTexture = new THREE.CanvasTexture(sealCanvas);
    const sealGeom = new THREE.CylinderGeometry(0.48, 0.48, 0.06, 32);
    const sealMat = new THREE.MeshStandardMaterial({
      map: sealTexture,
      roughness: 0.3,
      metalness: 0.6,
    });
    const sealMesh = new THREE.Mesh(sealGeom, sealMat);
    sealMesh.rotation.x = Math.PI / 2;
    shieldGroup.add(sealMesh);

    // ── 5. Orbiting Tech Rings & Stardust Particles ──
    const ringGeom1 = new THREE.TorusGeometry(2.35, 0.014, 16, 100);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xc4993c,
      emissive: 0x8a6328,
      roughness: 0.2,
      metalness: 0.8,
      transparent: true,
      opacity: 0.5,
    });
    const ring1 = new THREE.Mesh(ringGeom1, ringMat);
    ring1.rotation.x = Math.PI / 3.2;
    mainGroup.add(ring1);

    const ringGeom2 = new THREE.TorusGeometry(2.6, 0.01, 16, 100);
    const ring2 = new THREE.Mesh(ringGeom2, ringMat);
    ring2.rotation.x = -Math.PI / 3.8;
    ring2.rotation.y = Math.PI / 5;
    mainGroup.add(ring2);

    // Particles
    const particlesCount = 50;
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 6;
      posArray[i + 1] = (Math.random() - 0.5) * 5;
      posArray[i + 2] = (Math.random() - 0.5) * 4;
    }
    const particlesGeom = new THREE.BufferGeometry();
    particlesGeom.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
    const particlesMat = new THREE.PointsMaterial({
      size: 0.045,
      color: 0xd4a843,
      transparent: true,
      opacity: 0.9,
    });
    const particleSystem = new THREE.Points(particlesGeom, particlesMat);
    mainGroup.add(particleSystem);

    // Initial Isometric Orientation
    eduGroup.rotation.x = 0.25;
    eduGroup.rotation.y = -0.45;
    eduGroup.rotation.z = 0.05;

    setIsLoaded(true);

    // Mouse Parallax Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = x * 0.45;
      targetY = y * 0.35;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse follow
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      // Levitation Physics
      eduGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.12;

      // Smooth 3D Rotations
      eduGroup.rotation.x = 0.25 + mouseY * 0.5 + Math.sin(elapsedTime * 0.7) * 0.03;
      eduGroup.rotation.y = -0.45 + mouseX * 0.7 + Math.cos(elapsedTime * 0.5) * 0.04;

      // Floating individual items
      diplomaGroup.position.y = 0.05 + Math.sin(elapsedTime * 2 + 1) * 0.08;
      diplomaGroup.rotation.z = 0.5 + Math.cos(elapsedTime * 1.2) * 0.05;

      shieldGroup.position.y = 0.15 + Math.cos(elapsedTime * 1.8) * 0.08;
      shieldGroup.rotation.y = -0.4 + Math.sin(elapsedTime * 1.5) * 0.1;

      // Tassel swing
      tasselFringe.rotation.z = Math.sin(elapsedTime * 3) * 0.12;

      // Tech rings & particles
      ring1.rotation.z += 0.003;
      ring2.rotation.z -= 0.002;
      particleSystem.rotation.y = elapsedTime * 0.04;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full max-w-[540px] aspect-square flex items-center justify-center select-none">
      {/* Warm Ambient Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#C4993C]/20 via-[#D4A843]/15 to-transparent rounded-full filter blur-3xl pointer-events-none -z-10" />

      {/* 3D WebGL Canvas */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Educational Floating Badges */}
      <div className="absolute -top-2 right-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-[#EBE8E2] shadow-xl flex items-center gap-2 animate-float pointer-events-none">
        <div className="w-7 h-7 rounded-xl bg-amber-500/10 flex items-center justify-center text-[#C4993C]">
          <GraduationCap size={16} />
        </div>
        <div>
          <div className="text-[10px] uppercase font-bold font-mono tracking-wider text-[#8C877D]">ACADEMIC ERP</div>
          <div className="text-xs font-bold text-[#23201B]">100% Digital Schooling</div>
        </div>
      </div>

      <div className="absolute -bottom-3 left-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-[#EBE8E2] shadow-xl flex items-center gap-2 animate-float-reverse pointer-events-none">
        <div className="w-7 h-7 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
          <ShieldCheck size={16} />
        </div>
        <div>
          <div className="text-[10px] uppercase font-bold font-mono tracking-wider text-[#8C877D]">RECOVERY ENGINE</div>
          <div className="text-xs font-bold text-[#23201B]">98.4% Fee Collection</div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeLoginVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    // --- Scene Setup ---
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x03050d, 0.015);

    // --- Camera Setup ---
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 30;

    // --- Renderer Setup ---
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    containerRef.current.appendChild(renderer.domElement);

    // --- Create Particle Nodes ---
    const particleCount = 180;
    const positions = new Float32Array(particleCount * 3);
    const velocities: number[] = [];

    // Distribute particles in a spherical/ellipsoid cloud
    for (let i = 0; i < particleCount; i++) {
      // Random coordinates inside a bounding box
      const x = (Math.random() - 0.5) * 40;
      const y = (Math.random() - 0.5) * 40;
      const z = (Math.random() - 0.5) * 40;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Velocities for orbital float movement
      velocities.push(
        (Math.random() - 0.5) * 0.05, // dx
        (Math.random() - 0.5) * 0.05, // dy
        (Math.random() - 0.5) * 0.05  // dz
      );
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    // Custom glowing circle canvas texture for particles
    const createCircleTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 16;
      canvas.height = 16;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
        gradient.addColorStop(0, "rgba(0, 242, 254, 1)");
        gradient.addColorStop(0.2, "rgba(99, 102, 241, 0.8)");
        gradient.addColorStop(0.6, "rgba(99, 102, 241, 0.2)");
        gradient.addColorStop(1, "rgba(99, 102, 241, 0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 16, 16);
      }
      return new THREE.CanvasTexture(canvas);
    };

    const material = new THREE.PointsMaterial({
      size: 1.4,
      map: createCircleTexture(),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);

    // --- Dynamic Network Connection Lines ---
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x6366f1,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
    });

    let lineGeometry = new THREE.BufferGeometry();
    let lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lineSegments);

    // --- Lights ---
    const ambientLight = new THREE.AmbientLight(0x0f172a, 1);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x00f2fe, 50, 60);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xc084fc, 50, 60);
    pointLight2.position.set(-10, -10, 10);
    scene.add(pointLight2);

    // --- Cursor Tracking ---
    const handleMouseMove = (event: MouseEvent) => {
      // Normalize to -1 to 1
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // --- Resize Handler ---
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // --- Animation Loop ---
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Rotate particle network slowly
      particleSystem.rotation.y += 0.001;
      particleSystem.rotation.x += 0.0005;

      const posAttr = geometry.getAttribute("position") as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;

      // Update particle positions with their velocities
      for (let i = 0; i < particleCount; i++) {
        arr[i * 3] += velocities[i * 3];
        arr[i * 3 + 1] += velocities[i * 3 + 1];
        arr[i * 3 + 2] += velocities[i * 3 + 2];

        // Boundary bounce (keep inside -20 to 20 box)
        if (Math.abs(arr[i * 3]) > 20) velocities[i * 3] *= -1;
        if (Math.abs(arr[i * 3 + 1]) > 20) velocities[i * 3 + 1] *= -1;
        if (Math.abs(arr[i * 3 + 2]) > 20) velocities[i * 3 + 2] *= -1;
      }
      posAttr.needsUpdate = true;

      // --- Recompute line segments between close nodes ---
      const linePositions: number[] = [];
      const threshold = 7.5; // distance threshold for connection

      for (let i = 0; i < particleCount; i++) {
        const x1 = arr[i * 3];
        const y1 = arr[i * 3 + 1];
        const z1 = arr[i * 3 + 2];

        for (let j = i + 1; j < particleCount; j++) {
          const x2 = arr[j * 3];
          const y2 = arr[j * 3 + 1];
          const z2 = arr[j * 3 + 2];

          const dist = Math.sqrt(
            (x1 - x2) ** 2 + (y1 - y2) ** 2 + (z1 - z2) ** 2
          );

          if (dist < threshold) {
            linePositions.push(x1, y1, z1, x2, y2, z2);
          }
        }
      }

      // Re-initialize Line Geometry
      scene.remove(lineSegments);
      lineGeometry.dispose();

      lineGeometry = new THREE.BufferGeometry();
      lineGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(linePositions, 3)
      );
      lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial);
      scene.add(lineSegments);

      // Camera Parallax based on cursor coordinates
      // Target camera position interpolates smoothly
      const targetX = mouseRef.current.x * 12;
      const targetY = mouseRef.current.y * 12;
      camera.position.x += (targetX - camera.position.x) * 0.05;
      camera.position.y += (targetY - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // --- Cleanup on unmount ---
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);

      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }

      scene.remove(particleSystem);
      geometry.dispose();
      material.dispose();

      scene.remove(lineSegments);
      lineGeometry.dispose();
      lineMaterial.dispose();

      renderer.dispose();
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden select-none bg-slate-950/20">
      {/* Background radial overlays for electric vibes */}
      <div className="aurora-bg top-[-10%] left-[-10%] bg-indigo-900/30 animate-aurora" />
      <div className="aurora-bg bottom-[-10%] right-[-10%] bg-cyan-900/20 animate-aurora" style={{ animationDelay: "-5s" }} />

      {/* Cyber Grid Lines overlay */}
      <div className="cyber-grid animate-cyber-grid" />

      {/* Futuristic Scanlines */}
      <div className="scanlines" />

      {/* 3D Render Target Container */}
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}

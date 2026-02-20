"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import styles from "./HeroSection.module.css";

const HeroSection = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  // Loading state
  const [isLoading, setIsLoading] = useState(true);

  // --- TYPEWRITER EFFECT FOR HEADING ---
  const [typedText, setTypedText] = useState({
    line1: "",
    line2: "",
    line3: "",
  });

  useEffect(() => {
    if (isLoading) return;

    const fullText = {
      line1: "ONE HUB.",
      line2: "TOTAL",
      line3: "CONTROL.",
    };

    let currentLine = 1;
    let charIndex = 0;

    const typeInterval = setInterval(() => {
      setTypedText((prev) => {
        const newState = { ...prev };

        if (currentLine === 1) {
          newState.line1 = fullText.line1.slice(0, charIndex + 1);
          if (charIndex === fullText.line1.length - 1) {
            currentLine++;
            charIndex = -1;
          }
        } else if (currentLine === 2) {
          newState.line2 = fullText.line2.slice(0, charIndex + 1);
          if (charIndex === fullText.line2.length - 1) {
            currentLine++;
            charIndex = -1;
          }
        } else if (currentLine === 3) {
          newState.line3 = fullText.line3.slice(0, charIndex + 1);
          if (charIndex === fullText.line3.length - 1) {
            clearInterval(typeInterval);
          }
        }
        return newState;
      });
      charIndex++;
    }, 50);

    return () => clearInterval(typeInterval);
  }, [isLoading]);

  useEffect(() => {
    if (!canvasRef.current) return;

    // ... (existing Three.js setup code is unchanged) ...
    // Note: I will need to be careful with the context since I'm doing a replace.
    // However, since the instruction is to replace a block that includes the typewriter logic, I'll need to rewrite the typewriter logic.
    // Let's use multi_replace for better control or just target specific blocks.
    // Actually, I can target the component return and the ref definitions separately.

    // SKIPPING LARGE CHUNK OF THREEJS CODE -- I should use multi_replace to target the refs and the return statement separately.
    // But wait, the `useEffect` contains the typewriter logic too.
    if (!canvasRef.current) return;

    // --- ARCHITECTURE SETUP ---
    const clock = new THREE.Clock();

    // Data Flow Network State
    let networkNodes: THREE.Vector3[] = [];
    let networkAdjacency: number[][] = [];
    let activePulses: {
      mesh: THREE.Mesh;
      startIdx: number;
      targetIdx: number;
      progress: number;
      speed: number;
    }[] = [];

    // Custom interaction state
    const targetGlobeRot = { x: 0, y: 0 };
    let isDragging = false;
    let previousMouse = { x: 0, y: 0 };
    let globeGroup: THREE.Group;
    let hoverGroup: THREE.Group;
    let baseGroup: THREE.Group;

    // Design Tokens
    const COLORS = {
      whiteMatte: 0xffffff, // Pure White
      glowRed: 0xff0000, // Pure Blood Red
      glowDarkRed: 0x330000, // Dark base to prevent pink washout under high intensity
      darkCore: 0x1a1a1a,
      glassUI: 0x4a4d54,
      nodeLine: 0xaaaaaa,
      lightGrey: 0xcccccc, // Sleek tech grey for structure and nodes
    };

    // 1. Scene Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.set(-15, 5, 20);
    scene.add(camera);
    cameraRef.current = camera;

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    canvasRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(-7, 0, 0); // Shift center to the left so globe moves right
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.1; // Don't allow going too far below the base
    controls.minDistance = 10;
    controls.maxDistance = 50;

    // Lock camera rotation, panning, and zoom so the base stays fixed
    controls.enableRotate = false;
    controls.enablePan = false;
    controls.enableZoom = false;
    controlsRef.current = controls;

    // Setup Custom Drag Interaction
    const setupInteraction = () => {
      const onPointerDown = (e: PointerEvent) => {
        isDragging = true;
        previousMouse = { x: e.clientX, y: e.clientY };
        renderer.domElement.style.cursor = "grabbing";
      };

      const onPointerUp = () => {
        isDragging = false;
        renderer.domElement.style.cursor = "grab";
      };

      const onPointerMove = (e: PointerEvent) => {
        if (isDragging) {
          const deltaX = e.clientX - previousMouse.x;
          // Invert deltaY for natural feel or keep as is? Original code:
          const deltaY = e.clientY - previousMouse.y;

          // Update target rotation based on mouse movement
          targetGlobeRot.y += deltaX * 0.005;
          targetGlobeRot.x += deltaY * 0.005;

          // Clamp X rotation so it doesn't flip completely
          targetGlobeRot.x = Math.max(
            -Math.PI / 4,
            Math.min(Math.PI / 4, targetGlobeRot.x),
          );
        }
        previousMouse = { x: e.clientX, y: e.clientY };
      };

      renderer.domElement.addEventListener("pointerdown", onPointerDown);
      window.addEventListener("pointerup", onPointerUp);
      window.addEventListener("pointermove", onPointerMove);
      renderer.domElement.style.cursor = "grab";

      return () => {
        renderer.domElement.removeEventListener("pointerdown", onPointerDown);
        window.removeEventListener("pointerup", onPointerUp);
        window.removeEventListener("pointermove", onPointerMove);
      };
    };

    const cleanupInteraction = setupInteraction();

    // --- LIGHTING ---
    const setupLighting = () => {
      // Bright ambient light
      const ambient = new THREE.AmbientLight(0xffffff, 0.8);
      scene.add(ambient);

      // Strong directional light (Key light)
      const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
      dirLight.position.set(-10, 20, 10);
      dirLight.castShadow = true;
      dirLight.shadow.mapSize.width = 2048;
      dirLight.shadow.mapSize.height = 2048;
      scene.add(dirLight);

      // Secondary fill light
      const fillLight = new THREE.DirectionalLight(0x90b0d0, 0.4);
      fillLight.position.set(10, 0, -10);
      scene.add(fillLight);

      // Red uplight from the base
      const baseLight = new THREE.PointLight(COLORS.glowRed, 2, 20);
      baseLight.position.set(0, -3.5, 0);
      scene.add(baseLight);
    };

    // --- BASE COMPONENT ---
    const buildBase = () => {
      baseGroup = new THREE.Group();
      baseGroup.position.y = -5;

      // Outer Base Ring
      const ringGeo = new THREE.CylinderGeometry(6, 6.2, 0.8, 64);
      const ringMat = new THREE.MeshStandardMaterial({
        color: COLORS.lightGrey,
        roughness: 0.5,
        metalness: 0.1,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.receiveShadow = true;
      baseGroup.add(ring);

      // Inner Glowing Pad
      const padGeo = new THREE.CylinderGeometry(5.2, 5.2, 0.85, 64);
      const padMat = new THREE.MeshStandardMaterial({
        color: COLORS.glowDarkRed,
        emissive: COLORS.glowRed,
        emissiveIntensity: 2.5, // Cranked up for a harsh red glow
        roughness: 0.2,
      });
      const pad = new THREE.Mesh(padGeo, padMat);
      baseGroup.add(pad);

      // Inner slats/details (simulated with a textured ring)
      const slatGeo = new THREE.TorusGeometry(5.3, 0.1, 16, 100);
      const slatMat = new THREE.MeshStandardMaterial({
        color: COLORS.lightGrey,
      });
      const slat = new THREE.Mesh(slatGeo, slatMat);
      slat.rotation.x = Math.PI / 2;
      slat.position.y = 0.45;
      baseGroup.add(slat);

      scene.add(baseGroup);
    };

    // Generates the Dashed Text Texture
    const generateTextOverlayTexture = (text: string) => {
      const canvas = document.createElement("canvas");
      canvas.width = 4096; // High res for sharp text wrapping
      canvas.height = 2048;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Techy, bold styling
        ctx.font = '900 280px "Segoe UI", Tahoma, sans-serif';
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Black dashed outline format
        ctx.lineWidth = 12;
        ctx.strokeStyle = "#1a1a1a"; // Dark/Black text
        ctx.setLineDash([40, 25]); // The dashed pattern

        // Draw it twice so it maps beautifully to both sides of the sphere
        // Y is offset to 50% height so it sits directly on the equatorial middle band
        const yPos = canvas.height * 0.5;
        ctx.strokeText(text, canvas.width * 0.25, yPos);
        ctx.strokeText(text, canvas.width * 0.75, yPos);
      }

      const texture = new THREE.CanvasTexture(canvas);
      // Ensure crisp rendering on the sphere
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      return texture;
    };

    // --- CORE GLOBE COMPONENT ---
    const buildGlobe = () => {
      hoverGroup = new THREE.Group();
      globeGroup = new THREE.Group();

      const radius = 5;
      const standardMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.4,
        metalness: 0.1,
        emissive: 0xffffff,
        emissiveIntensity: 0.2,
      });

      // 1. Top Dome
      const topGeo = new THREE.SphereGeometry(
        radius,
        64,
        64,
        0,
        Math.PI * 2,
        0,
        Math.PI * 0.35,
      );
      const topDome = new THREE.Mesh(topGeo, standardMat);
      topDome.castShadow = true;

      // Top Dome details (concentric rings)
      for (let i = 1; i <= 3; i++) {
        const ringGeo = new THREE.TorusGeometry(
          radius * Math.sin(Math.PI * 0.1 * i),
          0.03,
          16,
          64,
        );
        const ring = new THREE.Mesh(ringGeo, standardMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = radius * Math.cos(Math.PI * 0.1 * i);
        globeGroup.add(ring);
      }
      globeGroup.add(topDome);

      // 2. Bottom Dome
      const bottomGeo = new THREE.SphereGeometry(
        radius,
        64,
        64,
        0,
        Math.PI * 2,
        Math.PI * 0.65,
        Math.PI * 0.35,
      );
      const bottomMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.4,
        emissive: 0xffffff,
        emissiveIntensity: 0.2,
      });
      const bottomDome = new THREE.Mesh(bottomGeo, bottomMat);
      bottomDome.castShadow = true;
      globeGroup.add(bottomDome);

      // 3. Solid Middle Band (Replaces the maze)
      const middleGeo = new THREE.SphereGeometry(
        radius + 0.05,
        128,
        64,
        0,
        Math.PI * 2,
        Math.PI * 0.35,
        Math.PI * 0.3,
      );
      const middleMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.5,
        metalness: 0.1,
        emissive: 0xffffff,
        emissiveIntensity: 0.2,
      });
      const middleBand = new THREE.Mesh(middleGeo, middleMat);
      middleBand.castShadow = true;
      globeGroup.add(middleBand);

      // 4. Text Overlay ("SUPER MCP")
      const textTexture = generateTextOverlayTexture("SUPER MCP");
      const textGeo = new THREE.SphereGeometry(radius + 0.06, 64, 64);
      const textMat = new THREE.MeshStandardMaterial({
        map: textTexture,
        transparent: true,
        roughness: 0.6,
        metalness: 0.1,
        depthWrite: false, // Prevents z-fighting
      });
      const textSphere = new THREE.Mesh(textGeo, textMat);
      globeGroup.add(textSphere);

      hoverGroup.add(globeGroup);
      scene.add(hoverGroup);
    };

    // --- FLOATING NETWORK NODES ---
    const buildFloatingNetwork = () => {
      const networkGroup = new THREE.Group();

      // Reset state
      networkNodes = [];
      networkAdjacency = [];
      activePulses = [];

      const numNodes = 30;

      const nodeGeo = new THREE.SphereGeometry(0.2, 16, 16);
      const nodeMatSolid = new THREE.MeshStandardMaterial({
        color: COLORS.lightGrey,
        roughness: 0.2,
      });
      const nodeMatGlass = new THREE.MeshPhysicalMaterial({
        color: COLORS.lightGrey,
        transmission: 0.9,
        opacity: 1,
        metalness: 0,
        roughness: 0,
        ior: 1.5,
        thickness: 0.5,
      });

      // Distribute points around the globe
      for (let i = 0; i < numNodes; i++) {
        // Random spherical coordinates
        const phi = Math.acos(-1 + (2 * i) / numNodes);
        const theta = Math.sqrt(numNodes * Math.PI) * phi;

        // Radius slightly larger than globe, plus random offset
        const r = 6 + Math.random() * 4;

        const x = r * Math.cos(theta) * Math.sin(phi);
        const y = r * Math.sin(theta) * Math.sin(phi);
        const z = r * Math.cos(phi);

        networkNodes.push(new THREE.Vector3(x, y, z));
        networkAdjacency.push([]); // Initialize empty adjacency list for graph routing

        // Alternate between solid grey and glass nodes
        const isGlass = Math.random() > 0.7;
        const sphere = new THREE.Mesh(
          isGlass ? new THREE.SphereGeometry(0.4, 32, 32) : nodeGeo,
          isGlass ? nodeMatGlass : nodeMatSolid,
        );

        sphere.position.set(x, y, z);
        networkGroup.add(sphere);
      }

      // Draw connecting lines and populate adjacency graph
      const lineMat = new THREE.LineBasicMaterial({
        color: COLORS.lightGrey,
        transparent: true,
        opacity: 0.3,
      });

      for (let i = 0; i < networkNodes.length; i++) {
        for (let j = i + 1; j < networkNodes.length; j++) {
          if (networkNodes[i].distanceTo(networkNodes[j]) < 5) {
            // Register bi-directional connection
            networkAdjacency[i].push(j);
            networkAdjacency[j].push(i);

            const points = [networkNodes[i], networkNodes[j]];
            const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(lineGeo, lineMat);
            networkGroup.add(line);
          }
        }
      }

      // Spawn Neural Pulses (Data Packets)
      const numPulses = 15;
      // Basic material acts as an unlit emissive to ensure the red pops brightly
      const pulseMat = new THREE.MeshBasicMaterial({ color: COLORS.glowRed });
      const pulseGeo = new THREE.SphereGeometry(0.08, 8, 8);

      for (let i = 0; i < numPulses; i++) {
        const mesh = new THREE.Mesh(pulseGeo, pulseMat);
        networkGroup.add(mesh);

        // Start at a random node
        const startIdx = Math.floor(Math.random() * numNodes);
        let targetIdx = startIdx;

        // Pick a random connected neighbor
        if (networkAdjacency[startIdx].length > 0) {
          targetIdx =
            networkAdjacency[startIdx][
              Math.floor(Math.random() * networkAdjacency[startIdx].length)
            ];
        }

        activePulses.push({
          mesh: mesh,
          startIdx: startIdx,
          targetIdx: targetIdx,
          progress: Math.random(), // Stagger start times
          speed: 0.005 + Math.random() * 0.015, // Random velocities
        });
      }

      hoverGroup.add(networkGroup);
    };

    // Initialize Scene
    setupLighting();
    buildBase();
    buildGlobe();
    buildFloatingNetwork();

    setIsLoading(false);

    // Animation Loop
    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);

      const time = clock.getElapsedTime();

      if (!isDragging) {
        targetGlobeRot.y += 0.002; // Continue auto-rotation when not dragging
      }

      // Rotate the core globe
      if (globeGroup) {
        // Keep the subtle internal X wobble
        globeGroup.rotation.x = Math.sin(time * 0.5) * 0.05;
      }

      // Hover effect for the entire floating structure
      if (hoverGroup) {
        // Lock the elevation to a static height, removing the up/down motion
        hoverGroup.position.y = 0.5;

        // Smooth dampening towards target mouse rotation
        hoverGroup.rotation.y +=
          (targetGlobeRot.y - hoverGroup.rotation.y) * 0.1;
        hoverGroup.rotation.x +=
          (targetGlobeRot.x - hoverGroup.rotation.x) * 0.1;
      }

      // Process Data Flow (Neural Pulses)
      activePulses.forEach((pulse) => {
        pulse.progress += pulse.speed;

        // If reached destination, pick the next path
        if (pulse.progress >= 1.0) {
          pulse.progress = 0;
          pulse.startIdx = pulse.targetIdx;

          // Route to a new random connected node
          const neighbors = networkAdjacency[pulse.startIdx];
          if (neighbors && neighbors.length > 0) {
            pulse.targetIdx =
              neighbors[Math.floor(Math.random() * neighbors.length)];
          }
        }

        const startVec = networkNodes[pulse.startIdx];
        const targetVec = networkNodes[pulse.targetIdx];

        // Move pulse along the wire
        pulse.mesh.position.copy(startVec).lerp(targetVec, pulse.progress);

        // Scale pulse up in the middle of the wire, down at the ends for a "firing" energy look
        const scale = 0.2 + Math.sin(pulse.progress * Math.PI) * 1.5;
        pulse.mesh.scale.set(scale, scale, scale);
      });

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle Window Resize
    const onWindowResize = () => {
      if (!camera || !renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onWindowResize, false);

    // Cleanup
    return () => {
      if (animationFrameIdRef.current)
        cancelAnimationFrame(animationFrameIdRef.current);
      window.removeEventListener("resize", onWindowResize);
      cleanupInteraction();
      if (rendererRef.current && canvasRef.current) {
        canvasRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, []); // Removed isLoading dependency

  return (
    <div className={styles.container}>
      {isLoading && (
        <div className={styles.loadingContainer}>
          <div className={styles.loader}>
            <div className={styles.scanner}></div>
            <div className={styles.loaderCircle}></div>
          </div>
          <div className={styles.loadingText}>
            SYSTEM INITIALIZATION
            <span className={styles.loadingDots}>...</span>
          </div>
          <div className={styles.loadingBar}>
            <div className={styles.loadingBarProgress}></div>
          </div>
        </div>
      )}

      {/* Hero Text Layer */}
      {/* Hero Text Layer - Split for color inversion */}

      {/* Right Layer (Text clipped to 75-100%, Dark BG, White Text) */}
      <h1 className={`${styles.heroHeading} ${styles.heroHeadingLeft}`}>
        {typedText.line1}
        <span className={styles.indentText}>
          {typedText.line2}
          <br />
          <span className={styles.highlightRed}>{typedText.line3}</span>
        </span>
      </h1>

      {/* Left Layer (Text clipped to 0-75%, Light BG, Black Text) */}
      <h1 className={`${styles.heroHeading} ${styles.heroHeadingRight}`}>
        {typedText.line1}
        <span className={styles.indentText}>
          {typedText.line2}
          <br />
          <span className={styles.highlightRed}>{typedText.line3}</span>
        </span>
      </h1>

      {/* Call To Action Button (Matches the image) */}
      <button className={styles.ctaButton}>
        GET IN TOUCH
        <span className={styles.ctaIcon}>↗</span>
      </button>

      {/* Vertical Side Text - Left Corner Watermark */}
      <div className={styles.verticalSideText}>PETABYTES</div>

      {/* Electric Flow Lines - Right Side */}
      <div className={styles.electricLines}>
        <div className={styles.line}></div>
        <div className={styles.line}></div>
        <div className={styles.line}></div>
        <div className={styles.line}></div>
      </div>

      <div ref={canvasRef} className={styles.canvasContainer}></div>
    </div>
  );
};

export default HeroSection;

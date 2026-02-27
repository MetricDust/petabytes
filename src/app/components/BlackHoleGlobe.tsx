"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function BlackHoleGlobe({
  cameraDistance = 80,
}: { cameraDistance?: number } = {}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth;
    let height = container.clientHeight;

    // 1. Scene Setup
    const scene = new THREE.Scene();

    // Transparent background natively handled by WebGLRenderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      premultipliedAlpha: false,
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Clear any existing canvas if hot-reloading
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    // Move camera back to make the globe smaller, and move camera up to push the globe down on screen
    camera.position.set(0, 0, cameraDistance);

    // 2. Glowing Aura (Sprite replacing UnrealBloomPass for perfect transparency)
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
      // Map gradient correctly to the sphere edge (radius 7 against sprite scale 40, so edge is roughly at 0.35)
      gradient.addColorStop(0, "rgba(0, 100, 255, 0.4)");
      gradient.addColorStop(0.3, "rgba(0, 150, 255, 0.8)"); // Right behind the sphere
      gradient.addColorStop(0.35, "rgba(0, 255, 255, 1)"); // Intense brilliant photon ring
      gradient.addColorStop(0.45, "rgba(0, 120, 255, 0.7)"); // Immediate strong fallout
      gradient.addColorStop(0.7, "rgba(0, 50, 220, 0.3)"); // Wide atmospheric outer glow
      gradient.addColorStop(1, "rgba(0, 20, 100, 0)"); // Smooth fade
      ctx.clearRect(0, 0, 512, 512);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 512, 512);
    }
    const texture = new THREE.CanvasTexture(canvas);
    const glowMaterial = new THREE.SpriteMaterial({
      map: texture,
      color: 0xffffff,
      transparent: true,
      blending: THREE.NormalBlending, // Important: AdditiveBlending causes CSS background blocky artifacts
      depthWrite: false, // Don't block the sphere
    });
    const glow = new THREE.Sprite(glowMaterial);
    // Increase size significantly for a massive outer glow
    glow.scale.set(45, 45, 1);
    scene.add(glow);

    // 3. The Core Sphere (Textured)
    const coreRadius = 7;
    const coreGeo = new THREE.SphereGeometry(coreRadius, 64, 64);

    const coreMat = new THREE.ShaderMaterial({
      uniforms: {
        glowColor: { value: new THREE.Color(0x00aaff) }, // Bright blue edge
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        varying vec3 vNormal;
        varying vec2 vUv;
        
        float random(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
        }

        void main() {
          float fresnel = 1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0);
          // Sharpen the fresnel a bit but make it reach further inside
          fresnel = pow(fresnel, 1.5); 
          
          float noise = random(vUv * 100.0) * 0.08;
          float waves = sin(vUv.x * 20.0) * sin(vUv.y * 20.0) * 0.04;
          
          vec3 baseColor = vec3(0.01, 0.03, 0.06) + vec3(noise + waves);
          
          vec3 lightDir = normalize(vec3(0.5, 1.0, 1.0));
          float spec = pow(max(dot(vNormal, lightDir), 0.0), 32.0);
          
          // Dramatically increase the fresnel mix weight for a strong blue edge glow
          vec3 finalColor = mix(baseColor, glowColor, fresnel * 1.5) + vec3(spec * 0.25);
          
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
    });

    const core = new THREE.Mesh(coreGeo, coreMat);
    scene.add(core);

    // 4. Subtle Inner Ring for a crisp edge
    const outlineThickness = 0.2;
    const haloGeo = new THREE.SphereGeometry(
      coreRadius + outlineThickness,
      64,
      64,
    );
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x0088ff,
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.2, // Subtle
      blending: THREE.NormalBlending,
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    scene.add(halo);

    // 5. Interaction & Animation (Raycaster added)
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isDragging = false;
    let previousPosition = { x: 0, y: 0 };
    const targetRotation = { x: 0, y: 0 };
    const currentRotation = { x: 0, y: 0 };

    const onPointerDown = (e: PointerEvent) => {
      // Calculate mouse position in normalized device coordinates (-1 to +1)
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      // Update the picking ray with the camera and mouse position
      raycaster.setFromCamera(mouse, camera);

      // Calculate objects intersecting the picking ray
      const intersects = raycaster.intersectObjects([core, halo, glow]);

      // Only start drag if we clicked on the sphere/glow
      if (intersects.length > 0) {
        isDragging = true;
        previousPosition = { x: e.clientX, y: e.clientY };
        container.style.cursor = "grabbing";
      }
    };

    const hoverPointerMove = (e: PointerEvent) => {
      if (isDragging) return; // Don't interfere during a drag

      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects([core, halo, glow]);
      if (intersects.length > 0) {
        container.style.cursor = "grab";
      } else {
        container.style.cursor = "default";
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (isDragging) {
        const deltaMove = {
          x: e.clientX - previousPosition.x,
          y: e.clientY - previousPosition.y,
        };
        targetRotation.y += deltaMove.x * 0.01;
        targetRotation.x += deltaMove.y * 0.01;
        previousPosition = { x: e.clientX, y: e.clientY };
      }
    };

    const onPointerUp = () => {
      isDragging = false;
      container.style.cursor = "default";
      // To strictly restore hover state immediately
      // a proper implementation would re-raycast here,
      // but 'default' handles the immediate un-click nicely.
    };

    container.addEventListener("pointerdown", onPointerDown);
    container.addEventListener("pointermove", hoverPointerMove);
    container.style.touchAction = "none"; // Prevent scroll on touch
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    let animationId: number;
    let time = 0;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      if (!isDragging) {
        targetRotation.y += 0.005; // Slightly faster default rotation
        targetRotation.x += 0.002;
      }

      // Smooth damping
      currentRotation.x += (targetRotation.x - currentRotation.x) * 0.1;
      currentRotation.y += (targetRotation.y - currentRotation.y) * 0.1;

      core.rotation.y = currentRotation.y;
      core.rotation.x = currentRotation.x;
      halo.rotation.y = currentRotation.y;
      halo.rotation.x = currentRotation.x;

      time += 0.02;

      // Pulse the glow slightly
      const scale = 40 + Math.sin(time * 0.5) * 2;
      glow.scale.set(scale, scale, 1);

      renderer.render(scene, camera);
    };

    animate();

    // 6. Resize Handler
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("pointerdown", onPointerDown);
      container.removeEventListener("pointermove", hoverPointerMove);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      cancelAnimationFrame(animationId);

      if (
        container &&
        renderer.domElement &&
        container.contains(renderer.domElement)
      ) {
        container.removeChild(renderer.domElement);
      }

      coreGeo.dispose();
      coreMat.dispose();
      haloGeo.dispose();
      haloMat.dispose();
      texture.dispose();
      glowMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full overflow-visible" />;
}

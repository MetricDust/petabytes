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

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      premultipliedAlpha: false,
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, cameraDistance);

    // 2. Glowing Aura (Background atmospheric glow)
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
      gradient.addColorStop(0, "rgba(0, 80, 200, 0.3)");
      gradient.addColorStop(0.25, "rgba(0, 120, 255, 0.5)");
      gradient.addColorStop(0.35, "rgba(0, 200, 255, 0.7)");
      gradient.addColorStop(0.45, "rgba(0, 100, 255, 0.4)");
      gradient.addColorStop(0.7, "rgba(0, 40, 180, 0.15)");
      gradient.addColorStop(1, "rgba(0, 10, 80, 0)");
      ctx.clearRect(0, 0, 512, 512);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 512, 512);
    }
    const glowTexture = new THREE.CanvasTexture(canvas);
    const glowMaterial = new THREE.SpriteMaterial({
      map: glowTexture,
      color: 0xffffff,
      transparent: true,
      blending: THREE.NormalBlending,
      depthWrite: false,
    });
    const glow = new THREE.Sprite(glowMaterial);
    glow.scale.set(45, 45, 1);
    scene.add(glow);

    // 3. The Core Sphere (3D with shader)
    const coreRadius = 7;
    const coreGeo = new THREE.SphereGeometry(coreRadius, 64, 64);

    const coreMat = new THREE.ShaderMaterial({
      uniforms: {
        glowColor: { value: new THREE.Color(0x00aaff) },
        uTime: { value: 0.0 },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec2 vUv;
        varying vec3 vPosition;
        void main() {
          vUv = uv;
          vPosition = position;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        uniform float uTime;
        varying vec3 vNormal;
        varying vec2 vUv;
        varying vec3 vPosition;
        
        float random(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
        }

        void main() {
          float fresnel = 1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0);
          fresnel = pow(fresnel, 1.5); 
          
          float noise = random(vUv * 100.0) * 0.08;
          float waves = sin(vUv.x * 20.0) * sin(vUv.y * 20.0) * 0.04;
          
          vec3 baseColor = vec3(0.01, 0.03, 0.06) + glowColor * (noise + waves);
          
          // ---- Rotation light lines (meridians + latitudes) ----
          float numMeridians = 8.0;
          float numLatitudes = 5.0;
          float lineSharpness = 120.0;
          
          // Meridian lines (longitude) — vertical arcs
          float meridian = abs(sin(vUv.x * numMeridians * 3.14159));
          float meridianLine = pow(1.0 - meridian, lineSharpness);
          
          // Latitude lines (horizontal bands)
          float latitude = abs(sin(vUv.y * numLatitudes * 3.14159));
          float latitudeLine = pow(1.0 - latitude, lineSharpness);
          
          // Combine lines, subtly pulsing over time
          float linePulse = 0.6 + 0.4 * sin(uTime * 1.5);
          float lines = (meridianLine + latitudeLine) * linePulse;
          
          // Dim lines toward the edges (fresnel fade) so they look natural
          float lineFade = 1.0 - fresnel * 0.6;
          lines *= lineFade;
          
          // Add as a soft blue glow
          vec3 lineColor = glowColor * 1.2 * lines * 0.25;
          
          vec3 lightDir = normalize(vec3(0.5, 1.0, 1.0));
          float spec = pow(max(dot(vNormal, lightDir), 0.0), 32.0);
          
          vec3 finalColor = mix(baseColor, glowColor, fresnel * 1.5) + glowColor * (spec * 0.25) + lineColor;
          
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
    });

    const core = new THREE.Mesh(coreGeo, coreMat);
    scene.add(core);

    // ============================================================
    // 4a. INNER ENERGY FILAMENTS — glowing curved lines inside the sphere
    //     These rotate with the core, making rotation clearly visible
    // ============================================================
    const filamentGroup = new THREE.Group();
    core.add(filamentGroup); // child of core, rotates together

    const filamentConfigs = [
      { color: 0x00ccff, offset: 0, tilt: Math.PI * 0.25, scale: 0.85 },
      {
        color: 0x0088ff,
        offset: Math.PI * 0.66,
        tilt: -Math.PI * 0.35,
        scale: 0.75,
      },
      {
        color: 0x44ddff,
        offset: Math.PI * 1.33,
        tilt: Math.PI * 0.15,
        scale: 0.9,
      },
    ];

    const filamentMeshes: THREE.Mesh[] = [];
    const filamentMats: THREE.ShaderMaterial[] = [];
    const filamentGeos: THREE.TubeGeometry[] = [];

    for (const cfg of filamentConfigs) {
      // Create a 3D curve inside the sphere
      const curvePoints: THREE.Vector3[] = [];
      const segments = 64;
      const innerR = coreRadius * cfg.scale;
      for (let i = 0; i <= segments; i++) {
        const t = (i / segments) * Math.PI * 2;
        const r = innerR * (0.3 + 0.7 * Math.sin(t * 0.5 + cfg.offset));
        curvePoints.push(
          new THREE.Vector3(
            r * Math.cos(t + cfg.offset) * 0.6,
            r * Math.sin(t * 1.5 + cfg.offset) * 0.5,
            r * Math.sin(t + cfg.offset) * 0.6,
          ),
        );
      }

      const curve = new THREE.CatmullRomCurve3(curvePoints, true);
      const tubeGeo = new THREE.TubeGeometry(curve, 64, 0.12, 6, true);

      const tubeMat = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0.0 },
          uColor: { value: new THREE.Color(cfg.color) },
        },
        vertexShader: `
          varying vec2 vUv;
          varying vec3 vPos;
          void main() {
            vUv = uv;
            vPos = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float uTime;
          uniform vec3 uColor;
          varying vec2 vUv;
          varying vec3 vPos;

          void main() {
            // Flowing pulse along the filament
            float flow = sin(vUv.x * 20.0 - uTime * 3.0) * 0.5 + 0.5;
            float pulse = sin(vUv.x * 8.0 + uTime * 2.0) * 0.3 + 0.7;
            
            // Cross-section glow
            float edge = 1.0 - abs(vUv.y - 0.5) * 2.0;
            edge = pow(max(edge, 0.0), 0.5);
            
            // Bright spots traveling along filament
            float spark = pow(flow, 4.0) * 0.8;
            
            vec3 color = uColor * (pulse + spark);
            float alpha = (0.3 + spark * 0.7 + flow * 0.2) * edge;
            
            gl_FragColor = vec4(color, alpha);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      });

      const filament = new THREE.Mesh(tubeGeo, tubeMat);
      filament.rotation.set(cfg.tilt, cfg.offset, 0);
      filamentGroup.add(filament);
      filamentMeshes.push(filament);
      filamentMats.push(tubeMat);
      filamentGeos.push(tubeGeo);
    }

    // 4b. INNER NUCLEUS — small bright pulsing core
    const nucleusGeo = new THREE.SphereGeometry(coreRadius * 0.15, 24, 24);
    const nucleusMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0.0 },
      },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec3 vNormal;
        
        void main() {
          float fresnel = 1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0);
          float pulse = 0.7 + 0.3 * sin(uTime * 2.5);
          
          vec3 core = vec3(0.3, 0.8, 1.0) * pulse;
          vec3 edge = vec3(0.0, 0.5, 1.0);
          vec3 color = mix(core, edge, fresnel);
          
          float alpha = 0.6 + fresnel * 0.4;
          alpha *= pulse;
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const nucleus = new THREE.Mesh(nucleusGeo, nucleusMat);
    core.add(nucleus); // child of core

    // 4c. ORBITING PARTICLES — tiny bright dots inside the sphere
    const particleCount = 40;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);
    const particleOrbitData: {
      axis: THREE.Vector3;
      radius: number;
      phase: number;
      speed: number;
    }[] = [];

    for (let i = 0; i < particleCount; i++) {
      const radius = coreRadius * (0.2 + Math.random() * 0.65);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = radius * Math.cos(phi);
      particleSpeeds[i] = 0.3 + Math.random() * 0.7;

      // Each particle orbits around a random axis
      const axis = new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5,
      ).normalize();
      particleOrbitData.push({
        axis,
        radius,
        phase: Math.random() * Math.PI * 2,
        speed: (0.5 + Math.random() * 1.5) * (Math.random() > 0.5 ? 1 : -1),
      });
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3),
    );

    const particleMat = new THREE.PointsMaterial({
      color: 0x66ddff,
      size: 0.35,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    core.add(particles); // child of core

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
      opacity: 0.2,
      blending: THREE.NormalBlending,
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    scene.add(halo);

    // ============================================================
    // 5. PHOTON RING — Thick glowing border at the sphere's edge
    //    Fixed shape (circle), only the glow highlight revolves around it
    // ============================================================

    // Use a TorusGeometry for a thick, solid ring right at the sphere border
    const ringRadius = coreRadius + 0.6; // Sits just outside the sphere
    const tubeRadius = 0.35; // Thickness of the ring tube
    const ringGeo = new THREE.TorusGeometry(ringRadius, tubeRadius, 32, 256);

    // Custom shader: the ring glows uniformly, with a bright highlight that revolves
    const ringMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0.0 },
        uBaseColor: { value: new THREE.Color(0.0, 0.4, 0.9) },
        uHighlightColor: { value: new THREE.Color(0.2, 0.85, 1.0) },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vWorldPos;
        void main() {
          vUv = uv;
          vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uBaseColor;
        uniform vec3 uHighlightColor;
        varying vec2 vUv;
        varying vec3 vWorldPos;

        void main() {
          // vUv.x goes around the ring (0..1), vUv.y goes around the tube cross-section

          // Revolving highlight: a bright spot that sweeps around the ring
          float angle = vUv.x * 6.28318; // 0 to 2PI
          float revolveSpeed = 1.2;
          float revolveAngle = mod(uTime * revolveSpeed, 6.28318);
          
          // Primary highlight — a wide bright sweep
          float diff = mod(angle - revolveAngle + 6.28318, 6.28318);
          float highlight = exp(-diff * diff * 1.5); // Gaussian falloff
          // Also wrap the other direction
          float diff2 = 6.28318 - diff;
          highlight += exp(-diff2 * diff2 * 1.5);

          // Secondary highlight on the opposite side (dimmer)
          float revolveAngle2 = mod(uTime * revolveSpeed + 3.14159, 6.28318);
          float diffB = mod(angle - revolveAngle2 + 6.28318, 6.28318);
          float highlight2 = exp(-diffB * diffB * 2.0) * 0.5;
          float diffB2 = 6.28318 - diffB;
          highlight2 += exp(-diffB2 * diffB2 * 2.0) * 0.5;

          float totalHighlight = highlight + highlight2;

          // Tube cross-section glow: brightest at the outer edge of the tube
          float tubeGlow = 0.6 + 0.4 * (1.0 - abs(vUv.y - 0.5) * 2.0);

          // Mix base and highlight colors
          vec3 color = mix(uBaseColor, uHighlightColor, totalHighlight * 0.8);
          color *= tubeGlow;

          // Overall opacity: the ring is always visible, highlight makes it brighter
          float alpha = 0.5 + totalHighlight * 0.5;
          alpha *= tubeGlow;

          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });

    const photonRing = new THREE.Mesh(ringGeo, ringMat);
    // Face the ring toward the camera (XY plane — flat circle facing Z)
    // TorusGeometry is already in the XY plane by default, which faces the camera
    scene.add(photonRing);

    // Second, slightly larger outer ring for extra glow depth
    const outerRingRadius = coreRadius + 1.2;
    const outerTubeRadius = 0.2;
    const outerRingGeo = new THREE.TorusGeometry(
      outerRingRadius,
      outerTubeRadius,
      16,
      256,
    );

    const outerRingMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0.0 },
        uBaseColor: { value: new THREE.Color(0.0, 0.25, 0.6) },
        uHighlightColor: { value: new THREE.Color(0.1, 0.6, 1.0) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uBaseColor;
        uniform vec3 uHighlightColor;
        varying vec2 vUv;

        void main() {
          float angle = vUv.x * 6.28318;
          float revolveAngle = mod(uTime * 1.2, 6.28318);

          float diff = mod(angle - revolveAngle + 6.28318, 6.28318);
          float highlight = exp(-diff * diff * 1.0);
          float diff2 = 6.28318 - diff;
          highlight += exp(-diff2 * diff2 * 1.0);

          float tubeGlow = 1.0 - abs(vUv.y - 0.5) * 2.0;
          tubeGlow = pow(max(tubeGlow, 0.0), 0.5);

          vec3 color = mix(uBaseColor, uHighlightColor, highlight * 0.7);
          color *= tubeGlow;

          float alpha = (0.2 + highlight * 0.4) * tubeGlow;

          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });

    const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
    scene.add(outerRing);

    // Third, faint inner ring
    const innerRingRadius = coreRadius + 0.2;
    const innerTubeRadius = 0.15;
    const innerRingGeo = new THREE.TorusGeometry(
      innerRingRadius,
      innerTubeRadius,
      16,
      256,
    );

    const innerRingMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0.0 },
        uColor: { value: new THREE.Color(0.15, 0.7, 1.0) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor;
        varying vec2 vUv;

        void main() {
          float angle = vUv.x * 6.28318;
          float revolveAngle = mod(uTime * 1.2 + 1.5, 6.28318);

          float diff = mod(angle - revolveAngle + 6.28318, 6.28318);
          float highlight = exp(-diff * diff * 2.0);
          float diff2 = 6.28318 - diff;
          highlight += exp(-diff2 * diff2 * 2.0);

          float tubeGlow = 1.0 - abs(vUv.y - 0.5) * 2.0;

          vec3 color = uColor * (0.4 + highlight * 0.6);
          float alpha = (0.3 + highlight * 0.5) * max(tubeGlow, 0.0);

          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });

    const innerRing = new THREE.Mesh(innerRingGeo, innerRingMat);
    scene.add(innerRing);

    // ============================================================
    // 6. MEDIUM RING — Intermediate layer between thick border and fading lines
    // ============================================================
    const medRingRadius = coreRadius + 2.0;
    const medTubeRadius = 0.22;
    const medRingGeo = new THREE.TorusGeometry(
      medRingRadius,
      medTubeRadius,
      20,
      256,
    );

    const medRingMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0.0 },
        uBaseColor: { value: new THREE.Color(0.02, 0.3, 0.75) },
        uHighlightColor: { value: new THREE.Color(0.12, 0.65, 1.0) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uBaseColor;
        uniform vec3 uHighlightColor;
        varying vec2 vUv;

        void main() {
          float angle = vUv.x * 6.28318;
          float revolveAngle = mod(uTime * 1.2, 6.28318);

          float diff = mod(angle - revolveAngle + 6.28318, 6.28318);
          float highlight = exp(-diff * diff * 1.2);
          float diff2 = 6.28318 - diff;
          highlight += exp(-diff2 * diff2 * 1.2);

          // Secondary highlight opposite side
          float revolveAngle2 = mod(uTime * 1.2 + 3.14159, 6.28318);
          float diffB = mod(angle - revolveAngle2 + 6.28318, 6.28318);
          float hl2 = exp(-diffB * diffB * 1.8) * 0.35;
          float diffB2 = 6.28318 - diffB;
          hl2 += exp(-diffB2 * diffB2 * 1.8) * 0.35;

          float totalHL = highlight + hl2;

          float tubeGlow = 1.0 - abs(vUv.y - 0.5) * 2.0;
          tubeGlow = pow(max(tubeGlow, 0.0), 0.5);

          vec3 color = mix(uBaseColor, uHighlightColor, totalHL * 0.7);
          color *= tubeGlow;

          float alpha = (0.35 + totalHL * 0.45) * tubeGlow;

          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });

    const medRing = new THREE.Mesh(medRingGeo, medRingMat);
    scene.add(medRing);

    // ============================================================
    // 7. FADING WAVE RINGS (Light) — Gradually fade as they get further
    // ============================================================
    const waveRingGeos: THREE.TorusGeometry[] = [];
    const waveRingMats: THREE.ShaderMaterial[] = [];

    const waveRingConfigs = [
      { radius: 10.5, tube: 0.1, opacity: 0.25 },
      { radius: 11.5, tube: 0.08, opacity: 0.17 },
      { radius: 12.5, tube: 0.06, opacity: 0.1 },
      { radius: 13.5, tube: 0.04, opacity: 0.05 },
    ];

    for (const wCfg of waveRingConfigs) {
      const wGeo = new THREE.TorusGeometry(wCfg.radius, wCfg.tube, 12, 256);
      const wMat = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0.0 },
          uOpacity: { value: wCfg.opacity },
          uColor: { value: new THREE.Color(0.05, 0.4, 0.85) },
          uHighlight: { value: new THREE.Color(0.15, 0.65, 1.0) },
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float uTime;
          uniform float uOpacity;
          uniform vec3 uColor;
          uniform vec3 uHighlight;
          varying vec2 vUv;

          void main() {
            float angle = vUv.x * 6.28318;
            float revolveAngle = mod(uTime * 1.2, 6.28318);

            // Same revolving highlight synced with the main ring
            float diff = mod(angle - revolveAngle + 6.28318, 6.28318);
            float hl = exp(-diff * diff * 0.8);
            float diff2 = 6.28318 - diff;
            hl += exp(-diff2 * diff2 * 0.8);

            // Tube cross-section softness
            float tubeGlow = 1.0 - abs(vUv.y - 0.5) * 2.0;
            tubeGlow = pow(max(tubeGlow, 0.0), 0.6);

            vec3 color = mix(uColor, uHighlight, hl * 0.6);
            color *= tubeGlow;

            float alpha = uOpacity * (0.4 + hl * 0.6) * tubeGlow;

            gl_FragColor = vec4(color, alpha);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      });

      const wMesh = new THREE.Mesh(wGeo, wMat);
      scene.add(wMesh);

      waveRingGeos.push(wGeo);
      waveRingMats.push(wMat);
    }

    // ============================================================
    // 7. Interaction & Animation
    // ============================================================
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isDragging = false;
    let previousPosition = { x: 0, y: 0 };
    const targetRotation = { x: 0, y: 0 };
    const currentRotation = { x: 0, y: 0 };

    const onPointerDown = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects([core, halo, glow]);

      if (intersects.length > 0) {
        isDragging = true;
        previousPosition = { x: e.clientX, y: e.clientY };
        container.style.cursor = "grabbing";
      }
    };

    const hoverPointerMove = (e: PointerEvent) => {
      if (isDragging) return;

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
    };

    container.addEventListener("pointerdown", onPointerDown);
    container.addEventListener("pointermove", hoverPointerMove);
    container.style.touchAction = "none";
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    let animationId: number;
    let time = 0;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      if (!isDragging) {
        targetRotation.y += 0.005;
        targetRotation.x += 0.002;
      }

      // Smooth damping
      currentRotation.x += (targetRotation.x - currentRotation.x) * 0.1;
      currentRotation.y += (targetRotation.y - currentRotation.y) * 0.1;

      // Rotate only the 3D sphere (core + halo)
      core.rotation.y = currentRotation.y;
      core.rotation.x = currentRotation.x;
      halo.rotation.y = currentRotation.y;
      halo.rotation.x = currentRotation.x;

      time += 0.02;

      // Pulse the glow slightly
      const scale = 40 + Math.sin(time * 0.5) * 2;
      glow.scale.set(scale, scale, 1);

      // Update ring uniforms — only the glow highlight revolves, ring stays in place
      ringMat.uniforms.uTime.value = time;
      outerRingMat.uniforms.uTime.value = time;
      innerRingMat.uniforms.uTime.value = time;
      medRingMat.uniforms.uTime.value = time;

      // Update core sphere lines
      coreMat.uniforms.uTime.value = time;

      // Update fading wave rings
      for (const wMat of waveRingMats) {
        wMat.uniforms.uTime.value = time;
      }

      // Update inner filament uniforms
      for (const fMat of filamentMats) {
        fMat.uniforms.uTime.value = time;
      }

      // Slowly rotate the filament group for extra visual motion
      filamentGroup.rotation.y += 0.003;
      filamentGroup.rotation.z += 0.001;

      // Update nucleus pulse
      nucleusMat.uniforms.uTime.value = time;

      // Animate orbiting particles
      const posAttr = particleGeo.getAttribute(
        "position",
      ) as THREE.BufferAttribute;
      for (let i = 0; i < particleCount; i++) {
        const orbit = particleOrbitData[i];
        const angle = orbit.phase + time * orbit.speed;
        // Orbit in the plane perpendicular to the axis
        const perpA = new THREE.Vector3(1, 0, 0);
        if (Math.abs(orbit.axis.dot(perpA)) > 0.9) perpA.set(0, 1, 0);
        const u = new THREE.Vector3()
          .crossVectors(orbit.axis, perpA)
          .normalize();
        const v = new THREE.Vector3().crossVectors(orbit.axis, u).normalize();
        posAttr.setXYZ(
          i,
          orbit.radius * (Math.cos(angle) * u.x + Math.sin(angle) * v.x),
          orbit.radius * (Math.cos(angle) * u.y + Math.sin(angle) * v.y),
          orbit.radius * (Math.cos(angle) * u.z + Math.sin(angle) * v.z),
        );
      }
      posAttr.needsUpdate = true;

      // Pulse particle brightness
      particleMat.opacity = 0.5 + 0.4 * Math.sin(time * 1.5);

      renderer.render(scene, camera);
    };

    animate();

    // 7. Resize Handler
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
      glowTexture.dispose();
      glowMaterial.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      outerRingGeo.dispose();
      outerRingMat.dispose();
      innerRingGeo.dispose();
      innerRingMat.dispose();
      medRingGeo.dispose();
      medRingMat.dispose();
      for (const g of waveRingGeos) g.dispose();
      for (const m of waveRingMats) m.dispose();
      for (const g of filamentGeos) g.dispose();
      for (const m of filamentMats) m.dispose();
      nucleusGeo.dispose();
      nucleusMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full overflow-visible" />;
}

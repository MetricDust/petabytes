"use client";

import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import {
  motion,
  AnimatePresence,
  useTransform,
  useMotionValue,
  useSpring,
  Variants,
} from "framer-motion";
import {
  Zap,
  Shield,
  Cpu,
  ArrowRight,
  Terminal,
  Layers,
  Search,
  CheckCircle2,
  HelpCircle,
  Database,
} from "lucide-react";

/* ----------------------------------------------------------------------
   GLSL SHADERS (Audio Visualizer) - Tuned for Light Mode
   ----------------------------------------------------------------------
*/

const vertexShader = `
uniform float uTime;
uniform float uBass;
uniform float uMid;
uniform float uTreble;
uniform vec3 uColorInner;
uniform vec3 uColorOuter;
uniform float uPixelRatio;

attribute float aSize;
attribute float aAngle;
attribute float aRadius;
attribute float aSpeed;
attribute float aRandom;

varying vec3 vColor;
varying float vAlpha;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 = v - i + dot(i, C.xxx) ;
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute( permute( permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
  float n_ = 0.142857142857;
  vec3  ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.zzww*sh.zzww ;
  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
}

void main() {
    float currentAngle = aAngle + (uTime * aSpeed * 0.2);
    float audioExpansion = uBass * 4.0 * smoothstep(0.0, 1.0, aRandom); 
    float finalRadius = aRadius + audioExpansion;
    
    vec3 noisePos = vec3(
        cos(currentAngle) * finalRadius * 0.5,
        sin(currentAngle) * finalRadius * 0.5,
        uTime * 0.5
    );
    float turbulence = snoise(noisePos) * (1.0 + uTreble * 3.0);
    
    vec3 pos = vec3(0.0);
    pos.x = cos(currentAngle) * (finalRadius + turbulence);
    pos.y = sin(currentAngle) * (finalRadius + turbulence);
    pos.z = (turbulence * 2.0) + (aRandom - 0.5) * (1.0 + uMid * 5.0);

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = (aSize * uPixelRatio) * (45.0 / -mvPosition.z);
    
    float mixFactor = smoothstep(5.0, 15.0, finalRadius);
    vColor = mix(uColorInner, uColorOuter, mixFactor);
    
    vAlpha = 1.0 - smoothstep(12.0, 22.0, finalRadius);
}
`;

const fragmentShader = `
uniform sampler2D uTexture;
varying vec3 vColor;
varying float vAlpha;

void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    float strength = 1.0 - smoothstep(0.3, 0.5, dist);
    if (strength < 0.01) discard;
    gl_FragColor = vec4(vColor, vAlpha * strength);
}
`;

/* ----------------------------------------------------------------------
   ANIMATION VARIANTS
   ----------------------------------------------------------------------
*/

const sectionFadeVariants: Variants = {
  hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const directionalVariants: Variants = {
  hidden: (i: number) => {
    if (i === 0) return { opacity: 0, x: -100, filter: "blur(10px)" };
    if (i === 1) return { opacity: 0, y: -100, filter: "blur(10px)" };
    if (i === 2) return { opacity: 0, y: 100, filter: "blur(10px)" };
    if (i === 3) return { opacity: 0, x: 100, filter: "blur(10px)" };
    return { opacity: 0, scale: 0.8 };
  },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 70,
      damping: 20,
      delay: i * 0.1,
      duration: 1.2,
    },
  }),
};

/* ----------------------------------------------------------------------
   SUB-COMPONENTS
   ----------------------------------------------------------------------
*/

const GlassCard = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [2, -2]), {
    stiffness: 100,
    damping: 25,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-2, 2]), {
    stiffness: 100,
    damping: 25,
  });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  }

  return (
    <motion.div
      style={{ rotateX, rotateY, perspective: 1200 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        mouseX.set(0);
        mouseY.set(0);
      }}
      className={`relative group backdrop-blur-3xl bg-white/60 border border-slate-200/50 rounded-[2.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.1)] overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

const FeatureCard = ({
  icon,
  title,
  description,
  index,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}) => (
  <motion.div
    custom={index}
    variants={directionalVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: false, amount: 0.1 }}
    className="group h-full"
  >
    <div
      className={`relative h-full p-10 backdrop-blur-3xl bg-white/70 border border-slate-200/60 rounded-[2rem] overflow-hidden transition-all duration-700 hover:border-red-500/30 hover:shadow-xl`}
    >
      <div className="relative z-10">
        <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-6 border border-slate-100 group-hover:bg-red-50 transition-all">
          {React.isValidElement(icon)
            ? React.cloneElement(
                icon as React.ReactElement<{
                  size?: number;
                  className?: string;
                }>,
                {
                  size: 22,
                  className: "text-slate-600 group-hover:text-red-600",
                },
              )
            : null}
        </div>
        <h3 className="text-xl font-bold mb-3 text-slate-400 leading-none">
          {title}
        </h3>
        <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  </motion.div>
);

const PlatformComponent = ({
  title,
  items,
}: {
  title: string;
  items: string[];
}) => (
  <div className="p-8 border-r last:border-none border-slate-100 flex flex-col gap-4">
    <h4 className="text-lg font-black text-red-600 uppercase tracking-tighter italic">
      {title}
    </h4>
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
          <CheckCircle2 size={16} className="text-red-500 mt-0.5 shrink-0" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

const GlowingButton = ({
  children,
  primary = false,
  onClick,
}: {
  children: React.ReactNode;
  primary?: boolean;
  onClick?: () => void;
}) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`relative px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all duration-500 overflow-hidden ${
      primary
        ? "text-white shadow-[0_15px_30px_rgba(220,38,38,0.3)]"
        : "text-slate-600 border border-slate-200 bg-white"
    }`}
  >
    {primary && <div className="absolute inset-0 bg-red-600" />}
    <span className="relative z-10">{children}</span>
  </motion.button>
);

/* ----------------------------------------------------------------------
   BACKGROUND VISUALIZER COMPONENT
   ----------------------------------------------------------------------
*/

const BackgroundVisualizer = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!mountRef.current) return;
    const width = window.innerWidth,
      height = window.innerHeight;
    const scene = new THREE.Scene(),
      camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 20;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    const particlesCount = 20000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particlesCount * 3),
      sizes = new Float32Array(particlesCount);
    const angles = new Float32Array(particlesCount),
      radii = new Float32Array(particlesCount);
    const speeds = new Float32Array(particlesCount),
      randoms = new Float32Array(particlesCount);

    for (let i = 0; i < particlesCount; i++) {
      const r = 1.5 + Math.random() * 10.0,
        theta = Math.random() * Math.PI * 2;
      sizes[i] = Math.random() * 2.0 + 0.5;
      angles[i] = theta;
      radii[i] = r;
      speeds[i] = (1.2 / r) * 3.0;
      randoms[i] = Math.random();
    }
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute("aAngle", new THREE.BufferAttribute(angles, 1));
    geometry.setAttribute("aRadius", new THREE.BufferAttribute(radii, 1));
    geometry.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));
    geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1));

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
      uniforms: {
        uTime: { value: 0 },
        uBass: { value: 0 },
        uMid: { value: 0 },
        uTreble: { value: 0 },
        uColorInner: { value: new THREE.Color("#dc2626") },
        uColorOuter: { value: new THREE.Color("#cbd5e1") },
        uPixelRatio: { value: window.devicePixelRatio },
      },
    });
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    let animationId: number;
    const animate = () => {
      material.uniforms.uTime.value += 0.008;
      particles.rotation.z += 0.001;
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };
    animate();

    const currentRef = mountRef.current;
    return () => {
      cancelAnimationFrame(animationId);
      if (currentRef) currentRef.removeChild(renderer.domElement);
    };
  }, []);
  return (
    <div
      ref={mountRef}
      className="fixed inset-0 z-0 pointer-events-none opacity-60"
      style={{ filter: "blur(8px)" }}
    />
  );
};

/* ----------------------------------------------------------------------
   MAIN APP
   ----------------------------------------------------------------------
*/

const PIPELINE_STEPS = [
  {
    id: "cache",
    label: "Cache Layer",
    sub: "LRU + TTL",
    icon: Database,
    log: ">> [CACHE] Checking key 'current_weather_sf'...\n>> [CACHE] Status: MISS (0.4ms)\n>> Forwarding to Filter Layer...",
  },
  {
    id: "filter",
    label: "Filter Layer",
    sub: "E5 Embeddings",
    icon: Search,
    log: ">> [FILTER] Embedding query 'weather in SF'\n>> [VECTOR] Top-k Search (k=10)\n>> [MATCH] Found tool 'get_weather' (Score: 0.94)",
  },
  {
    id: "agent",
    label: "Agent Layer",
    sub: "Haystack ReAct",
    icon: Cpu,
    log: ">> [AGENT] Thought: User is asking for weather.\n>> [AGENT] Action: Call get_weather(city='San Francisco')\n>> [AGENT] Observation: Pending execution...",
  },
  {
    id: "valid",
    label: "Validation",
    sub: "Param Check",
    icon: Shield,
    log: ">> [VALIDATOR] Schema Check: { city: string }\n>> [VALIDATOR] Type: 'San Francisco' is String\n>> [VALIDATOR] Status: PASSED",
  },
  {
    id: "resp",
    label: "Response",
    sub: "Natural Language",
    icon: Zap,
    log: ">> [RESPONSE] Synthesizing natural language answer...\n>> [OUTPUT] 'The current weather in San Francisco is...'\n>> [STREAM] Token stream active.",
  },
];

export default function Home() {
  const [selectedMcp, setSelectedMcp] = useState(0);
  const [pipelineStep, setPipelineStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPipelineStep((prev) => (prev + 1) % PIPELINE_STEPS.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const MCP_SERVERS = [
    {
      id: "mcp-demo",
      name: "MCP Demo Server",
      status: "online",
      endpoint: "http://localhost:7001",
      type: "Reference Impl",
      desc: "Math, weather & time tools",
    },
    {
      id: "semantic-tool",
      name: "FunctionSemantic",
      status: "online",
      endpoint: "http://localhost:8000",
      type: "Orchestrator",
      desc: "5-Layer Agent Pipeline",
    },
    {
      id: "ollama-server",
      name: "Ollama LLM",
      status: "online",
      endpoint: "http://ollama:11434",
      type: "Model Provider",
      desc: "gemma3:4b inference",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-900 selection:bg-red-100 font-sans overflow-x-hidden">
      <div className="fixed inset-0 bg-gradient-to-br from-white via-slate-50 to-slate-100 pointer-events-none" />
      <BackgroundVisualizer />

      {/* Dynamic Island */}
      <div className="fixed top-6 left-0 w-full z-50 flex justify-center px-4">
        <motion.div
          layout
          className="h-14 bg-white/80 backdrop-blur-3xl border border-slate-200 shadow-[0_20px_40px_rgba(0,0,0,0.06)] flex items-center px-6 rounded-full gap-8"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white">
              <Layers size={16} />
            </div>
            <span className="text-[10px] font-black tracking-widest">
              PETABYTES
            </span>
          </div>
          <div className="hidden md:flex gap-6 text-[9px] font-bold uppercase text-slate-500">
            <a href="#" className="hover:text-red-600 transition-colors">
              Platform
            </a>
            <a href="#" className="hover:text-red-600 transition-colors">
              Managed Hub
            </a>
            <a href="#" className="hover:text-red-600 transition-colors">
              Docs
            </a>
          </div>
          <button className="bg-red-50 text-red-600 px-4 py-1.5 rounded-full text-[8px] font-black uppercase border border-red-100 hover:bg-red-600 hover:text-white transition-all">
            Launch Console
          </button>
        </motion.div>
      </div>

      <main className="relative z-10 pt-40">
        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-6 text-center mb-40">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 px-4 py-1.5 rounded-full border border-red-200 bg-red-50/50 text-red-600 text-[10px] font-black tracking-[0.2em] uppercase mx-auto w-fit"
          >
            AI Agent Pipeline with MCP Tool Integration and Semantic Filtering
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, filter: "blur(20px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            className="text-6xl md:text-[10rem] font-black tracking-tighter leading-[0.75] mb-12 text-slate-400 uppercase"
          >
            One Hub.
            <br />
            <span className="text-red-600 italic">Total Control.</span>
          </motion.h1>
          <p className="text-slate-500 text-lg md:text-2xl max-w-3xl mx-auto mb-12 leading-relaxed">
            Stop managing disjointed MCP servers. SuperMcp provides a 5-layer
            semantic agent pipeline with intelligent tool filtering, parameter
            validation, and multi-turn conversation memory.
          </p>
          <div className="flex gap-4 justify-center">
            <GlowingButton primary>Claim Your Hub</GlowingButton>
            <GlowingButton>View Demo</GlowingButton>
          </div>
        </section>

        {/* PILLARS */}
        <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-6 mb-40">
          <FeatureCard
            index={0}
            icon={<Search />}
            title="Semantic Filtering"
            description="Microsoft E5 embeddings for intelligent tool selection. Top-k search with configurable minimum scores."
          />
          <FeatureCard
            index={1}
            icon={<Shield />}
            title="Parameter Validation"
            description="Validates tool calls before execution. Asks for missing parameters instead of guessing."
          />
          <FeatureCard
            index={2}
            icon={<Database />}
            title="Conversation Memory"
            description="Multi-turn conversations with TTL and LRU eviction. Configurable max conversations per session."
          />
          <FeatureCard
            index={3}
            icon={<Cpu />}
            title="ReAct Pattern"
            description="Thought → Action → Observation loop powered by Haystack agents for maximum accuracy."
          />
        </section>

        {/* --- SUPERMCP PIPELINE VISUALIZATION --- */}
        <motion.section
          variants={sectionFadeVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.1 }}
          className="max-w-7xl mx-auto px-6 mb-40"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-slate-400 uppercase tracking-tighter italic">
              SuperMcp Pipeline
            </h2>
            <p className="text-slate-500">
              Live visualization of the 5-Layer Semantic Agent Architecture.
            </p>
          </div>

          <GlassCard className="p-1">
            <div className="bg-white/40 rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row h-[800px]">
              {/* Sidebar: Managed Nodes */}
              <div className="w-full md:w-72 border-r border-slate-100 flex flex-col bg-white/30 backdrop-blur-sm">
                <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">
                    Mcp Nodes
                  </span>
                  <div className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg shadow-sm">
                    <Search size={14} className="text-slate-400" />
                    <input
                      placeholder="Search nodes..."
                      className="bg-transparent border-none outline-none text-xs w-full font-medium"
                    />
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                  {MCP_SERVERS.map((server, idx) => (
                    <button
                      key={server.id}
                      onClick={() => setSelectedMcp(idx)}
                      className={`w-full p-4 rounded-2xl text-left transition-all flex items-center justify-between group ${selectedMcp === idx ? "bg-red-50 border border-red-100 shadow-sm" : "hover:bg-slate-50 border border-transparent"}`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full ${server.status === "online" ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" : "bg-amber-500 animate-pulse"}`}
                        />
                        <div className="min-w-0">
                          <p
                            className={`text-xs font-black uppercase tracking-tight truncate ${selectedMcp === idx ? "text-red-600" : "text-slate-700"}`}
                          >
                            {server.name}
                          </p>
                          <p className="text-[9px] text-slate-400 font-mono truncate">
                            {server.type}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="p-6 border-t border-slate-100 text-center">
                  <div className="flex justify-center gap-4 text-[10px] font-mono text-slate-400">
                    <span className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />{" "}
                      CPU: 12%
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />{" "}
                      MEM: 4GB
                    </span>
                  </div>
                </div>
              </div>

              {/* Main Dashboard Panel */}
              <div className="flex-1 flex flex-col min-w-0 bg-slate-50/30">
                {/* Pipeline Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white/40">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-slate-900 text-white rounded-lg">
                      <Terminal size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-400 uppercase tracking-wide">
                        Orchestration Trace
                      </h3>
                      <p className="text-[10px] text-slate-500 font-mono">
                        ID: req_8f92_weather_sf
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase border border-green-200">
                      Active
                    </span>
                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase border border-slate-200">
                      v2.4.0
                    </span>
                  </div>
                </div>

                {/* 5-Layer Pipeline Visualizer */}
                <div className="flex-1 relative p-12 flex flex-col items-center justify-center">
                  <div className="absolute inset-x-0 h-px bg-slate-200 top-1/2 -z-10" />

                  <div className="grid grid-cols-5 gap-4 w-full relative z-10">
                    {PIPELINE_STEPS.map((step, idx) => {
                      const isActive = pipelineStep === idx;
                      const isPast = pipelineStep > idx;

                      return (
                        <div
                          key={step.id}
                          className="relative flex flex-col items-center group"
                        >
                          <motion.div
                            animate={{
                              scale: isActive ? 1.1 : 1,
                              borderColor: isActive
                                ? "rgb(220,38,38)"
                                : isPast
                                  ? "rgb(34,197,94)"
                                  : "rgb(226,232,240)",
                              backgroundColor: isActive
                                ? "rgb(255,255,255)"
                                : isPast
                                  ? "rgb(240,253,244)"
                                  : "rgb(248,250,252)",
                            }}
                            className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 shadow-lg mb-6 transition-colors duration-300 relative z-20`}
                          >
                            <step.icon
                              size={24}
                              className={
                                isActive
                                  ? "text-red-600"
                                  : isPast
                                    ? "text-green-500"
                                    : "text-slate-300"
                              }
                            />

                            {/* Pulse Effect */}
                            {isActive && (
                              <div className="absolute inset-0 bg-red-500/20 rounded-2xl animate-ping" />
                            )}
                          </motion.div>

                          <div className="text-center">
                            <h4
                              className={`text-xs font-black uppercase tracking-wider mb-1 ${isActive ? "text-red-600" : "text-slate-500"}`}
                            >
                              {step.label}
                            </h4>
                            <p className="text-[9px] font-mono text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-100 inline-block">
                              {step.sub}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Live Log Output */}
                <div className="h-64 bg-slate-900 p-6 flex flex-col border-t border-slate-200 font-mono text-xs overflow-hidden">
                  <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
                    <span className="text-slate-400 font-black uppercase text-[10px]">
                      Execution Log
                    </span>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-2 text-slate-300">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={pipelineStep}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0.5, filter: "blur(2px)" }}
                        className="space-y-1"
                      >
                        {PIPELINE_STEPS[pipelineStep].log
                          .split("\n")
                          .map((line, i) => (
                            <p key={i} className="flex gap-2">
                              <span className="text-slate-600 select-none">
                                {new Date().toTimeString().split(" ")[0]}
                              </span>
                              <span
                                className={
                                  line.includes("Error")
                                    ? "text-red-400"
                                    : line.includes("Passed")
                                      ? "text-green-400"
                                      : "text-slate-300"
                                }
                              >
                                {line}
                              </span>
                            </p>
                          ))}
                        <motion.span
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ repeat: Infinity, duration: 0.8 }}
                          className="inline-block w-2 h-4 bg-red-500/50 align-middle ml-1"
                        />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.section>

        {/* PLATFORM COMPONENTS (Stacklok extraction) */}
        <section className="max-w-7xl mx-auto px-6 mb-40">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-slate-400 uppercase tracking-tighter italic">
              Modular Architecture
            </h2>
            <p className="text-slate-500 mt-4 max-w-2xl mx-auto">
              Clean dependency injection with interface segregation. Every
              component is testable, swappable, and built for production scale.
            </p>
          </div>
          <GlassCard>
            <div className="grid grid-cols-1 md:grid-cols-4 bg-white/30 backdrop-blur-3xl rounded-[2.5rem]">
              <PlatformComponent
                title="API Layer"
                items={[
                  "FastAPI routes & models",
                  "Chat, tools, health endpoints",
                  "Cursor-based pagination",
                ]}
              />
              <PlatformComponent
                title="Core Engine"
                items={[
                  "Abstract interfaces (DI)",
                  "Tool call extraction",
                  "2-level semantic filter",
                ]}
              />
              <PlatformComponent
                title="Pipeline"
                items={[
                  "5-layer agent execution",
                  "Haystack + ReAct pattern",
                  "Parameter validation",
                ]}
              />
              <PlatformComponent
                title="Infrastructure"
                items={[
                  "Circuit breaker resilience",
                  "HTTP retry policies",
                  "DuckDB persistence",
                ]}
              />
            </div>
          </GlassCard>
        </section>

        {/* FAQ & CTA */}
        <section className="max-w-7xl mx-auto px-6 mb-40 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-12 rounded-[3rem] bg-red-600 text-white flex flex-col justify-between h-[450px] shadow-2xl shadow-red-200">
            <h3 className="text-4xl font-black uppercase italic leading-none">
              Scale your <br />
              intelligence <br />
              securely
            </h3>
            <p className="text-red-100 text-lg leading-relaxed">
              Join the world&apos;s most innovative engineering teams building
              on the Petabytes Protocol.
            </p>
            <button className="flex items-center gap-2 font-black uppercase tracking-widest text-[11px] group">
              Read Architecture docs{" "}
              <ArrowRight
                size={16}
                className="group-hover:translate-x-2 transition-transform"
              />
            </button>
          </div>
          <GlassCard className="md:col-span-2 p-14 flex flex-col gap-8 h-[450px]">
            <div className="flex gap-4 items-center">
              <HelpCircle className="text-red-600" size={32} />
              <h3 className="text-3xl font-black text-slate-400 uppercase">
                Platform Intelligence
              </h3>
            </div>
            <div className="space-y-6 overflow-y-auto">
              {[
                {
                  q: "How does semantic filtering work?",
                  a: "Microsoft E5 embeddings create vector representations of your query and available tools. Top-k search (default k=10) finds the best matches above a minimum score threshold.",
                },
                {
                  q: "Can I deploy on CPU or GPU?",
                  a: "Yes! Use docker-compose.cpu.yml for CPU mode or docker-compose.yml for GPU acceleration with NVIDIA support.",
                },
                {
                  q: "How does clarification work?",
                  a: "When required parameters are missing, the agent asks for clarification instead of guessing. This prevents incorrect tool calls and improves accuracy.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="pb-6 border-b border-slate-100 last:border-none"
                >
                  <p className="font-bold text-slate-400 mb-2 uppercase text-xs tracking-widest">
                    {item.q}
                  </p>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </GlassCard>
        </section>

        <section className="py-60 px-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-red-500/10 blur-[200px]" />
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-7xl md:text-[12rem] font-black tracking-tighter mb-16 leading-[0.8] uppercase italic text-slate-400"
          >
            Unified <br />
            <span className="text-red-600">Sync.</span>
          </motion.h2>
          <GlowingButton primary>Get Access Now</GlowingButton>
        </section>
      </main>

      <footer className="w-full border-t border-slate-100 bg-white/60 backdrop-blur-3xl px-10 pt-32 pb-0 text-center relative z-20 overflow-hidden">
        {/* Background Watermark - Fixed Scale */}
        <div
          className="absolute inset-x-0 bottom-0 flex justify-center pointer-events-none -z-10 select-none"
          style={{ transform: "translateY(20%)" }}
        >
          <span
            className="font-black text-slate-300/30 uppercase tracking-tighter leading-none whitespace-nowrap"
            style={{ fontSize: "16vw" }}
          >
            petabytes
          </span>
        </div>

        <div className="relative z-10 pb-24">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-red-600 shadow-sm border border-slate-200">
              <Layers size={16} />
            </div>
            <span className="font-black text-sm uppercase">
              Petabytes Protocol
            </span>
          </div>
          <span className="text-slate-400 text-[10px] font-black tracking-[0.4em] uppercase">
            © 2025 // THE STANDARD FOR MANAGED MCP FLEETS.
          </span>
        </div>
      </footer>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(220,38,38,0.2); }
      `,
        }}
      />
    </div>
  );
}

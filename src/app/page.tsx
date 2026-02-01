/* eslint-disable react/jsx-no-comment-textnodes */
"use client";

const basePath = process.env.NODE_ENV === "production" ? "/petabytes" : "";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Play,
  Code,
  Zap,
  ChevronRight,
  CheckCircle,
  Activity,
  Globe,
  Box,
  Terminal,
  Cpu,
  Layers,
  ArrowRight,
  Server,
} from "lucide-react";

export default function Home() {
  const [activeStep, setActiveStep] = useState(0);
  const [hoveredWorkflowStep, setHoveredWorkflowStep] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const workflowRef = useRef<HTMLElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!workflowRef.current) return;
    const rect = workflowRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Scroll Logic for Workflow
  useEffect(() => {
    const handleScroll = () => {
      if (!workflowRef.current) return;
      const rect = workflowRef.current.getBoundingClientRect();
      const sectionHeight = rect.height;
      const viewportHeight = window.innerHeight;

      // Calculate progress: 0 when entering, 1 when finished scrolling the section
      const scrollDist = -rect.top;
      const totalScrollable = sectionHeight - viewportHeight;

      if (scrollDist < 0) return; // Before section

      if (scrollDist > totalScrollable) {
        if (hoveredWorkflowStep !== 2) setHoveredWorkflowStep(2);
        return;
      }

      const progress = Math.max(0, Math.min(1, scrollDist / totalScrollable));
      const step = Math.min(2, Math.floor(progress * 3));

      if (hoveredWorkflowStep !== step) {
        setHoveredWorkflowStep(step);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hoveredWorkflowStep]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#E4E7EB] text-gray-800 font-sans selection:bg-red-500/20 selection:text-red-900 relative">
      {/* Background Lighting/Sheen */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Breathing Top-Left Corner Glow */}
        <div className="absolute top-[-15%] left-[-15%] w-[60%] h-[60%] bg-gradient-to-br from-red-500/30 to-red-600/5 rounded-full blur-[120px] opacity-70 animate-pulse-soft" />

        {/* Top light source */}
        <div className="absolute top-[-20%] left-[20%] w-[60%] h-[60%] bg-white/40 rounded-full blur-[150px]" />
        {/* Subtle red ambient glow */}
        <div className="absolute top-[30%] right-[-10%] w-[40%] h-[40%] bg-red-500/5 rounded-full blur-[120px]" />
        {/* Bottom cool shadow */}
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-gray-400/10 rounded-full blur-[100px]" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center w-full px-6">
        <div className="max-w-5xl w-full glass-pill px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="p-2 rounded-full bg-red-500/10 group-hover:bg-red-500/20 transition-colors">
              <Layers className="w-5 h-5 text-red-600" />
            </div>
            <span className="text-lg font-bold tracking-tight text-gray-900">
              Peta<span className="text-red-600">bytes</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
            <a
              href="#features"
              className="hover:text-red-600 transition-colors"
            >
              Features
            </a>
            <a
              href="#workflow"
              className="hover:text-red-600 transition-colors"
            >
              Workflow
            </a>
            <a href="#docs" className="hover:text-red-600 transition-colors">
              Docs
            </a>
          </div>

          <button className="hidden md:flex items-center gap-2 px-5 py-2 rounded-full bg-black text-white hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/30 transition-all duration-300 text-sm font-medium">
            <span>Get Started</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Global Workflow Connector (Hero -> Features) */}
      <div className="absolute top-0 left-0 right-0 h-[1500px] max-w-7xl mx-auto px-6 pointer-events-none z-[5] hidden lg:block overflow-visible">
        <svg
          className="w-full h-full overflow-visible"
          viewBox="0 0 1200 1500"
          fill="none"
          preserveAspectRatio="none"
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" />
            </marker>
          </defs>

          {/* The Circuit Path */}
          <path
            d="M 950 550 V 675 Q 950 700 925 700 H 140 Q 115 700 115 725 V 1080"
            stroke="#ef4444"
            strokeWidth="3"
            strokeDasharray="12 12"
            strokeLinecap="round"
            fill="none"
            markerEnd="url(#arrowhead)"
            className="opacity-40"
          />

          {/* Animated Pulse along the path */}
          <circle r="5" fill="#ef4444" className="opacity-60">
            <animateMotion
              dur="4s"
              repeatCount="indefinite"
              path="M 950 550 V 675 Q 950 700 925 700 H 140 Q 115 700 115 725 V 1080"
            />
          </circle>
        </svg>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-48 pb-24 px-6 overflow-hidden">
        {/* Abstract Wave Background Image */}
        <div className="absolute inset-0 w-full h-full -z-10 pointer-events-none overflow-hidden">
          <Image
            src={`${basePath}/abstract-wave.png`}
            alt="Abstract Wave Background"
            fill
            className="object-cover object-center blur"
            priority
          />
        </div>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* Hero Content */}
          <div className="space-y-8 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm text-gray-500 text-xs font-semibold tracking-wider uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              v2.4 Public Beta
            </div>

            <h1 className="text-6xl md:text-8xl font-bold leading-[0.95] tracking-tighter text-gray-900">
              Turn APIs into <br />
              <span className="text-gradient-red">MCP Servers.</span>
            </h1>

            <p className="text-xl text-gray-500 max-w-lg leading-relaxed font-medium">
              Build production-ready Model Context Protocol servers in seconds
              not hours. Just paste your URL.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
              <button className="px-6 py-3 sm:px-8 sm:py-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white text-sm sm:text-base font-bold shadow-xl shadow-red-500/20 hover:shadow-red-500/40 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                Start Building Free
              </button>
              <button className="px-6 py-3 sm:px-8 sm:py-4 rounded-2xl bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-sm sm:text-base font-semibold shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2">
                <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current text-gray-400" />
                Watch Demo
              </button>
            </div>
          </div>

          {/* Vision Pro Style Card UI - Dynamic Workflow */}
          <div className="relative perspective-1000">
            {/* Decorative Blobs - Responsive sizing */}
            <div className="absolute top-4 sm:top-10 right-4 sm:right-10 w-40 h-40 sm:w-64 sm:h-64 bg-red-500/20 rounded-full blur-3xl -z-10 mix-blend-multiply animate-pulse-soft" />
            <div className="absolute bottom-4 sm:bottom-10 left-4 sm:left-10 w-40 h-40 sm:w-64 sm:h-64 bg-gray-300/20 rounded-full blur-3xl -z-10 mix-blend-multiply" />

            {/* Main Glass Panel */}
            <div className="glass-card p-4 sm:p-6 md:p-8 animate-float">
              {/* Header */}
              <div className="flex items-center justify-between mb-6 sm:mb-8">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/30 text-white">
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-gray-900">
                      Auto-Recall Engine
                    </div>
                    <div className="text-[10px] sm:text-xs text-gray-500">
                      Live Simulation
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${activeStep === i || (activeStep === 3 && i === 2) ? "bg-red-500 scale-125" : "bg-gray-300"}`}
                    />
                  ))}
                </div>
              </div>

              {/* Steps Container */}
              <div className="relative space-y-3 sm:space-y-4">
                {/* Step 1: Input */}
                <div
                  className={`transition-all duration-500 border rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center gap-2 sm:gap-4 ${activeStep === 0 ? "bg-white shadow-lg border-red-200 scale-105" : "bg-white/40 border-gray-100 opacity-60"}`}
                >
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${activeStep === 0 ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-400"}`}
                  >
                    <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                      Input Source
                    </div>
                    <div className="font-mono text-xs sm:text-sm text-gray-600 truncate bg-gray-50 px-2 py-1 rounded">
                      https://api.store.com/v2/products
                    </div>
                  </div>
                  {activeStep === 0 && (
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
                  )}
                </div>

                {/* Connecting Line 1 */}
                <div className="h-3 sm:h-4 flex justify-center">
                  <div
                    className={`w-0.5 h-full transition-colors duration-300 ${activeStep >= 1 ? "bg-red-300" : "bg-gray-200"}`}
                  />
                </div>

                {/* Step 2: Processing */}
                <div
                  className={`transition-all duration-500 border rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center gap-2 sm:gap-4 ${activeStep === 1 ? "bg-white shadow-lg border-red-200 scale-105" : "bg-white/40 border-gray-100 opacity-60"}`}
                >
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${activeStep === 1 ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-400"}`}
                  >
                    <Activity
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${activeStep === 1 ? "animate-spin" : ""}`}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                      Processing
                    </div>
                    <div className="h-1.5 sm:h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-red-500 transition-all duration-[3000ms] ease-linear ${activeStep === 1 ? "w-full" : "w-0"}`}
                      />
                    </div>
                  </div>
                </div>

                {/* Connecting Line 2 */}
                <div className="h-3 sm:h-4 flex justify-center">
                  <div
                    className={`w-0.5 h-full transition-colors duration-300 ${activeStep >= 2 ? "bg-red-300" : "bg-gray-200"}`}
                  />
                </div>

                {/* Step 3: MCP Output */}
                <div
                  className={`transition-all duration-500 border rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center gap-2 sm:gap-4 ${activeStep >= 2 ? "bg-gradient-to-tr from-white to-red-50 shadow-xl border-red-200 scale-105 ring-1 ring-red-100" : "bg-white/40 border-gray-100 opacity-60"}`}
                >
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${activeStep >= 2 ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}
                  >
                    <Server className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                      Generated Server
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-xs sm:text-sm font-bold truncate ${activeStep >= 2 ? "text-gray-900" : "text-gray-400"}`}
                      >
                        petabytes-mcp:latest
                      </span>
                      {activeStep >= 2 && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-bold bg-green-100 text-green-700 whitespace-nowrap">
                          READY
                        </span>
                      )}
                    </div>
                  </div>
                  {activeStep >= 2 && (
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Workflow Board (Data-Driven) */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-gray-900">Platform Scale</h2>
            <p className="text-gray-500 mt-2">
              Engineered for extreme performance and reliability.
            </p>
          </div>

          <div className="relative">
            {/* SVG Connectors Layer - Hidden on mobile, visible on lg screens */}
            <div className="hidden lg:block absolute inset-0 pointer-events-none z-0">
              <svg
                className="w-full h-full overflow-visible"
                viewBox="0 0 1200 200"
                fill="none"
              >
                {/* Top Path: Right Flow */}
                <path
                  d="M 0 50 H 1200"
                  stroke="#ef4444"
                  strokeWidth="3"
                  strokeDasharray="12 12"
                  className="opacity-40"
                />
                {/* Bottom Path: Left Flow */}
                <path
                  d="M 1200 150 H 0"
                  stroke="#ef4444"
                  strokeWidth="3"
                  strokeDasharray="12 12"
                  className="opacity-40"
                />

                {/* Animated Particle (Top - Moving Right) */}
                <circle r="5" fill="#ef4444" className="opacity-60">
                  <animateMotion
                    dur="6s"
                    repeatCount="indefinite"
                    path="M 0 50 H 1200"
                  />
                </circle>

                {/* Animated Particle (Bottom - Moving Left) */}
                <circle r="5" fill="#ef4444" className="opacity-60">
                  <animateMotion
                    dur="6s"
                    repeatCount="indefinite"
                    path="M 1200 150 H 0"
                  />
                </circle>
                <defs>
                  <linearGradient
                    id="gradient-line"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.2" />
                    <stop offset="50%" stopColor="#ef4444" stopOpacity="1" />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity="0.2" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Stats Cards Container (Workflow Style) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 relative z-10">
              {/* Stat 1: Latency */}
              <div className="glass-card p-6 relative group hover:-translate-y-1 transition-transform duration-300">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold ring-4 ring-white">
                  1
                </div>
                <div className="h-full flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Activity className="w-6 h-6" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-1">
                    &lt; 15ms
                  </h3>
                  <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">
                    Global Latency
                  </p>
                </div>
              </div>

              {/* Stat 2: Uptime */}
              <div className="glass-card p-6 relative group hover:-translate-y-1 transition-transform duration-300">
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center text-white text-xs font-bold ring-4 ring-white">
                  2
                </div>
                <div className="h-full flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 text-gray-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Server className="w-6 h-6" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-1">
                    99.99%
                  </h3>
                  <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">
                    Uptime SLA
                  </p>
                </div>
              </div>

              {/* Stat 3: Integrations */}
              <div className="glass-card p-6 relative group hover:-translate-y-1 transition-transform duration-300">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center text-white text-xs font-bold ring-4 ring-white">
                  3
                </div>
                <div className="h-full flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 text-gray-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Layers className="w-6 h-6" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-1">
                    150+
                  </h3>
                  <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">
                    Integrations
                  </p>
                </div>
              </div>

              {/* Stat 4: Active Builds */}
              <div className="glass-card p-6 relative group hover:-translate-y-1 transition-transform duration-300">
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold ring-4 ring-white">
                  4
                </div>
                <div className="h-full flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-1">
                    2.4M
                  </h3>
                  <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">
                    Active Builds
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6 relative ">
        {/* Connector Line from Stats (Top) to Features (Bottom) */}
        <div className="hidden lg:block absolute inset-0 max-w-7xl mx-auto pointer-events-none overflow-visible">
          <svg
            className="w-full h-full overflow-visible"
            viewBox="0 0 1200 800"
            fill="none"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient
                id="connector-gradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0" />
                <stop offset="20%" stopColor="#ef4444" stopOpacity="0.4" />
                <stop offset="80%" stopColor="#ef4444" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Path: Starts above (from Stats), goes down, jogs right, connects to Feature 1 */}
            <path
              d="M 150 -100 V 200 C 150 250, 200 250, 200 300 V 450"
              stroke="#ef4444"
              strokeWidth="3"
              strokeDasharray="12 12"
              className="opacity-40"
            />
            {/* Moving particle */}
            <circle r="5" fill="#ef4444" className="opacity-60">
              <animateMotion
                dur="4s"
                repeatCount="indefinite"
                path="M 150 -100 V 200 C 150 250, 200 250, 200 300 V 450"
              />
            </circle>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-20 text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 tracking-tight">
              Designed for Speed. <br />
              <span className="text-gray-400">Built for Scale.</span>
            </h2>
            <p className="text-xl text-gray-500">
              Our engine parses your API structure and generates a fully
              compliant Model Context Protocol server in real-time.
            </p>
          </div>

          {/* Dynamic Expanding Features - Wireframe Implementation */}
          {/* Dynamic Expanding Features - Wireframe Implementation */}
          <div className="flex flex-col md:flex-row gap-4 h-auto md:h-[400px] transition-all">
            {[
              {
                id: 1,
                title: "HTTP to MCP",
                desc: "Directly ingest REST, GraphQL, or SOAP endpoints. We handle the schema mapping automatically.",
                icon: Globe,
                visual: (
                  <Image
                    src={`${basePath}/images/feat1.png`}
                    alt="HTTP to MCP Interface"
                    fill
                    className="object-contain"
                  />
                ),
              },
              {
                id: 2,
                title: "Live Testing Console",
                desc: "Debug your MCP tools in real-time before deploying. See exactly what the LLM sees.",
                icon: Terminal,
                visual: (
                  <Image
                    src={`${basePath}/images/feat2.png`}
                    alt="Live Testing Console"
                    fill
                    className="object-contain"
                  />
                ),
              },
              {
                id: 3,
                title: "One-Click Deploy",
                desc: "Push to our edge network or export as a Docker container. Your infrastructure, your choice.",
                icon: Box,
                visual: (
                  <Image
                    src={`${basePath}/images/feat3.png`}
                    alt="Deployment Dashboard"
                    fill
                    className="object-contain"
                  />
                ),
              },
            ].map((feature, i) => (
              <div
                key={feature.id}
                className="group relative flex-1 md:hover:flex-[3] transition-[flex-grow] duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] min-h-[380px] md:min-h-full cursor-pointer z-0"
              >
                {/* Connector Line (visible on tablet and desktop) */}
                {i < 2 && (
                  <div className="hidden md:block absolute -right-5 top-1/2 -translate-y-1/2 w-6 border-t-2 border-dashed border-gray-400/50 z-[-1]" />
                )}

                {/* Card Container (Inner) */}
                <div className="w-full h-full relative overflow-hidden rounded-2xl md:rounded-[2.5rem] border border-white/20 shadow-xl">
                  {/* Main Background (Red Gradient) */}
                  <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-red-700 opacity-100 transition-colors duration-500" />

                  {/* MOBILE LAYOUT: Vertical Stack with Always-Visible Image */}
                  <div className="md:hidden relative h-full flex flex-col p-4 gap-4 z-10">
                    {/* Image - Always visible on mobile */}
                    <div className="w-full h-40 relative overflow-hidden rounded-xl bg-white/5 backdrop-blur-sm flex-shrink-0">
                      {feature.visual}
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-4 text-white shadow-lg">
                          <feature.icon className="w-6 h-6" />
                        </div>

                        <h3 className="text-xl font-bold mb-2 text-white">
                          {feature.title}
                        </h3>

                        <p className="text-sm font-medium leading-relaxed text-white/90">
                          {feature.desc}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* TABLET & DESKTOP LAYOUT: Original Expanding Animation */}
                  <div className="hidden md:flex absolute inset-0 p-3 gap-3">
                    {/* Left Side: Visual/Image Card (Reveals on Hover) */}
                    <div className="w-0 group-hover:w-1/2 transition-[width] duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] relative overflow-hidden rounded-[2rem]">
                      {feature.visual}
                    </div>

                    {/* Right Side: Content Card (Transitions to White on Hover) */}
                    <div className="flex-1 rounded-[2rem] p-6 lg:p-8 flex flex-col justify-between relative z-10 transition-all duration-500 group-hover:bg-white group-hover:shadow-2xl">
                      <div>
                        {/* Icon: Transitions from Glass to Red on White Background */}
                        <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-6 text-white shadow-lg group-hover:bg-red-50 group-hover:border-red-100 group-hover:text-red-600 transition-all duration-500">
                          <feature.icon className="w-6 h-6" />
                        </div>

                        <h3 className="text-xl lg:text-2xl font-bold mb-3 whitespace-nowrap transition-colors duration-500 text-white group-hover:text-gray-900">
                          {feature.title}
                        </h3>

                        <p className="text-sm lg:text-base font-medium leading-relaxed max-w-md transition-colors duration-500 text-white/80 group-hover:text-gray-500">
                          {feature.desc}
                        </p>
                      </div>

                      {/* Arrow / CTA */}
                      <div className="flex items-center gap-2 font-bold text-sm tracking-widest uppercase transition-all duration-500 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 text-white group-hover:text-red-600">
                        <span>Explore</span>
                        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Connector: Features -> Workflow */}
          <div className="hidden lg:block absolute top-[100%] left-0 right-0 h-[400px] w-full pointer-events-none z-0 overflow-visible">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 1200 400"
              fill="none"
              preserveAspectRatio="none"
            >
              <defs>
                <marker
                  id="arrowhead-down"
                  markerWidth="10"
                  markerHeight="7"
                  refX="5"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 10 3.5, 0 7"
                    fill="#ef4444"
                    className="opacity-60"
                  />
                </marker>
              </defs>

              {/* Left Path: Down then Right to Center */}
              <path
                d="M 200 -20 V 60 Q 200 80 220 80 H 600"
                stroke="#ef4444"
                strokeWidth="3"
                strokeDasharray="12 12"
                className="opacity-40"
              />

              {/* Right Path: Down then Left to Center */}
              <path
                d="M 1000 -20 V 60 Q 1000 80 980 80 H 600"
                stroke="#ef4444"
                strokeWidth="3"
                strokeDasharray="12 12"
                className="opacity-40"
              />

              {/* Middle Path: Down to Center Intersection */}
              <path
                d="M 600 -20 V 80"
                stroke="#ef4444"
                strokeWidth="3"
                strokeDasharray="12 12"
                className="opacity-40"
              />

              {/* Output Path: Center Intersection -> Curve Left -> Down to Card */}
              <path
                d="M 600 80 V 120 Q 600 140 580 140 H 320 Q 300 140 300 160 V 380"
                stroke="#ef4444"
                strokeWidth="3"
                strokeDasharray="12 12"
                className="opacity-40"
                markerEnd="url(#arrowhead-down)"
              />

              {/* Animated Particles */}
              {/* Particle 1: Left -> Center -> Output */}
              <circle r="5" fill="#ef4444" className="opacity-60">
                <animateMotion
                  dur="4s"
                  repeatCount="indefinite"
                  path="M 200 -20 V 60 Q 200 80 220 80 H 600 V 120 Q 600 140 580 140 H 320 Q 300 140 300 160 V 380"
                />
              </circle>
              {/* Particle 2: Right -> Center -> Output */}
              <circle r="5" fill="#ef4444" className="opacity-60">
                <animateMotion
                  dur="4s"
                  repeatCount="indefinite"
                  path="M 1000 -20 V 60 Q 1000 80 980 80 H 600 V 120 Q 600 140 580 140 H 320 Q 300 140 300 160 V 380"
                  begin="2s"
                />
              </circle>
              {/* Particle 3: Middle -> Center -> Output */}
              <circle r="5" fill="#ef4444" className="opacity-60">
                <animateMotion
                  dur="4s"
                  repeatCount="indefinite"
                  path="M 600 -20 V 120 Q 600 140 580 140 H 320 Q 300 140 300 160 V 380"
                  begin="1s"
                />
              </circle>
            </svg>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section
        id="workflow"
        ref={workflowRef}
        onMouseMove={handleMouseMove}
        className="relative z-10 h-[400vh]"
      >
        <div className="sticky top-0 h-screen flex items-center justify-center w-full overflow-hidden">
          <div className="max-w-7xl mx-auto w-full px-6">
            <div className="grid md:grid-cols-2 gap-20 items-center">
              {/* Visual */}
              <div className="relative aspect-square order-2 md:order-1">
                <div className="absolute inset-0 bg-gradient-to-tr from-gray-200 to-red-50 rounded-full blur-[100px]" />
                <div className="glass-card w-full h-full p-8 flex flex-col relative z-10">
                  {/* Dynamic Content */}
                  <div className="flex-1 relative">
                    {hoveredWorkflowStep === 0 && (
                      <div className="animate-fade-in flex flex-col h-full items-center justify-center text-center space-y-6">
                        <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center relative">
                          <div className="absolute inset-0 bg-red-200 rounded-full animate-ping opacity-20"></div>
                          <Globe className="w-10 h-10 text-red-600" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-2">
                            Connecting
                          </p>
                          <h4 className="text-2xl font-bold text-gray-900">
                            Endpoint Config
                          </h4>
                        </div>
                        <div className="glass-pill px-6 py-3 font-mono text-sm text-gray-500 bg-white/50">
                          https://api.petabytes.com/v1
                        </div>
                      </div>
                    )}

                    {hoveredWorkflowStep === 1 && (
                      <div className="animate-fade-in flex flex-col h-full bg-gray-50 rounded-2xl p-6 border border-gray-100 shadow-inner">
                        <div className="flex items-center gap-2 mb-4 border-b border-gray-200 pb-4">
                          <Code className="w-5 h-5 text-gray-400" />
                          <span className="text-sm font-bold text-gray-600 font-mono">
                            Transform Logic
                          </span>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <div className="h-2 w-24 bg-gray-200 rounded"></div>
                            <ArrowRight className="w-3 h-3 text-gray-300" />
                            <div className="h-2 w-32 bg-gray-300 rounded"></div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <div className="h-2 w-16 bg-gray-200 rounded"></div>
                            <ArrowRight className="w-3 h-3 text-gray-300" />
                            <div className="h-2 w-28 bg-gray-300 rounded"></div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                            <div className="h-2 w-20 bg-gray-200 rounded"></div>
                            <ArrowRight className="w-3 h-3 text-gray-300" />
                            <div className="h-2 w-16 bg-gray-300 rounded"></div>
                          </div>
                        </div>
                      </div>
                    )}

                    {hoveredWorkflowStep === 2 && (
                      <div className="animate-fade-in flex flex-col h-full items-center justify-center text-center">
                        <div className="w-32 h-32 relative mb-6">
                          <svg
                            viewBox="0 0 100 100"
                            className="w-full h-full rotate-90"
                          >
                            <circle
                              cx="50"
                              cy="50"
                              r="45"
                              fill="none"
                              stroke="#F3F4F6"
                              strokeWidth="8"
                            />
                            <circle
                              cx="50"
                              cy="50"
                              r="45"
                              fill="none"
                              stroke="#10B981"
                              strokeWidth="8"
                              strokeDasharray="283"
                              strokeDashoffset="0"
                              className="animate-[spin_2s_linear_infinite]"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <CheckCircle className="w-12 h-12 text-green-500" />
                          </div>
                        </div>
                        <h4 className="text-2xl font-bold text-gray-900 mb-2">
                          Build Complete
                        </h4>
                        <p className="text-gray-500">Ready for deployment</p>
                      </div>
                    )}
                  </div>

                  {/* Footer Controls */}
                  <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                    <span>Petabytes Engine v2.4</span>
                    <div className="flex gap-1.5">
                      <div
                        className={`w-2 h-2 rounded-full ${hoveredWorkflowStep === 0 ? "bg-red-500" : "bg-gray-300"}`}
                      ></div>
                      <div
                        className={`w-2 h-2 rounded-full ${hoveredWorkflowStep === 1 ? "bg-red-500" : "bg-gray-300"}`}
                      ></div>
                      <div
                        className={`w-2 h-2 rounded-full ${hoveredWorkflowStep === 2 ? "bg-green-500" : "bg-gray-300"}`}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Text Steps */}
              <div className="order-1 md:order-2">
                <h2 className="text-3xl md:text-5xl font-bold mb-8 text-gray-900">
                  From URL to <br />
                  <span className="text-gradient-red">Agent Capability</span>
                </h2>

                <div className="space-y-6">
                  {[
                    {
                      title: "Connect Data Source",
                      desc: "Plug in any HTTP/HTTPS URL. We support Auth headers, OAuth, and custom params.",
                    },
                    {
                      title: "Define Logic",
                      desc: "Use our visual node editor to transform raw JSON into semantic context for AI.",
                    },
                    {
                      title: "Export MCP",
                      desc: "Get a standardized MCP server link compatible with Claude, OpenAI, and more.",
                    },
                  ].map((step, i) => (
                    <div
                      key={i}
                      className={`group p-6 rounded-2xl cursor-pointer transition-all duration-300 border ${hoveredWorkflowStep === i ? "bg-white border-red-100 shadow-xl shadow-red-500/5 scale-102" : "bg-transparent border-transparent hover:bg-white/50"}`}
                      onMouseEnter={() => setHoveredWorkflowStep(i)}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${hoveredWorkflowStep === i ? "bg-red-600 text-white" : "bg-gray-200 text-gray-500"}`}
                        >
                          {i + 1}
                        </div>
                        <div>
                          <h4
                            className={`text-lg font-bold mb-2 transition-colors ${hoveredWorkflowStep === i ? "text-gray-900" : "text-gray-500"}`}
                          >
                            {step.title}
                          </h4>
                          <p className="text-gray-500 text-sm leading-relaxed">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative z-10">
        {/* Connector: Workflow -> CTA */}
        <div className="hidden lg:block absolute -top-[220px] left-0 right-0 h-[350px] w-full pointer-events-none z-0 overflow-visible">
          <svg
            className="w-full h-full overflow-visible"
            viewBox="0 0 1200 350"
            fill="none"
            preserveAspectRatio="none"
          >
            <defs>
              <marker
                id="arrowhead-cta"
                markerWidth="10"
                markerHeight="7"
                refX="5"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  fill="#ef4444"
                  className="opacity-60"
                />
              </marker>
            </defs>

            {/* Path: Left Column (Visual) -> Center (CTA) */}
            {/* Starts high (y=50) inside the -220px container, drops to 300 */}
            <path
              d="M 300 50 V 200 Q 300 220 320 220 H 580 Q 600 220 600 240 V 300"
              stroke="#ef4444"
              strokeWidth="3"
              strokeDasharray="12 12"
              className="opacity-40"
              markerEnd="url(#arrowhead-cta)"
            />

            {/* Animated Particle */}
            <circle r="5" fill="#ef4444" className="opacity-60">
              <animateMotion
                dur="4s"
                repeatCount="indefinite"
                path="M 300 50 V 200 Q 300 220 320 220 H 580 Q 600 220 600 240 V 300"
              />
            </circle>
          </svg>
        </div>
        <div className="max-w-5xl mx-auto text-center relative z-10 glass-card p-12 bg-gradient-to-br from-red-600 to-red-700 border-red-500/30">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight">
            Ready to automate?
          </h2>
          <p className="text-xl text-red-100 mb-10 max-w-2xl mx-auto font-medium">
            Join thousands of developers building the next generation of AI
            tools using the Model Context Protocol.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full sm:w-80 px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-red-200 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all font-medium backdrop-blur-md"
            />
            <button className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-red-600 font-bold hover:bg-red-50 hover:-translate-y-1 transition-all shadow-xl shadow-black/10">
              Get Early Access
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 px-6 bg-white/50 backdrop-blur-xl relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-red-50">
              <Layers className="w-4 h-4 text-red-600" />
            </div>
            <span className="font-bold text-gray-900">Petabytes</span>
          </div>
          <div className="text-sm text-gray-500 font-medium">
            © 2026 Petabytes Inc. All rights reserved.
          </div>
          <div className="flex gap-6 text-gray-500 font-medium">
            <a href="#" className="hover:text-red-600 transition-colors">
              Twitter
            </a>
            <a href="#" className="hover:text-red-600 transition-colors">
              GitHub
            </a>
            <a href="#" className="hover:text-red-600 transition-colors">
              Discord
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

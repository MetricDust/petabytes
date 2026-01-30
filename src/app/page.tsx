"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Play,
  Code,
  Server,
  Zap,
  ChevronRight,
  CheckCircle,
  Activity,
  Globe,
  Box,
  Terminal,
  Cpu,
  Layers,
} from "lucide-react";

export default function Home() {
  const [activeStep, setActiveStep] = useState(0);

  // Simulation loop for the workflow animation
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-gray-200 font-sans selection:bg-red-500/30 selection:text-white overflow-x-hidden">
      {/* Dynamic Background Mesh */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-900/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-gray-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[20%] w-[20%] h-[20%] bg-red-600/5 rounded-full blur-[80px]" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md border-b border-white/5 bg-black/20">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 bg-red-600 blur-md opacity-40 group-hover:opacity-60 transition-opacity" />
              <div className="relative bg-gradient-to-br from-neutral-800 to-black p-2 rounded-lg border border-white/10">
                <Layers className="w-6 h-6 text-red-500" />
              </div>
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400">
              Peta<span className="text-red-500">bytes</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#workflow" className="hover:text-white transition-colors">
              Workflow
            </a>
            <a href="#docs" className="hover:text-white transition-colors">
              Docs
            </a>
          </div>

          <button className="hidden md:flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 hover:bg-red-600/10 border border-white/10 hover:border-red-500/50 text-gray-300 hover:text-red-400 transition-all duration-300 shadow-lg shadow-black/50 backdrop-blur-sm group">
            <span>Get Started</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* Hero Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/30 border border-red-500/20 text-red-400 text-xs font-semibold tracking-wider uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              Now in Public Beta
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tighter">
              <span
                className="inline-block animate-fade-in"
                style={{ animationDelay: "0.1s" }}
              >
                Turn APIs into
              </span>
              <br />
              <span
                className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-400 to-gray-600 animate-shimmer inline-block"
                style={{ animationDelay: "0.3s" }}
              >
                MCP Servers
              </span>
              <span
                className="block text-red-600 drop-shadow-lg glow-red animate-soft-pulse mt-2 transition-all hover:scale-110 cursor-default"
                style={{ animationDelay: "0.6s" }}
              >
                Instantly.
              </span>
            </h1>

            <p className="text-lg text-gray-400 max-w-lg leading-relaxed">
              No boilerplate. No complex configurations. Just paste your HTTP
              URL, visualize the JSON, and build a production-ready MCP server
              in seconds.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="px-8 py-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold shadow-[0_0_30px_-5px_rgba(220,38,38,0.4)] hover:shadow-[0_0_40px_-5px_rgba(220,38,38,0.6)] transition-all duration-300 flex items-center justify-center gap-2">
                <Zap className="w-5 h-5 fill-current" />
                Start Building Free
              </button>
              <button className="px-8 py-4 rounded-xl bg-neutral-900/50 hover:bg-neutral-800 border border-white/10 text-gray-300 font-medium backdrop-blur-md transition-all flex items-center justify-center gap-2">
                <Play className="w-5 h-5" />
                Watch Demo
              </button>
            </div>
          </div>

          {/* Workflow Simulation (The "Video" Concept) */}
          <div className="relative">
            {/* Glass Container */}
            <div className="relative bg-neutral-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-2xl overflow-hidden min-h-[400px]">
              {/* Top Bar */}
              <div className="flex items-center gap-2 mb-8 border-b border-white/5 pb-4">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-gray-500/50" />
                  <div className="w-3 h-3 rounded-full bg-gray-500/50" />
                </div>
                <div className="ml-4 px-3 py-1 rounded bg-black/40 border border-white/5 text-xs text-gray-500 font-mono flex-1 text-center">
                  petabytes-studio — v2.4.0
                </div>
              </div>

              {/* Steps visualization */}
              <div className="relative flex flex-col gap-6">
                {/* Step 1: Input */}
                <div
                  className={`transition-all duration-700 ${activeStep === 0 ? "opacity-100 scale-100 translate-x-0" : "opacity-40 scale-95 translate-x-4 grayscale"}`}
                >
                  <div
                    className={`p-4 rounded-xl border ${activeStep === 0 ? "bg-black/60 border-red-500/50 shadow-[0_0_30px_-10px_rgba(220,38,38,0.2)]" : "bg-neutral-900/50 border-white/5"}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono text-gray-400">
                        HTTP Endpoint Source
                      </span>
                      {activeStep === 0 && (
                        <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                      )}
                    </div>
                    <div className="font-mono text-sm text-blue-400 truncate">
                      https://api.system.com/v1/users
                    </div>
                  </div>
                </div>

                {/* Connection Line */}
                <div className="h-8 w-0.5 bg-gray-800 mx-auto relative overflow-hidden">
                  <div
                    className={`absolute top-0 left-0 w-full h-full bg-red-500 transition-all duration-1000 ${activeStep > 0 ? "translate-y-0" : "-translate-y-full"}`}
                  />
                </div>

                {/* Step 2: JSON/Code */}
                <div
                  className={`transition-all duration-700 ${activeStep === 1 ? "opacity-100 scale-100" : "opacity-40 scale-95 grayscale"}`}
                >
                  <div
                    className={`p-4 rounded-xl border ${activeStep === 1 ? "bg-black/60 border-gray-400 shadow-[0_0_30px_-10px_rgba(255,255,255,0.1)]" : "bg-neutral-900/50 border-white/5"}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Code className="w-4 h-4 text-gray-400" />
                      <span className="text-xs font-mono text-gray-400">
                        Schema Resolution
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div
                        className="h-2 w-3/4 bg-gray-700 rounded-full animate-pulse"
                        style={{ animationDelay: "0ms" }}
                      />
                      <div
                        className="h-2 w-1/2 bg-gray-800 rounded-full animate-pulse"
                        style={{ animationDelay: "100ms" }}
                      />
                      <div
                        className="h-2 w-2/3 bg-gray-700 rounded-full animate-pulse"
                        style={{ animationDelay: "200ms" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Connection Line */}
                <div className="h-8 w-0.5 bg-gray-800 mx-auto relative overflow-hidden">
                  <div
                    className={`absolute top-0 left-0 w-full h-full bg-red-500 transition-all duration-1000 ${activeStep > 1 ? "translate-y-0" : "-translate-y-full"}`}
                  />
                </div>

                {/* Step 3: MCP Engine */}
                <div
                  className={`transition-all duration-700 ${activeStep >= 2 ? "opacity-100 scale-100" : "opacity-40 scale-95 grayscale"}`}
                >
                  <div
                    className={`relative p-5 rounded-xl border overflow-hidden ${activeStep === 2 ? "bg-gradient-to-br from-red-950/50 to-black border-red-500 shadow-[0_0_50px_-10px_rgba(220,38,38,0.3)]" : activeStep === 3 ? "bg-black border-green-500/50" : "bg-neutral-900/50 border-white/5"}`}
                  >
                    {activeStep === 2 && (
                      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                    )}

                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${activeStep === 3 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
                        >
                          {activeStep === 3 ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <Cpu
                              className={`w-5 h-5 ${activeStep === 2 ? "animate-spin-slow" : ""}`}
                            />
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-200">
                            {activeStep === 3
                              ? "Build Complete"
                              : "MCP Converter"}
                          </div>
                          <div className="text-xs text-gray-500 font-mono">
                            {activeStep === 2
                              ? "Compiling context..."
                              : activeStep === 3
                                ? "Server Ready"
                                : "Waiting for input..."}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Background Glows for container */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-b from-transparent via-red-900/5 to-transparent rotate-45 pointer-events-none" />
            </div>

            {/* Decorative elements behind container */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-silver-400/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-red-600/10 rounded-full blur-3xl" />
          </div>
        </div>
      </section>

      {/* Stats / Trust Bar */}
      <section className="py-10 border-y border-white/5 bg-black/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Latency", value: "< 15ms" },
            { label: "Uptime", value: "99.99%" },
            { label: "Integrations", value: "150+" },
            { label: "Active Builds", value: "2.4M" },
          ].map((stat, i) => (
            <div key={i} className="text-center md:text-left">
              <div className="text-2xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 flex items-center gap-3">
                Designed for <span className="text-gray-500">Speed</span>
                <Zap className="w-8 h-8 text-red-500 fill-red-500/20" />
              </h2>
              <p className="text-gray-400 max-w-xl text-lg">
                Our engine parses your API structure and generates a fully
                compliant Model Context Protocol server in real-time.
              </p>
            </div>
            <div className="relative w-32 h-32 md:w-48 md:h-48 flex-shrink-0 flex items-center justify-center">
              <div className="absolute inset-0 bg-red-500/20 blur-[40px] rounded-full animate-pulse" />
              <Image
                src="../../public/lightning.gif"
                alt="Lightning Speed"
                width={192}
                height={192}
                className="relative z-10 w-full h-full object-contain"
                unoptimized
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="group relative p-8 rounded-2xl bg-neutral-900/20 border border-white/5 hover:border-red-500/30 transition-all duration-500 hover:bg-neutral-900/40 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-lg bg-neutral-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-white/5">
                  <Globe className="w-6 h-6 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-100 mb-3">
                  HTTP to MCP
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Directly ingest REST, GraphQL, or SOAP endpoints. We handle
                  the schema mapping automatically.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative p-8 rounded-2xl bg-neutral-900/20 border border-white/5 hover:border-red-500/30 transition-all duration-500 hover:bg-neutral-900/40 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-silver-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-lg bg-neutral-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-white/5">
                  <Terminal className="w-6 h-6 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-100 mb-3">
                  Live Testing Console
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Debug your MCP tools in real-time before deploying. See
                  exactly what the LLM sees.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative p-8 rounded-2xl bg-neutral-900/20 border border-white/5 hover:border-red-500/30 transition-all duration-500 hover:bg-neutral-900/40 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-lg bg-neutral-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-white/5">
                  <Box className="w-6 h-6 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-100 mb-3">
                  One-Click Deploy
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Push to our edge network or export as a Docker container. Your
                  infrastructure, your choice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Steps / Process Section */}
      <section
        id="workflow"
        className="py-32 px-6 relative bg-neutral-900/20 border-t border-white/5"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            {/* Text Content */}
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-8">
                From URL to <br />
                <span className="text-red-500">Agent Capability</span>
              </h2>

              <div className="space-y-8">
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
                  <div key={i} className="flex gap-6 group">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full border border-white/10 bg-black flex items-center justify-center text-lg font-bold text-gray-500 group-hover:border-red-500 group-hover:text-red-500 transition-all">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-200 mb-2 group-hover:text-white transition-colors">
                        {step.title}
                      </h4>
                      <p className="text-gray-500 group-hover:text-gray-400 transition-colors">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual representation */}
            <div className="relative aspect-square">
              <div className="absolute inset-0 bg-gradient-to-tr from-red-500/20 to-gray-500/20 rounded-full blur-[100px]" />
              <div className="relative h-full w-full rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl p-8 flex flex-col justify-between shadow-2xl">
                {/* Mock UI for "Nodes" */}
                <div className="flex justify-between items-center opacity-50">
                  <div className="w-24 h-8 rounded bg-gray-800/50" />
                  <div className="w-8 h-8 rounded-full bg-gray-800/50" />
                </div>

                <div className="flex flex-col gap-4 my-auto">
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-neutral-900 border border-red-500/20">
                    <div className="w-8 h-8 rounded bg-red-900/20 flex items-center justify-center">
                      <Activity className="w-4 h-4 text-red-500" />
                    </div>
                    <div className="flex-1">
                      <div className="h-2 w-20 bg-gray-700 rounded mb-2" />
                      <div className="h-2 w-32 bg-gray-800 rounded" />
                    </div>
                  </div>

                  <div className="h-8 w-0.5 bg-gradient-to-b from-red-500/50 to-transparent mx-auto" />

                  <div className="flex items-center gap-4 p-4 rounded-lg bg-neutral-900 border border-white/5">
                    <div className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center">
                      <Server className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <div className="h-2 w-24 bg-gray-700 rounded mb-2" />
                      <div className="h-2 w-28 bg-gray-800 rounded" />
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-8 border-t border-white/5 flex justify-between items-center">
                  <div className="text-xs text-gray-500 font-mono">
                    Status: Connected
                  </div>
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-red-900/5" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold mb-8">
            Ready to automate?
          </h2>
          <p className="text-xl text-gray-400 mb-10">
            Join thousands of developers building the next generation of AI
            tools.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full sm:w-80 px-6 py-4 rounded-xl bg-black/50 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-red-500/50 transition-colors"
            />
            <button className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-colors">
              Get Early Access
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-neutral-800 to-black p-1.5 rounded-md border border-white/10">
              <Layers className="w-4 h-4 text-red-500" />
            </div>
            <span className="font-bold text-gray-400">Petabytes</span>
          </div>
          <div className="text-sm text-gray-600">
            © 2024 Petabytes Inc. All rights reserved.
          </div>
          <div className="flex gap-6 text-gray-500">
            <a href="#" className="hover:text-white transition-colors">
              Twitter
            </a>
            <a href="#" className="hover:text-white transition-colors">
              GitHub
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Discord
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

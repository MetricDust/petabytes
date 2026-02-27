"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import BlackHoleGlobe from "./BlackHoleGlobe";

export default function HeroSection() {
  return (
    <section className="relative w-full h-screen overflow-hidden text-white font-sans">
      {/* Background Image */}
      <Image
        src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/assets/images/bg_1.png`}
        alt="Hero Background"
        fill
        className="object-cover object-center z-0"
        priority
      />

      {/* 3D Black Hole Container - Interactive & Shifted up */}
      <div className="absolute inset-0 z-10 pointer-events-auto transform -translate-y-16 lg:-translate-y-24">
        <BlackHoleGlobe />
      </div>

      {/* --- UI OVERLAY --- */}
      <div className="absolute inset-0 z-20 flex flex-col justify-between p-6 md:p-12 pointer-events-none">
        {/* Header */}
        <header className="flex items-center justify-between w-full pointer-events-auto">
          <Link
            href="/"
            className="text-xl font-semibold tracking-widest uppercase cursor-pointer"
          >
            PETABYTES
          </Link>

          {/* <nav className="hidden md:flex items-center space-x-8 text-sm text-gray-300 font-medium">
            <a href="#" className="hover:text-white transition-colors">
              Explore
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Contact
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Docs
            </a>
          </nav> */}

          <Link href="/contact" className="relative group inline-block">
            {/* Shooting Border Beam */}
            <div className="absolute -inset-[1.5px] rounded-full overflow-hidden">
              <div
                className="absolute inset-[-1000%] animate-spin bg-[conic-gradient(from_90deg_at_50%_50%,#00d2ff_0deg,transparent_40deg,transparent_320deg,#00d2ff_360deg)]"
                style={{ animationDuration: "3s" }}
              />
            </div>
            {/* Button Surface */}
            <button className="relative px-5 py-2 text-xs font-semibold tracking-wider uppercase bg-black/80 backdrop-blur-sm rounded-full transition-all group-hover:bg-white group-hover:text-black">
              Contact
            </button>
            {/* Outer Glow - subtle when idle, strong on hover */}
            <div className="absolute -inset-[2px] rounded-full bg-cyan-500/10 blur-md group-hover:bg-cyan-500/40 transition-all duration-500" />
          </Link>
        </header>

        {/* Floating AI Pipeline Layers around the Globe (Box Layout) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none transform -translate-y-16 lg:-translate-y-24 z-20">
          {/* Top: Agent Layer */}
          <div className="absolute transform transition-transform duration-500 ease-out -translate-y-[100px] sm:-translate-y-[130px] md:-translate-y-[170px] lg:-translate-y-[210px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{
                opacity: [0, 1, 1, 0, 0],
                scale: [0.9, 1, 1, 0.95, 0.95],
                y: [15, 0, 0, -10, -10],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                times: [0, 0.1, 0.8, 0.9, 1],
                ease: "easeInOut",
              }}
              className="text-center flex flex-col items-center border border-white/10 rounded-2xl px-3 py-2 sm:px-5 sm:py-3 bg-black/40 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_0_15px_rgba(255,255,255,0.2)]"
            >
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white mb-1.5 sm:mb-2 shadow-[0_0_15px_rgba(255,255,255,1)]"></span>
              <p className="text-[11px] sm:text-sm md:text-base font-bold tracking-wide text-white whitespace-nowrap">
                Agent Layer
              </p>
              <p className="text-[8px] sm:text-[10px] md:text-xs text-cyan-200/90 mt-0.5 sm:mt-1 uppercase tracking-wider font-medium">
                Haystack + ReAct
              </p>
            </motion.div>
          </div>

          {/* Left: Cache Layer */}
          <div className="absolute transform transition-transform duration-500 ease-out -translate-x-[100px] sm:-translate-x-[145px] md:-translate-x-[200px] lg:-translate-x-[270px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{
                opacity: [0, 1, 1, 0, 0],
                scale: [0.9, 1, 1, 0.95, 0.95],
                y: [15, 0, 0, -10, -10],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                times: [0, 0.1, 0.8, 0.9, 1],
                ease: "easeInOut",
                delay: 0.2,
              }}
              className="text-center flex flex-col items-center border border-white/10 rounded-2xl px-3 py-2 sm:px-5 sm:py-3 bg-black/40 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_0_15px_rgba(255,255,255,0.2)]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mb-1.5 sm:mb-2 shadow-[0_0_10px_rgba(34,211,238,0.8)]"></span>
              <p className="text-[10px] sm:text-sm md:text-base font-medium tracking-wide text-white whitespace-nowrap">
                Cache Layer
              </p>
              <p className="text-[7px] sm:text-[10px] md:text-xs text-blue-200/70 mt-0.5 sm:mt-1 uppercase tracking-wider">
                LRU Cache + TTL
              </p>
            </motion.div>
          </div>

          {/* Right: Response Layer */}
          <div className="absolute transform transition-transform duration-500 ease-out translate-x-[100px] sm:translate-x-[145px] md:translate-x-[200px] lg:translate-x-[270px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{
                opacity: [0, 1, 1, 0, 0],
                scale: [0.9, 1, 1, 0.95, 0.95],
                y: [15, 0, 0, -10, -10],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                times: [0, 0.1, 0.8, 0.9, 1],
                ease: "easeInOut",
                delay: 0.4,
              }}
              className="text-center flex flex-col items-center border border-white/10 rounded-2xl px-3 py-2 sm:px-5 sm:py-3 bg-black/40 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_0_15px_rgba(255,255,255,0.2)]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mb-1.5 sm:mb-2 shadow-[0_0_10px_rgba(34,211,238,0.8)]"></span>
              <p className="text-[10px] sm:text-sm md:text-base font-medium tracking-wide text-white whitespace-nowrap">
                Response Layer
              </p>
              <p className="text-[7px] sm:text-[10px] md:text-xs text-blue-200/70 mt-0.5 sm:mt-1 uppercase tracking-wider">
                Natural Language
              </p>
            </motion.div>
          </div>

          {/* Bottom Left: Filter Layer */}
          <div className="absolute transform transition-transform duration-500 ease-out -translate-x-[70px] translate-y-[80px] sm:-translate-x-[100px] sm:translate-y-[105px] md:-translate-x-[140px] md:translate-y-[140px] lg:-translate-x-[185px] lg:translate-y-[170px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{
                opacity: [0, 1, 1, 0, 0],
                scale: [0.9, 1, 1, 0.95, 0.95],
                y: [15, 0, 0, -10, -10],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                times: [0, 0.1, 0.8, 0.9, 1],
                ease: "easeInOut",
                delay: 0.6,
              }}
              className="text-center flex flex-col items-center border border-white/10 rounded-2xl px-3 py-2 sm:px-5 sm:py-3 bg-black/40 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_0_15px_rgba(255,255,255,0.2)]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mb-1.5 sm:mb-2 shadow-[0_0_10px_rgba(96,165,250,0.8)]"></span>
              <p className="text-[10px] sm:text-sm md:text-base font-medium tracking-wide text-white whitespace-nowrap">
                Filter Layer
              </p>
              <p className="text-[7px] sm:text-[10px] md:text-xs text-blue-200/70 mt-0.5 sm:mt-1 uppercase tracking-wider">
                Semantic E5 Filter
              </p>
            </motion.div>
          </div>

          {/* Bottom Right: Validation Layer */}
          <div className="absolute transform transition-transform duration-500 ease-out translate-x-[70px] translate-y-[80px] sm:translate-x-[100px] sm:translate-y-[105px] md:translate-x-[140px] md:translate-y-[140px] lg:translate-x-[185px] lg:translate-y-[170px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{
                opacity: [0, 1, 1, 0, 0],
                scale: [0.9, 1, 1, 0.95, 0.95],
                y: [15, 0, 0, -10, -10],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                times: [0, 0.1, 0.8, 0.9, 1],
                ease: "easeInOut",
                delay: 0.8,
              }}
              className="text-center flex flex-col items-center border border-white/10 rounded-2xl px-3 py-2 sm:px-5 sm:py-3 bg-black/40 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_0_15px_rgba(255,255,255,0.2)]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mb-1.5 sm:mb-2 shadow-[0_0_10px_rgba(96,165,250,0.8)]"></span>
              <p className="text-[10px] sm:text-sm md:text-base font-medium tracking-wide text-white whitespace-nowrap">
                Validation Layer
              </p>
              <p className="text-[7px] sm:text-[10px] md:text-xs text-blue-200/70 mt-0.5 sm:mt-1 uppercase tracking-wider">
                Parameter Validation
              </p>
            </motion.div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-end justify-between w-full pointer-events-auto pb-8">
          <div className="max-w-2xl mb-8 md:mb-0">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
              ONE HUB <br />
              <span className="ml-25">TOTAL CONTROL</span>
            </h1>
          </div>

          <div className="max-w-md flex flex-col items-start md:items-start text-left md:text-left">
            <p className="text-sm md:text-base text-gray-300 leading-relaxed mb-6">
              Supercharge your workflow with a 5-layer AI pipeline.
              <br />
              Featuring MCP integration and semantic tool filtering.
            </p>
            <button
              onClick={() => (window.location.href = "/contact")}
              className="px-8 py-3 text-sm font-bold text-black bg-white rounded-full hover:bg-gray-200 transition-colors"
            >
              JOIN WAITING LIST
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

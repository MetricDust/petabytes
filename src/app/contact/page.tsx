"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MessageSquare,
  Send,
  ArrowLeft,
} from "lucide-react";
import BlackHoleGlobe from "../components/BlackHoleGlobe";

export default function ContactPage() {
  return (
    <main className="relative w-full min-h-[100dvh] lg:h-[100dvh] text-white font-sans flex flex-col overflow-y-auto lg:overflow-hidden">
      {/* Header */}
      <header className="relative z-30 flex items-center justify-between w-full p-4 md:px-12 md:py-6">
        <Link
          href="/"
          className="text-xl font-semibold tracking-widest uppercase cursor-pointer hover:opacity-80 transition-opacity"
        >
          PETABYTES
        </Link>
        <Link href="/" className="relative group inline-block">
          {/* Shooting Border Beam */}
          <div className="absolute -inset-[1.5px] rounded-full overflow-hidden">
            <div
              className="absolute inset-[-1000%] animate-spin bg-[conic-gradient(from_90deg_at_50%_50%,#00d2ff_0deg,transparent_40deg,transparent_320deg,#00d2ff_360deg)]"
              style={{ animationDuration: "3s" }}
            />
          </div>
          {/* Button Surface */}
          <button className="relative flex items-center gap-2 px-5 py-2 text-xs font-semibold tracking-wider uppercase bg-black/80 backdrop-blur-sm rounded-full transition-all group-hover:bg-white group-hover:text-black">
            <ArrowLeft size={14} /> Back
          </button>
          {/* Outer Glow - subtle when idle, strong on hover */}
          <div className="absolute -inset-[2px] rounded-full bg-cyan-500/10 blur-md group-hover:bg-cyan-500/40 transition-all duration-500" />
        </Link>
      </header>

      {/* Main Content Container */}
      <div className="relative z-20 flex-1 flex flex-col lg:flex-row w-full max-w-7xl mx-auto px-6 md:px-12 gap-8 lg:gap-12 items-center justify-center py-6 lg:py-0">
        {/* Left Side: Globe */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative w-full lg:w-1/2 flex items-center justify-center h-[400px] lg:h-full pointer-events-auto overflow-visible"
        >
          {/* A larger absolute container to let the canvas render much bigger than its layout space */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] lg:w-[800px] lg:h-[800px] z-10 scale-[0.65] lg:scale-[0.85]">
            <BlackHoleGlobe cameraDistance={35} />
          </div>
          {/* Decorative elements behind globe */}
          <div className="absolute w-[100%] h-[100%] bg-blue-500/10 rounded-full blur-[120px] -z-10" />
        </motion.div>

        {/* Right Side: Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="relative z-10 w-full flex justify-center lg:justify-end"
        >
          <div className="w-full max-w-xl bg-black/50 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-6 md:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.6),inset_0_0_20px_rgba(255,255,255,0.05)]">
            <div className="mb-6 text-left">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
                Initialize Connection
              </h2>
              <p className="text-cyan-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] opacity-80">
                Join the Waiting List
              </p>
            </div>

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold ml-1">
                    Full Name
                  </label>
                  <div className="relative group">
                    <User
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors"
                      size={18}
                    />
                    <input
                      type="text"
                      placeholder="Enter your name"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all font-light text-sm placeholder:text-gray-600"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold ml-1">
                    Phone Number
                  </label>
                  <div className="relative group">
                    <Phone
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors"
                      size={18}
                    />
                    <input
                      type="tel"
                      placeholder="+1 (000) 000-0000"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all font-light text-sm placeholder:text-gray-600"
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors"
                    size={18}
                  />
                  <input
                    type="email"
                    placeholder="name@company.com"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all font-light text-sm placeholder:text-gray-600"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold ml-1">
                  Project Details
                </label>
                <div className="relative group">
                  <MessageSquare
                    className="absolute left-4 top-5 text-gray-500 group-focus-within:text-cyan-400 transition-colors"
                    size={18}
                  />
                  <textarea
                    rows={3}
                    placeholder="How can Petabytes help your workflow?"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all font-light text-sm resize-none placeholder:text-gray-600"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: "#f3f4f6" }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-white text-black font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all mt-4 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                JOIN WAITING LIST <Send size={16} />
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

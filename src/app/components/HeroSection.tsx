import Image from "next/image";
import Link from "next/link";
import BlackHoleGlobe from "./BlackHoleGlobe";

export default function HeroSection() {
  return (
    <section className="relative w-full h-screen overflow-hidden text-white font-sans">
      {/* Background Image */}
      <Image
        src="/assets/images/bg_1.png"
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

          <Link href="/contact">
            <button className="px-5 py-2 text-xs font-semibold tracking-wider uppercase border border-white/40 rounded-full hover:bg-white hover:text-black transition-all">
              Contact
            </button>
          </Link>
        </header>

        {/* Floating AI Pipeline Layers around the Globe (Box Layout) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none transform -translate-y-16 lg:-translate-y-24">
          {/* Top: Agent Layer */}
          <div className="absolute transform -translate-y-[180px] md:-translate-y-[280px] text-center flex flex-col items-center border border-white/10 rounded-2xl px-6 py-3 bg-black/30 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_0_15px_rgba(255,255,255,0.2)]">
            <span className="w-2 h-2 rounded-full bg-white mb-2 shadow-[0_0_15px_rgba(255,255,255,1)]"></span>
            <p className="text-base md:text-lg font-bold tracking-wide text-white whitespace-nowrap">
              Agent Layer
            </p>
            <p className="text-[10px] md:text-xs text-cyan-200/90 mt-1 uppercase tracking-wider font-medium">
              Haystack + ReAct
            </p>
          </div>

          {/* Left: Cache Layer */}
          <div className="absolute transform -translate-x-[160px] md:-translate-x-[380px] text-center flex flex-col items-center border border-white/10 rounded-2xl px-5 py-3 bg-black/30 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_0_15px_rgba(255,255,255,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mb-2 shadow-[0_0_10px_rgba(34,211,238,0.8)]"></span>
            <p className="text-sm md:text-base font-medium tracking-wide text-white whitespace-nowrap">
              Cache Layer
            </p>
            <p className="text-[10px] md:text-xs text-blue-200/70 mt-1 uppercase tracking-wider">
              LRU Cache + TTL
            </p>
          </div>

          {/* Right: Response Layer */}
          <div className="absolute transform translate-x-[160px] md:translate-x-[380px] text-center flex flex-col items-center border border-white/10 rounded-2xl px-5 py-3 bg-black/30 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_0_15px_rgba(255,255,255,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mb-2 shadow-[0_0_10px_rgba(34,211,238,0.8)]"></span>
            <p className="text-sm md:text-base font-medium tracking-wide text-white whitespace-nowrap">
              Response Layer
            </p>
            <p className="text-[10px] md:text-xs text-blue-200/70 mt-1 uppercase tracking-wider">
              Natural Language
            </p>
          </div>

          {/* Bottom Left: Filter Layer */}
          <div className="mt-50 absolute transform -translate-x-[120px] md:-translate-x-[220px] translate-y-[140px] md:translate-y-[200px] text-center flex flex-col items-center border border-white/10 rounded-2xl px-5 py-3 bg-black/30 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_0_15px_rgba(255,255,255,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mb-2 shadow-[0_0_10px_rgba(96,165,250,0.8)]"></span>
            <p className="text-sm md:text-base font-medium tracking-wide text-white whitespace-nowrap">
              Filter Layer
            </p>
            <p className="text-[10px] md:text-xs text-blue-200/70 mt-1 uppercase tracking-wider">
              Semantic E5 Filter
            </p>
          </div>

          {/* Bottom Right: Validation Layer */}
          <div className="mt-50 absolute transform translate-x-[120px] md:translate-x-[220px] translate-y-[140px] md:translate-y-[200px] text-center flex flex-col items-center border border-white/10 rounded-2xl px-5 py-3 bg-black/30 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_0_15px_rgba(255,255,255,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mb-2 shadow-[0_0_10px_rgba(96,165,250,0.8)]"></span>
            <p className="text-sm md:text-base font-medium tracking-wide text-white whitespace-nowrap">
              Validation Layer
            </p>
            <p className="text-[10px] md:text-xs text-blue-200/70 mt-1 uppercase tracking-wider">
              Parameter Validation
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-end justify-between w-full pointer-events-auto pb-8">
          <div className="max-w-2xl mb-8 md:mb-0">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
              ONE HUB <br />
              TOTAL CONTROL
            </h1>
          </div>

          <div className="max-w-md flex flex-col items-start md:items-start text-left md:text-left">
            <p className="text-sm md:text-base text-gray-300 leading-relaxed mb-6">
              Supercharge your workflow with a 5-layer AI pipeline.
              <br />
              Featuring MCP integration and semantic tool filtering.
            </p>
            <button className="px-8 py-3 text-sm font-bold text-black bg-white rounded-full hover:bg-gray-200 transition-colors">
              JOIN WAITING LIST
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

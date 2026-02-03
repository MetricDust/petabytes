import React from "react";
import { Layers } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-white px-10 pb-0 text-center relative z-20 overflow-hidden">
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
  );
};

export default Footer;

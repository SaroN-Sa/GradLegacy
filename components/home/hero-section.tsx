"use client";

import { useRef } from "react";
import { ArrowRight, PlayCircle, GraduationCap, Sparkles, Heart } from "lucide-react";

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.setProperty("--mx", `${x * 24}px`);
    el.style.setProperty("--my", `${y * 24}px`);
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden px-6 text-center"
    >
      {/* Ambient glow orbs */}
      <div className="pointer-events-none absolute -top-20 left-1/4 h-96 w-96 rounded-full bg-[#FFD700]/10 blur-[120px] animate-glow-pulse" />
      <div
        className="pointer-events-none absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-blue-500/10 blur-[120px] animate-glow-pulse"
        style={{ animationDelay: "1.5s" }}
      />

      {/* Floating decorative icons — react to cursor */}
      <div className="pointer-events-none absolute inset-0 hidden md:block">
        <div
          className="absolute left-[12%] top-[22%] animate-float transition-transform duration-300 ease-out"
          style={{ animationDelay: "0s", transform: "translate3d(calc(var(--mx, 0px) * -1), calc(var(--my, 0px) * -1), 0)" }}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-[#FFD700]/30 shadow-xl shadow-black/40 backdrop-blur-sm">
            <GraduationCap size={22} className="text-[#FFD700]" />
          </div>
        </div>
        <div
          className="absolute right-[14%] top-[30%] animate-float transition-transform duration-300 ease-out"
          style={{ animationDelay: "1.2s", transform: "translate3d(var(--mx, 0px), var(--my, 0px), 0)" }}
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-slate-900 to-slate-950 border border-blue-400/30 shadow-xl shadow-black/40 backdrop-blur-sm">
            <Sparkles size={16} className="text-blue-300" />
          </div>
        </div>
        <div
          className="absolute right-[20%] bottom-[18%] animate-float-slow transition-transform duration-300 ease-out"
          style={{ animationDelay: "0.6s", transform: "translate3d(calc(var(--mx, 0px) * 0.6), calc(var(--my, 0px) * -0.6), 0)" }}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-rose-400/30 shadow-xl shadow-black/40 backdrop-blur-sm">
            <Heart size={18} className="text-rose-300" />
          </div>
        </div>
      </div>

      {/* Eyebrow badge */}
      <span className="relative mb-6 inline-flex items-center gap-2 rounded-full border border-[#FFD700]/30 bg-[#FFD700]/10 px-4 py-2 text-sm font-medium text-[#FFD700] backdrop-blur-sm animate-float-slow">
        <Sparkles size={14} />
        Graduation Memory Platform
      </span>

      <h1 className="relative mb-6 max-w-4xl text-5xl font-bold text-white md:text-7xl">
        Preserve Your{" "}
        <span className="bg-[length:200%_auto] bg-gradient-to-r from-[#FFD700] via-yellow-200 via-50% to-[#FFD700] bg-clip-text text-transparent animate-[shimmer_4s_linear_infinite]">
          Graduation Legacy
        </span>{" "}
        Forever
      </h1>

      <p className="relative mb-10 max-w-2xl text-lg text-slate-400">
        Create a beautiful graduation page where family, friends, teachers and mentors
        can leave wishes, photos, videos and memories.
      </p>

      <div className="relative flex flex-wrap items-center justify-center gap-4">
        <button className="group relative inline-flex items-center gap-2 overflow-hidden rounded-3xl bg-gradient-to-r from-slate-800 to-slate-900 border border-[#FFD700]/50 px-7 py-3.5 text-sm font-semibold text-[#FFD700] shadow-lg shadow-black/30 transition-all hover:border-[#FFD700] hover:scale-[1.03] hover:shadow-xl">
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#FFD700]/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          <span className="relative">Create Your Page</span>
          <ArrowRight size={16} className="relative transition-transform group-hover:translate-x-0.5" />
        </button>

        <button className="group inline-flex items-center gap-2 rounded-3xl border border-slate-700 bg-slate-900/40 px-7 py-3.5 text-sm font-semibold text-slate-300 backdrop-blur-sm transition-all hover:border-slate-600 hover:scale-[1.03]">
          <PlayCircle size={16} className="transition-transform group-hover:scale-110" />
          View Demo
        </button>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float-slow opacity-60">
        <div className="flex h-9 w-5 items-start justify-center rounded-full border-2 border-slate-600 p-1">
          <span className="h-1.5 w-1.5 rounded-full bg-[#FFD700]" />
        </div>
      </div>
    </section>
  );
}
import { ArrowRight, PlayCircle, GraduationCap, Sparkles, Heart } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden px-6 text-center">
      {/* Ambient glow orbs */}
      <div className="pointer-events-none absolute -top-20 left-1/4 h-96 w-96 rounded-full bg-[#FFD700]/10 blur-[120px] animate-glow-pulse" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-blue-500/10 blur-[120px] animate-glow-pulse" style={{ animationDelay: "1.5s" }} />

      {/* Floating decorative icons */}
      <div className="pointer-events-none absolute inset-0 hidden md:block">
        <div className="absolute left-[12%] top-[22%] animate-float" style={{ animationDelay: "0s" }}>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-[#FFD700]/30 shadow-xl shadow-black/40 backdrop-blur-sm">
            <GraduationCap size={22} className="text-[#FFD700]" />
          </div>
        </div>
        <div className="absolute right-[14%] top-[30%] animate-float" style={{ animationDelay: "1.2s" }}>
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-slate-900 to-slate-950 border border-blue-400/30 shadow-xl shadow-black/40 backdrop-blur-sm">
            <Sparkles size={16} className="text-blue-300" />
          </div>
        </div>
        <div className="absolute right-[20%] bottom-[18%] animate-float-slow" style={{ animationDelay: "0.6s" }}>
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
        <span className="bg-gradient-to-r from-[#FFD700] via-yellow-300 to-[#FFD700] bg-clip-text text-transparent">
          Graduation Legacy
        </span>{" "}
        Forever
      </h1>

      <p className="relative mb-10 max-w-2xl text-lg text-slate-400">
        Create a beautiful graduation page where family, friends, teachers and mentors
        can leave wishes, photos, videos and memories.
      </p>

      <div className="relative flex flex-wrap items-center justify-center gap-4">
        <button className="group inline-flex items-center gap-2 rounded-3xl bg-gradient-to-r from-slate-800 to-slate-900 border border-[#FFD700]/50 px-7 py-3.5 text-sm font-semibold text-[#FFD700] shadow-lg shadow-black/30 transition-all hover:border-[#FFD700] hover:scale-[1.03] hover:shadow-xl">
          Create Your Page
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
        </button>

        <button className="group inline-flex items-center gap-2 rounded-3xl border border-slate-700 bg-slate-900/40 px-7 py-3.5 text-sm font-semibold text-slate-300 backdrop-blur-sm transition-all hover:border-slate-600 hover:scale-[1.03]">
          <PlayCircle size={16} className="transition-transform group-hover:scale-110" />
          View Demo
        </button>
      </div>
    </section>
  );
}
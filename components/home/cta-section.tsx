import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section
      id="cta"
      className="relative mx-auto max-w-5xl px-6 py-24 text-center"
    >
      <div className="absolute inset-0 -z-10 flex justify-center">
        <div className="h-72 w-72 rounded-full bg-[#FFD700]/10 blur-[110px]" />
      </div>

      <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#FFD700]">
        Start Today
      </div>

      <h2 className="mb-6 text-4xl font-bold text-white sm:text-5xl">
        Ready to Preserve Your Memories?
      </h2>

      <p className="mb-8 text-lg text-slate-400">
        Create your graduation page and start collecting wishes today.
      </p>

      <button className="group inline-flex items-center gap-2 rounded-3xl bg-gradient-to-r from-slate-800 to-slate-900 border border-[#FFD700]/50 px-8 py-4 text-sm font-semibold text-[#FFD700] transition-all hover:border-[#FFD700] hover:scale-[1.02]">
        Get Started
        <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
      </button>
    </section>
  );
}
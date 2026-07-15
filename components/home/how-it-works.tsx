import { UserPlus, Share2, MessageSquareHeart, Sparkles, ArrowRight } from "lucide-react";

const steps = [
  { title: "Create Your Profile", icon: UserPlus },
  { title: "Share Your Link", icon: Share2 },
  { title: "Collect Wishes", icon: MessageSquareHeart },
  { title: "Preserve Memories Forever", icon: Sparkles },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative mx-auto max-w-6xl px-6 py-24"
    >
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FFD700]/5 blur-[130px]" />

      <div className="mb-4 flex justify-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#FFD700]">
          Simple Process
        </span>
      </div>

      <h2 className="mb-16 text-center text-4xl font-bold text-white">
        How It Works
      </h2>

      <div className="relative grid gap-8 md:grid-cols-4">
        {/* Connecting line, desktop only */}
        <div className="pointer-events-none absolute left-0 right-0 top-[52px] hidden h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent md:block" />

        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div
              key={step.title}
              className="perspective-1000 animate-float"
              style={{ animationDelay: `${index * 0.3}s`, animationDuration: "7s" }}
            >
              <div className="group preserve-3d relative rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-8 text-center shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-2 hover:border-[#FFD700]/40 hover:shadow-2xl hover:shadow-black/40 hover:[transform:rotateX(4deg)_rotateY(-4deg)]">
                <div className="relative mx-auto mb-5 flex h-14 w-14 items-center justify-center">
                  <div className="absolute inset-0 rounded-2xl bg-[#FFD700]/10 transition-transform duration-300 group-hover:scale-110" />
                  <span className="relative text-2xl font-bold text-[#FFD700]">
                    {index + 1}
                  </span>
                </div>

                <div className="mx-auto mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-slate-800/60 text-slate-400 transition-colors group-hover:text-[#FFD700]">
                  <Icon size={16} />
                </div>

                <h3 className="text-sm font-semibold text-white">
                  {step.title}
                </h3>

                {index < steps.length - 1 && (
                  <ArrowRight
                    size={16}
                    className="absolute -right-4 top-1/2 hidden -translate-y-1/2 text-slate-700 md:block"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
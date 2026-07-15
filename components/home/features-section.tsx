import {
  Camera,
  Video,
  Mic,
  Globe,
  BookOpen,
  Clock3,
} from "lucide-react";

const features = [
  {
    title: "Photo Memories",
    description: "Upload and organize photos from every chapter of your journey.",
    icon: Camera,
  },
  {
    title: "Video Wishes",
    description: "Let friends and family leave heartfelt video messages.",
    icon: Video,
  },
  {
    title: "Voice Messages",
    description: "Capture the warmth of a spoken congratulations.",
    icon: Mic,
  },
  {
    title: "Time Capsule",
    description: "Lock away messages to be revealed on a future date.",
    icon: Clock3,
  },
  {
    title: "Memory Book",
    description: "Compile your favorite moments into a shareable keepsake.",
    icon: BookOpen,
  },
  {
    title: "Multi Language",
    description: "Collect wishes from anyone, in any language.",
    icon: Globe,
  },
];

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="mx-auto max-w-7xl px-6 py-24"
    >
      <div className="mb-4 flex justify-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#FFD700]">
          Features
        </span>
      </div>

      <h2 className="mb-12 text-center text-3xl font-bold text-white sm:text-4xl">
        Everything you need to preserve this chapter
      </h2>

      <div className="grid gap-6 md:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <div
              key={feature.title}
              className="group rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-8 transition-all duration-200 hover:-translate-y-1 hover:border-slate-700 hover:shadow-xl hover:shadow-black/20"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFD700]/10 transition-colors group-hover:bg-[#FFD700]/20">
                <Icon className="h-6 w-6 text-[#FFD700]" />
              </div>

              <h3 className="mb-2 text-xl font-semibold text-white">
                {feature.title}
              </h3>

              <p className="text-sm leading-relaxed text-slate-400">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
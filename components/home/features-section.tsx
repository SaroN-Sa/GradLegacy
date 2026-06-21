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
    icon: Camera,
  },
  {
    title: "Video Wishes",
    icon: Video,
  },
  {
    title: "Voice Messages",
    icon: Mic,
  },
  {
    title: "Time Capsule",
    icon: Clock3,
  },
  {
    title: "Memory Book",
    icon: BookOpen,
  },
  {
    title: "Multi Language",
    icon: Globe,
  },
];

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="mx-auto max-w-7xl px-6 py-24"
    >
      <h2 className="mb-12 text-center text-4xl font-bold">
        Features
      </h2>

      <div className="grid gap-6 md:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <div
              key={feature.title}
              className="rounded-2xl border p-8"
            >
              <Icon className="mb-4 h-10 w-10" />

              <h3 className="mb-2 text-xl font-semibold">
                {feature.title}
              </h3>

              <p>
                Preserve meaningful graduation
                memories digitally.
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
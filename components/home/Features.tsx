"use client";
import { Reveal } from "./Reveal";
import { FeatureCard } from "./FeatureCard";
import { FEATURES } from "@/lib/content";

export function Features() {
  return (
    <section id="features" className="px-4 py-12 sm:px-6 sm:py-16 md:py-20">
      <div className="section-head text-center max-w-2xl mx-auto">
        <div className="eyebrow centered text-[10px] sm:text-xs">Features</div>
        <h2 className="mt-2 text-xl sm:text-2xl md:text-3xl font-extrabold leading-tight">
          Everything you need to preserve this chapter
        </h2>
      </div>
      <div className="features-grid mt-8 sm:mt-10 md:mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6 max-w-5xl mx-auto">
        {FEATURES.map((f, i) => (
          <Reveal key={f.title} fold={i % 2 === 0 ? -8 : 8} delay={(i % 3) * 0.08}>
            <FeatureCard feature={f} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
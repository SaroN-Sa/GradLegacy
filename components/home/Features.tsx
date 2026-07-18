"use client";
import { Reveal } from "./Reveal";
import { FeatureCard } from "./FeatureCard";
import { FEATURES } from "@/lib/content";

export function Features() {
  return (
    <section id="features">
      <div className="section-head">
        <div className="eyebrow centered">Features</div>
        <h2>Everything you need to preserve this chapter</h2>
      </div>
      <div className="features-grid">
        {FEATURES.map((f, i) => (
          <Reveal key={f.title} fold={i % 2 === 0 ? -8 : 8} delay={(i % 3) * 0.08}>
            <FeatureCard feature={f} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
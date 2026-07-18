"use client";
import { Reveal } from "./Reveal";
import { STEPS } from "@/lib/content";

export function HowItWorks() {
  return (
    <section id="how-it-works">
      <div className="section-head">
        <div className="eyebrow centered">Simple Process</div>
        <h2>How It Works</h2>
      </div>
      <div className="steps-wrap">
        <div className="steps-line" />
        <div className="steps-grid">
          {STEPS.map((s, i) => (
            <Reveal key={s.title} fold={i % 2 === 0 ? -8 : 8} delay={i * 0.1}>
              <div className="step-card">
                <div className="step-num">{String(i + 1).padStart(2, "0")}</div>
                <div className="step-icon">{s.icon}</div>
                <h4>{s.title}</h4>
                <p>{s.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
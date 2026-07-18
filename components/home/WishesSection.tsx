"use client";
import { Reveal } from "./Reveal";
import { WISHES } from "@/lib/content";

export function WishesSection() {
  return (
    <section id="wishes">
      <div className="section-head">
        <div className="eyebrow centered">Already Arriving</div>
        <h2>The wishes start before the ceremony even ends</h2>
      </div>
      <div className="rows">
        {WISHES.map((w, i) => (
          <Reveal key={w.num} fold={i % 2 === 0 ? -6 : 6} delay={i * 0.05}>
            <div className="row">
              <div className="num">{w.num}</div>
              <h4>{w.line}</h4>
              <div className="who">{w.from}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
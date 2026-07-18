"use client";
import { Reveal } from "./Reveal";
import { GALLERY_IMGS } from "@/lib/content";

const CAPTIONS = ["Caps in the Air", "One Last Hug", "Together on the Steps", "The Whole Crowd Cheering"];

export function MomentsSection() {
  return (
    <section id="moments">
      <div className="section-head">
        <div className="eyebrow centered">The Celebration</div>
        <h2>Joy, in real frames</h2>
        <p>A glimpse of the moments families are already preserving.</p>
      </div>
      <div className="moments">
        {GALLERY_IMGS.map((src, i) => (
          <Reveal key={src + i} fold={i % 2 === 0 ? -10 : 10} delay={(i % 4) * 0.08}>
            <div className="moment">
              <div className="bg">
                <img src={src} alt="Graduation celebration moment" />
              </div>
              <div className="cap">
                <div className="eb">Frame {String(i + 1).padStart(2, "0")}</div>
                <h5>{CAPTIONS[i]}</h5>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
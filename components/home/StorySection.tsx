"use client";
import { useEffect, useRef, useState } from "react";
import { TimelineCard } from "./TimelineCard";
import { TIMELINE } from "@/lib/content";

export function StorySection() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [spineFill, setSpineFill] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = timelineRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const progressed = window.innerHeight * 0.5 - rect.top;
      setSpineFill(Math.min(100, Math.max(0, (progressed / rect.height) * 100)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section id="story">
      <div className="section-head">
        <div className="eyebrow centered">The Journey</div>
        <h2>This is the kind of story GradLegacy holds</h2>
        <p>Six chapters, one thread. Hover any milestone to let it unfold.</p>
      </div>
      <div className="timeline" ref={timelineRef}>
        <div className="spine">
          <div className="spine-fill" style={{ height: `${spineFill}%` }} />
        </div>
        {TIMELINE.map((entry, i) => (
          <TimelineCard key={entry.title} entry={entry} index={i} />
        ))}
      </div>
    </section>
  );
}
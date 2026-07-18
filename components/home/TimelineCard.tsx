"use client";
import React, { useEffect, useRef, useState } from "react";
import type { TimelineEntry } from "@/lib/types";

export function TimelineCard({ entry, index }: { entry: TimelineEntry; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setVisible(true)),
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const odd = index % 2 === 0;

  return (
    <div
      ref={ref}
      className={`tl-item ${odd ? "odd" : "even"}`}
      style={
        {
          "--fold-deg": `${entry.fold}deg`,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(24px)",
          transition: "opacity .8s ease, transform .8s ease",
        } as React.CSSProperties
      }
    >
      <div className="tl-dot" />
      <div className="fold-card">
        <div className="fold-icon">{entry.icon}</div>
        <div className="yr">{entry.year}</div>
        <h4>{entry.title}</h4>
        <p>{entry.body}</p>
      </div>
    </div>
  );
}
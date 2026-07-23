"use client";
import { useEffect, useState } from "react";
import { useSparks } from "@/hooks/useSparks";

export function AmbientParticles({ count = 34 }: { count?: number }) {
  // Fewer particles on phones/tablets — keeps things light on lower-powered
  // devices and avoids visual clutter on narrow viewports.
  const [effectiveCount, setEffectiveCount] = useState(count);

  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      if (w < 640) setEffectiveCount(Math.round(count * 0.4)); // mobile
      else if (w < 1024) setEffectiveCount(Math.round(count * 0.7)); // tablet
      else setEffectiveCount(count); // desktop
    };

    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, [count]);

  const sparks = useSparks(effectiveCount);

  return (
    <div
      id="particles"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {sparks.map((s, i) => (
        <div
          key={i}
          className="spark"
          style={{
            left: `${s.left}vw`,
            bottom: `${s.bottom}px`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
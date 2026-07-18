"use client";
import { useSparks } from "@/hooks/useSparks";

export function AmbientParticles({ count = 34 }: { count?: number }) {
  const sparks = useSparks(count);
  return (
    <div id="particles">
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
"use client";
import React, { useState } from "react";
import type { Feature } from "@/lib/types";

export function FeatureCard({ feature }: { feature: Feature }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setTilt({ x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 });
  };

  return (
    <div
      className="feature-card w-full px-4 py-5 sm:px-5 sm:py-6 md:px-6 md:py-7"
      onMouseMove={onMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      // Tilt is a hover/mouse effect — on touch devices onMouseMove never
      // fires so tilt stays at {0,0} and this is just a no-op transform,
      // which is the correct behavior for mobile/tablet.
      style={{ transform: `perspective(900px) rotateX(${-tilt.y * 6}deg) rotateY(${tilt.x * 6}deg)` }}
    >
      <div className="feature-icon w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 flex items-center justify-center">
        {feature.icon}
      </div>
      <h3 className="mt-3 sm:mt-4 text-base sm:text-lg font-bold">{feature.title}</h3>
      <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm leading-relaxed">{feature.description}</p>
    </div>
  );
}
"use client";
import React, { useCallback, useState } from "react";
import Link from "next/link";
import { GraduationCap, ArrowRight } from "lucide-react";
import { HERO_IMG } from "@/lib/content";
import { scrollTo } from "@/lib/scrollTo";

export function Hero() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleTiltMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setTilt({ x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 });
  }, []);
  // Tilt only responds to onMouseMove, so on touch devices it never fires
  // and the diploma card simply renders flat — correct mobile behavior,
  // no extra handling needed.
  const handleTiltLeave = useCallback(() => setTilt({ x: 0, y: 0 }), []);

  return (
    <section className="hero">
      <div className="hero-bg">
        <img src={HERO_IMG} alt="Graduates tossing their caps in celebration" />
      </div>
      <div className="hero-grid">
        <div>
          <div className="hero-wordmark">GradLegacy</div>
          <h1>
            Every ending
            <br />
            was just <em>practice</em>
            <br />
            for this one.
          </h1>
          <p className="hero-copy">
            Build a page that holds the whole story — from a kindergarten backpack too big for
            their shoulders to a cap thrown higher than they ever thought they'd reach. Then let
            everyone who loves them add to it.
          </p>
          <div className="hero-actions">
            <Link href="/register" className="btn-primary">
              Get Started
              <ArrowRight size={16} />
            </Link>
            <button className="btn-ghost" onClick={() => scrollTo("features")}>
              See Features
            </button>
          </div>
        </div>

        <div className="tilt-wrap" onMouseMove={handleTiltMove} onMouseLeave={handleTiltLeave}>
          <div
            className="diploma"
            style={{ transform: `rotateY(${tilt.x * 16}deg) rotateX(${-tilt.y * 16}deg)` }}
          >
            <div className="seal">
              <GraduationCap size={36} />
            </div>
            <p className="cap-label">Your GradLegacy Page</p>
            <h3>Conferred With Honor</h3>
            <div className="line" />
            <p className="cap-label">Photos, videos &amp; voice wishes, all in one place — forever</p>
          </div>
        </div>
      </div>
    </section>
  );
}
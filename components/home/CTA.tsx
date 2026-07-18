"use client";
import React, { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Countdown } from "./Countdown";
import { EVENT_DATE } from "@/lib/content";
import type { ConfettiPiece } from "@/lib/types";

export function CTA() {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const confettiId = useRef(0);

  const burstConfetti = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const pieces: ConfettiPiece[] = Array.from({ length: 26 }, () => {
      const id = confettiId.current++;
      return {
        id,
        x,
        y,
        angle: Math.random() * Math.PI * 2,
        distance: 60 + Math.random() * 110,
        rotation: Math.random() * 720 - 360,
        hue: Math.random() > 0.4 ? "gold" : "pale",
      };
    });
    setConfetti((prev) => [...prev, ...pieces]);
    window.setTimeout(() => {
      const ids = new Set(pieces.map((p) => p.id));
      setConfetti((prev) => prev.filter((p) => !ids.has(p.id)));
    }, 1100);
  }, []);

  return (
    <>
      {confetti.map((p) => {
        const dx = Math.cos(p.angle) * p.distance;
        const dy = Math.sin(p.angle) * p.distance - 40;
        return (
          <div
            key={p.id}
            className="confetti-piece"
            style={
              {
                left: p.x,
                top: p.y,
                width: p.hue === "gold" ? 7 : 5,
                height: p.hue === "gold" ? 7 : 5,
                background: p.hue === "gold" ? "var(--gold)" : "var(--text)",
                "--cx": `${dx}px`,
                "--cy": `${dy}px`,
                "--cr": `${p.rotation}deg`,
              } as React.CSSProperties
            }
          />
        );
      })}

      <section className="cta" id="cta">
        <div className="cta-card">
          <div className="eyebrow centered">Start Today</div>
          <h2>Ready to Preserve Your Memories?</h2>
          <p>Create your graduation page and start collecting wishes today.</p>
          <Countdown target={EVENT_DATE} />
          <Link href="/register" className="btn-primary" onClick={burstConfetti} style={{ marginTop: 28 }}>
            Get Started
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
"use client";
import React from "react";
import { useReveal } from "@/hooks/useReveal";

export function Reveal({
  children,
  fold = 0,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  fold?: number;
  delay?: number;
  className?: string;
}) {
  const { ref, visible } = useReveal(0.15);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "rotateY(0deg) translateY(0)" : `rotateY(${fold}deg) translateY(22px)`,
        transformStyle: "preserve-3d",
        transformOrigin: fold >= 0 ? "left center" : "right center",
        transition: `opacity .7s ease ${delay}s, transform .8s cubic-bezier(.2,.8,.2,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}
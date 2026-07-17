"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export interface LightboxItem {
  type: "image" | "video";
  url: string;
  name?: string;
}

interface WishLightboxProps {
  items: LightboxItem[];
  index: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

const WHEEL_COOLDOWN_MS = 450;
const SWIPE_THRESHOLD_PX = 50;

export default function WishLightbox({
  items,
  index,
  onClose,
  onIndexChange,
}: WishLightboxProps) {
  const [visible, setVisible] = useState(false);

  const wheelCooldownRef = useRef(false);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  const total = items.length;
  const current = items[index];
  const hasPrev = index > 0;
  const hasNext = index < total - 1;

  const goPrev = useCallback(() => {
    if (index > 0) onIndexChange(index - 1);
  }, [index, onIndexChange]);

  const goNext = useCallback(() => {
    if (index < total - 1) onIndexChange(index + 1);
  }, [index, total, onIndexChange]);

  // Mount fade-in
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  // Lock body scroll while open
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goPrev, goNext, onClose]);

  // Preload neighboring images so prev/next feel instant
  useEffect(() => {
    [items[index + 1], items[index - 1]].forEach((item) => {
      if (item?.type === "image") {
        const img = new window.Image();
        img.src = item.url;
      }
    });
  }, [index, items]);

  const handleWheel = (e: React.WheelEvent) => {
    if (wheelCooldownRef.current) return;

    const delta = e.deltaY !== 0 ? e.deltaY : e.deltaX;
    if (Math.abs(delta) < 20) return;

    if (delta > 0) goNext();
    else goPrev();

    wheelCooldownRef.current = true;
    setTimeout(() => {
      wheelCooldownRef.current = false;
    }, WHEEL_COOLDOWN_MS);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;

    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;

    // Only treat as a horizontal swipe if it's more horizontal than vertical
    if (Math.abs(deltaX) > SWIPE_THRESHOLD_PX && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) goNext();
      else goPrev();
    }

    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 150);
  };

  if (!current) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-150 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Close */}
      <button
        type="button"
        onClick={handleClose}
        aria-label="Close preview"
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-900/80 text-slate-300 transition-colors hover:border-[#FFD700]/50 hover:text-[#FFD700]"
      >
        <X size={18} />
      </button>

      {/* Counter */}
      {total > 1 && (
        <div className="absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-xs font-medium text-slate-300">
          {index + 1} / {total}
        </div>
      )}

      {/* Prev */}
      {hasPrev && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            goPrev();
          }}
          aria-label="Previous"
          className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-700 bg-slate-900/80 text-slate-300 transition-colors hover:border-[#FFD700]/50 hover:text-[#FFD700] sm:left-6"
        >
          <ChevronLeft size={20} />
        </button>
      )}

      {/* Next */}
      {hasNext && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            goNext();
          }}
          aria-label="Next"
          className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-700 bg-slate-900/80 text-slate-300 transition-colors hover:border-[#FFD700]/50 hover:text-[#FFD700] sm:right-6"
        >
          <ChevronRight size={20} />
        </button>
      )}

      {/* Content */}
      <div
        className={`relative z-[5] flex max-h-[85vh] max-w-[92vw] items-center justify-center transition-all duration-200 ${
          visible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {current.type === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={current.url}
            src={current.url}
            alt={current.name ?? "Preview"}
            className="max-h-[85vh] max-w-[92vw] rounded-xl object-contain shadow-2xl"
          />
        ) : (
          <video
            key={current.url}
            src={current.url}
            controls
            autoPlay
            className="max-h-[85vh] max-w-[92vw] rounded-xl bg-black shadow-2xl"
          />
        )}
      </div>
    </div>
  );
}
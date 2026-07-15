"use client";

import { CategorySlug } from "@/lib/media/categories";

/**
 * A tiny, category-specific visual mark:
 *  - images   → a stack of tilted photo cards
 *  - videos   → a filmstrip (sprocket holes + frame)
 *  - audio    → a waveform
 *  - featured → scattered stars
 *  - public   → concentric "broadcast" rings
 *  - private  → a dot grid (locked / hidden pattern)
 *  - unlisted → a broken/dashed link chain
 *  - all      → a small mosaic of every accent color
 */
export default function CategoryMotif({
  slug,
  className = "",
}: {
  slug: CategorySlug;
  className?: string;
}) {
  switch (slug) {
    case "images":
      return (
        <div className={`relative h-9 w-14 ${className}`}>
          <div className="absolute inset-0 rounded-md bg-violet-300/40 rotate-[-8deg]" />
          <div className="absolute inset-0 rounded-md bg-violet-400/70 rotate-[4deg]" />
          <div className="absolute inset-0 rounded-md bg-violet-500" />
        </div>
      );

    case "videos":
      return (
        <div className={`flex h-9 w-14 flex-col justify-between ${className}`}>
          <div className="flex justify-between px-[2px]">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className="h-1.5 w-1.5 rounded-[2px] bg-rose-400" />
            ))}
          </div>
          <div className="my-[3px] h-3 flex-1 rounded-sm bg-rose-500" />
          <div className="flex justify-between px-[2px]">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className="h-1.5 w-1.5 rounded-[2px] bg-rose-400" />
            ))}
          </div>
        </div>
      );

    case "audio":
      return (
        <div className={`flex h-9 w-14 items-end gap-[3px] ${className}`}>
          {[6, 14, 22, 32, 20, 12, 26].map((h, i) => (
            <span
              key={i}
              className="w-[3px] rounded-full bg-emerald-400"
              style={{ height: h }}
            />
          ))}
        </div>
      );

    case "featured":
      return (
        <div className={`relative h-9 w-14 ${className}`}>
          {[
            { top: 2, left: 2, size: 9, o: 0.5 },
            { top: 12, left: 20, size: 16, o: 1 },
            { top: 0, left: 40, size: 8, o: 0.6 },
          ].map((s, i) => (
            <svg
              key={i}
              viewBox="0 0 24 24"
              fill="currentColor"
              className="absolute text-[#FFD700]"
              style={{ top: s.top, left: s.left, width: s.size, height: s.size, opacity: s.o }}
            >
              <path d="M12 2l2.9 6.6L22 9.3l-5 4.9 1.2 7.1L12 17.8l-6.2 3.5L7 14.2 2 9.3l7.1-.7L12 2z" />
            </svg>
          ))}
        </div>
      );

    case "public":
      return (
        <div className={`flex h-9 w-14 items-center justify-center ${className}`}>
          <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-sky-400/60">
            <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-sky-400">
              <div className="h-2 w-2 rounded-full bg-sky-400" />
            </div>
          </div>
        </div>
      );

    case "private":
      return (
        <div className={`grid h-9 w-14 grid-cols-5 gap-[3px] content-center ${className}`}>
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className="h-1.5 w-1.5 rounded-[2px] bg-slate-500" />
          ))}
        </div>
      );

    case "unlisted":
      return (
        <div className={`flex h-9 w-14 items-center gap-1 ${className}`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className="h-[3px] w-3 rounded-full bg-orange-400"
              style={{ opacity: i % 2 ? 0.4 : 1 }}
            />
          ))}
        </div>
      );

    default:
      return (
        <div className={`grid h-9 w-14 grid-cols-4 grid-rows-2 gap-[3px] ${className}`}>
          {[
            "bg-violet-400", "bg-rose-400", "bg-emerald-400", "bg-[#FFD700]",
            "bg-sky-400", "bg-slate-400", "bg-orange-400", "bg-white",
          ].map((c, i) => (
            <span key={i} className={`rounded-[2px] ${c}`} />
          ))}
        </div>
      );
  }
}
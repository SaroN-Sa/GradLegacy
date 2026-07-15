"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home } from "lucide-react";
import { MediaProvider } from "@/context/MediaContext";
import { CATEGORIES } from "@/lib/media/categories";

function MediaTabs() {
  const pathname = usePathname();
  const isHub = pathname === "/dashboard/media";

  return (
    <nav className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-1 overflow-x-auto px-6 py-3 sm:px-8">
        <Link
          href="/dashboard/media"
          className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors ${
            isHub
              ? "bg-gradient-to-r from-slate-800 to-slate-900 border border-[#FFD700]/50 text-[#FFD700]"
              : "text-slate-400 hover:text-[#FFD700]"
          }`}
        >
          <Home size={13} />
          Overview
        </Link>

        <span className="mx-1 h-4 w-px shrink-0 bg-slate-700" />

        {CATEGORIES.filter((c) => c.slug !== "all").map((c) => {
          const active = pathname === `/dashboard/media/${c.slug}`;
          const Icon = c.icon;
          return (
            <Link
              key={c.slug}
              href={`/dashboard/media/${c.slug}`}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors ${
                active ? `${c.accent.bg} text-white` : "text-slate-400 hover:text-[#FFD700]"
              }`}
            >
              <Icon size={13} />
              {c.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default function MediaLayout({ children }: { children: React.ReactNode }) {
  return (
    <MediaProvider>
      <MediaTabs />
      {children}
    </MediaProvider>
  );
}
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home } from "lucide-react";
import { MediaProvider } from "@/context/MediaContext";
import { CATEGORIES } from "@/lib/media/categories";

function MediaTabs() {
  const pathname = usePathname();
  const isHub = pathname === "/media";

  return (
    <nav className="sticky top-0 z-30 border-b border-gray-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-1 overflow-x-auto px-6 py-3 sm:px-8">
        <Link
          href="/media"
          className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors ${
            isHub ? "bg-[#0f172a] text-yellow-400" : "text-gray-400 hover:text-[#0f172a]"
          }`}
        >
          <Home size={13} />
          Overview
        </Link>

        <span className="mx-1 h-4 w-px shrink-0 bg-gray-200" />

        {CATEGORIES.filter((c) => c.slug !== "all").map((c) => {
          const active = pathname === `/media/${c.slug}`;
          const Icon = c.icon;
          return (
            <Link
              key={c.slug}
              href={`/media/${c.slug}`}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors ${
                active ? `${c.accent.bg} text-white` : "text-gray-400 hover:text-[#0f172a]"
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
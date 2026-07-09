"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowUpRight, Images, Plus } from "lucide-react";

import { useMediaContext } from "@/context/MediaContext";
import { CATEGORIES } from "@/lib/media/categories";
import CategoryMotif from "@/components/media/CategoryMotif";
import UploadMediaModal from "@/components/media/UploadMediaModal";

export default function MediaHubPage() {
  const { userId, media, loading, refresh } = useMediaContext();
  const [uploadOpen, setUploadOpen] = useState(false);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    CATEGORIES.forEach((c) => {
      map[c.slug] = media.filter(c.match).length;
    });
    return map;
  }, [media]);

  return (
    <div className="space-y-8 p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link
            href="/dashboard"
            className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 transition-colors hover:text-[#0f172a]"
          >
            <ArrowLeft size={13} />
            Back to Home
          </Link>

          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#0f172a] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-yellow-400">
            <Images size={10} />
            Media Vault
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            {loading ? "Loading your media…" : `${media.length} ${media.length === 1 ? "memory" : "memories"} saved`}
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            Pick a category to browse, search and manage it on its own page.
          </p>
        </div>

        <button
          onClick={() => setUploadOpen(true)}
          className="flex items-center gap-2 self-start rounded-xl bg-gradient-to-r from-[#0f172a] to-[#1e3a5f] px-5 py-2.5 text-sm font-bold text-white transition-all hover:shadow-lg active:scale-[0.99]"
        >
          <Plus size={15} />
          Upload
        </button>
      </div>

      {/* Category row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {CATEGORIES.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.slug}
              href={`/dashboard/media/${c.slug}`}
              className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-5 shadow-lg shadow-black/5 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10"
            >
              <div className="flex items-start justify-between">
                <CategoryMotif slug={c.slug} className="relative" />
                <ArrowUpRight
                  size={16}
                  className="text-gray-300 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gray-900"
                />
              </div>

              <div className={`mt-4 inline-flex h-9 w-9 items-center justify-center rounded-xl ${c.accent.bg} shadow-md`}>
                <Icon size={16} className="text-white" />
              </div>

              <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">{c.eyebrow}</p>
              <h2 className="text-lg font-extrabold text-gray-900">{c.label}</h2>
              <p className="mt-1 text-xs leading-relaxed text-gray-400">{c.description}</p>

              <p className={`mt-4 text-3xl font-extrabold tracking-tight ${c.accent.text}`}>
                {loading ? "–" : counts[c.slug] ?? 0}
              </p>

              <div
                className={`absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r ${c.accent.from} ${c.accent.to} opacity-0 transition-opacity duration-200 group-hover:opacity-100`}
              />
            </Link>
          );
        })}
      </div>

      <UploadMediaModal
        open={uploadOpen}
        userId={userId}
        onClose={() => setUploadOpen(false)}
        onUploaded={async () => {
          setUploadOpen(false);
          await refresh();
        }}
      />
    </div>
  );
}
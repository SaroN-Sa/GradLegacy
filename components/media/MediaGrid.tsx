"use client";

import { useMemo } from "react";
import { Image as ImageIcon } from "lucide-react";

import { Media } from "@/types/media";
import MediaCard from "./MediaCard";

interface MediaGridProps {
  media: Media[];
  loading?: boolean;
  onView: (media: Media) => void;
  onEdit: (media: Media) => void;
  onDelete: (media: Media) => void;
}

export default function MediaGrid({
  media,
  loading = false,
  onView,
  onEdit,
  onDelete,
}: MediaGridProps) {
  const sortedMedia = useMemo(() => {
    return [...media].sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime();
    });
  }, [media]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950"
          >
            <div className="aspect-[4/3] bg-slate-800" />
            <div className="space-y-3 p-5">
              <div className="h-5 w-2/3 rounded bg-slate-800" />
              <div className="h-4 rounded bg-slate-800" />
              <div className="h-4 w-3/4 rounded bg-slate-800" />
              <div className="mt-6 flex justify-between border-t border-slate-800 pt-4">
                <div className="h-9 w-16 rounded-xl bg-slate-800" />
                <div className="h-9 w-16 rounded-xl bg-slate-800" />
                <div className="h-9 w-16 rounded-xl bg-slate-800" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!sortedMedia.length) {
    return (
      <div className="rounded-3xl border-2 border-dashed border-slate-700 bg-gradient-to-br from-slate-900 to-slate-950 py-24">
        <div className="flex flex-col items-center px-6 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFD700]/10">
            <ImageIcon size={28} className="text-[#FFD700]" />
          </div>
          <h2 className="text-xl font-extrabold text-white">No Media Found</h2>
          <p className="mt-2 max-w-xs text-sm text-slate-400">
            Upload your graduation memories to build your gallery. Images, videos and voice
            messages will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {sortedMedia.map((item) => (
        <MediaCard key={item.$id} media={item} onView={onView} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
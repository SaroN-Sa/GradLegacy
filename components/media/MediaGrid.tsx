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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950"
          >
            <div className="aspect-[4/3] bg-slate-200 dark:bg-slate-800" />
            <div className="space-y-3 p-4 sm:p-5">
              <div className="h-5 w-2/3 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-4 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="mt-6 flex justify-between border-t border-slate-200 dark:border-slate-800 pt-4">
                <div className="h-9 w-16 rounded-xl bg-slate-200 dark:bg-slate-800" />
                <div className="h-9 w-16 rounded-xl bg-slate-200 dark:bg-slate-800" />
                <div className="h-9 w-16 rounded-xl bg-slate-200 dark:bg-slate-800" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!sortedMedia.length) {
    return (
      <div className="rounded-2xl sm:rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 py-16 sm:py-24">
        <div className="flex flex-col items-center px-6 text-center">
          <div className="mb-4 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-[#FFD700]/10">
            <ImageIcon size={26} className="text-[#B8860B] dark:text-[#FFD700] sm:hidden" />
            <ImageIcon size={28} className="hidden text-[#B8860B] dark:text-[#FFD700] sm:block" />
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">No Media Found</h2>
          <p className="mt-2 max-w-xs text-sm text-slate-500 dark:text-slate-400">
            Upload your graduation memories to build your gallery. Images, videos and voice
            messages will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
      {sortedMedia.map((item) => (
        <MediaCard key={item.$id} media={item} onView={onView} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
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

      return (
        new Date(b.$createdAt).getTime() -
        new Date(a.$createdAt).getTime()
      );
    });
  }, [media]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse overflow-hidden rounded-2xl border border-gray-100 bg-white"
          >
            <div className="aspect-[4/3] bg-gray-200" />

            <div className="space-y-3 p-5">
              <div className="h-5 w-2/3 rounded bg-gray-200" />

              <div className="h-4 rounded bg-gray-200" />

              <div className="h-4 w-3/4 rounded bg-gray-200" />

              <div className="mt-6 flex justify-between">
                <div className="h-9 w-20 rounded bg-gray-200" />

                <div className="h-9 w-20 rounded bg-gray-200" />

                <div className="h-9 w-20 rounded bg-gray-200" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!sortedMedia.length) {
    return (
      <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white py-24">
        <div className="flex flex-col items-center text-center px-6">
          <div className="w-16 h-16 rounded-2xl bg-[#0f172a]/8 flex items-center justify-center mb-4">
            <ImageIcon size={28} className="text-gray-300" />
          </div>

          <h2 className="text-xl font-extrabold text-gray-900">
            No Media Found
          </h2>

          <p className="mt-2 text-sm text-gray-400 max-w-xs">
            Upload your graduation memories to build your gallery.
            Images, videos and voice messages will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {sortedMedia.map((item) => (
        <MediaCard
          key={item.$id}
          media={item}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
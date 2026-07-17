"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
  Star,
  Calendar,
} from "lucide-react";

import { Media } from "@/types/media";
import { TYPE_ACCENT, VISIBILITY_ACCENT } from "@/lib/media/media-accent";

interface GalleryLightboxProps {
  mediaList: Media[];
  index: number | null;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

export default function GalleryLightbox({ mediaList, index, onClose, onIndexChange }: GalleryLightboxProps) {
  const [copied, setCopied] = useState(false);

  const open = index !== null && !!mediaList[index];
  const media = open ? mediaList[index as number] : null;
  const hasMultiple = mediaList.length > 1;

  const goPrev = () => {
    if (index === null) return;
    onIndexChange((index - 1 + mediaList.length) % mediaList.length);
  };

  const goNext = () => {
    if (index === null) return;
    onIndexChange((index + 1) % mediaList.length);
  };

  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft" && hasMultiple) goPrev();
      if (event.key === "ArrowRight" && hasMultiple) goNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, index, hasMultiple]);

  useEffect(() => {
    setCopied(false);
  }, [index]);

  if (!open || !media) return null;

  const visibility = VISIBILITY_ACCENT[media.visibility];
  const typeAccent = TYPE_ACCENT[media.type];
  const VisibilityIcon = visibility?.icon;

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = media.url;
    link.download = media.title || "media";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: media.title, text: media.description, url: media.url });
        return;
      } catch {
        // user cancelled the native share sheet — fall through to clipboard
      }
    }
    await navigator.clipboard.writeText(media.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        {/* Media area */}
        <div className="relative flex-1 bg-black">
          {media.type === "image" ? (
            <Image
              key={media.$id}
              src={media.url}
              alt={media.title || "Media"}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          ) : (
            <video key={media.$id} src={media.url} controls autoPlay className="h-full w-full" />
          )}

          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 rounded-full bg-white/90 p-3 transition hover:bg-white"
          >
            <X className="h-5 w-5" />
          </button>

          {media.featured && (
            <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-[#FFD700] px-4 py-2 text-sm font-bold text-slate-950 shadow">
              <Star className="h-4 w-4 fill-current" />
              Featured
            </div>
          )}

          {typeAccent && (
            <div className={`absolute bottom-5 left-5 flex items-center gap-2 rounded-full ${typeAccent.chip} px-4 py-2 text-sm font-bold capitalize text-white shadow`}>
              <typeAccent.icon className="h-4 w-4" />
              {media.type}
            </div>
          )}

          {hasMultiple && (
            <div className="absolute bottom-5 right-5 rounded-full bg-black/60 px-3 py-1.5 text-xs font-bold text-white">
              {(index as number) + 1} / {mediaList.length}
            </div>
          )}

          {copied && (
            <div className="absolute bottom-16 right-5 rounded-full bg-[#0f172a] px-4 py-2 text-sm font-semibold text-white shadow-lg">
              Link copied
            </div>
          )}

          {/* Prev / Next */}
          {hasMultiple && (
            <>
              <button
                type="button"
                onClick={goPrev}
                className="absolute left-5 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 transition hover:bg-white"
                aria-label="Previous"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={goNext}
                className="absolute right-5 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 transition hover:bg-white"
                aria-label="Next"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        {/* Info bar */}
        <div className="flex flex-col gap-4 border-t border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-extrabold tracking-tight text-gray-900">
              {media.title || "Untitled Media"}
            </h2>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              {visibility && (
                <span className={`inline-flex items-center gap-1.5 rounded-full bg-gray-50 px-2.5 py-1 text-xs font-semibold ${visibility.text}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${visibility.dot}`} />
                  <VisibilityIcon className="h-3.5 w-3.5" />
                  {visibility.label}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-50 px-2.5 py-1 text-xs font-semibold text-gray-400">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(media.$createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 gap-2.5">
            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#0f172a] to-[#1e3a5f] px-4 py-2.5 text-sm font-semibold text-white transition hover:shadow-lg"
            >
              <Download className="h-4 w-4" />
              Download
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-2 rounded-xl border-2 border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              <Share2 className="h-4 w-4" />
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
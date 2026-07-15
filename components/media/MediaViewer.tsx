"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, Download, Share2, Pencil, Trash2, Star, Calendar, Music } from "lucide-react";

import { Media } from "@/types/media";
import { TYPE_ACCENT, VISIBILITY_ACCENT } from "@/lib/media/media-accent";

interface MediaViewerProps {
  open: boolean;
  media: Media | null;
  onClose: () => void;
  onEdit?: (media: Media) => void;
  onDelete?: (media: Media) => void;
}

export default function MediaViewer({ open, media, onClose, onEdit, onDelete }: MediaViewerProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

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

  const renderMedia = () => {
    if (media.type === "image") {
      return (
        <Image src={media.url} alt={media.title} fill className="object-contain" sizes="100vw" priority />
      );
    }
    if (media.type === "video") {
      return <video src={media.url} controls autoPlay className="h-full w-full" />;
    }
    return (
      <div className="flex h-full flex-col items-center justify-center gap-8">
        <Music className="h-24 w-24 text-emerald-400" />
        <audio controls className="w-full max-w-lg">
          <source src={media.url} />
        </audio>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex h-[90vh] w-full max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 shadow-2xl"
      >
        {/* Media section */}
        <div className="relative flex-1 bg-black">
          {renderMedia()}

          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 rounded-full bg-slate-950/90 border border-slate-700 p-3 transition hover:border-slate-600"
          >
            <X className="h-5 w-5 text-slate-200" />
          </button>

          {media.featured && (
            <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-[#FFD700] px-4 py-2 text-sm font-bold text-slate-950 shadow">
              <Star className="h-4 w-4 fill-current" />
              Featured
            </div>
          )}

          {typeAccent && (
            <div className={`absolute bottom-5 left-5 flex items-center gap-2 rounded-full ${typeAccent.chip} px-4 py-2 text-sm font-bold text-white capitalize shadow`}>
              <typeAccent.icon className="h-4 w-4" />
              {media.type}
            </div>
          )}

          {/* Copy-link toast */}
          {copied && (
            <div className="absolute bottom-5 right-5 rounded-full bg-gradient-to-r from-slate-800 to-slate-900 border border-[#FFD700]/40 px-4 py-2 text-sm font-semibold text-[#FFD700] shadow-lg">
              Link copied
            </div>
          )}
        </div>

        {/* Information panel */}
        <div className="flex w-[420px] flex-col border-l border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950">
          <div className="border-b border-slate-800 p-6">
            <h2 className="text-2xl font-extrabold tracking-tight text-white">
              {media.title || "Untitled Media"}
            </h2>
            {media.description && (
              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-400">{media.description}</p>
            )}
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto p-6">
            <div className="flex flex-wrap items-center gap-2">
              {visibility && (
                <span className={`inline-flex items-center gap-1.5 rounded-full bg-slate-800/60 px-3 py-1.5 text-sm font-semibold ${visibility.text}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${visibility.dot}`} />
                  <VisibilityIcon className="h-4 w-4" />
                  {visibility.label}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-800/60 px-3 py-1.5 text-sm font-semibold text-slate-400">
                <Calendar className="h-4 w-4" />
                {new Date(media.$createdAt).toLocaleString()}
              </span>
            </div>

            {media.album && (
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Album</p>
                <div className="rounded-2xl bg-slate-800/60 border border-slate-700 px-4 py-3 text-sm text-slate-200">{media.album}</div>
              </div>
            )}

            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Public ID</p>
              <div className="break-all rounded-2xl bg-slate-800/60 border border-slate-700 p-3 text-xs text-slate-400">{media.publicId}</div>
            </div>

            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Media URL</p>
              <div className="break-all rounded-2xl bg-slate-800/60 border border-slate-700 p-3 text-xs text-slate-400">{media.url}</div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4">
              <button
                type="button"
                onClick={handleDownload}
                className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 border border-[#FFD700]/50 px-4 py-3 text-sm font-semibold text-[#FFD700] transition hover:border-[#FFD700]"
              >
                <Download className="h-4 w-4" />
                Download
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="flex items-center justify-center gap-2 rounded-2xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:border-slate-600"
              >
                <Share2 className="h-4 w-4" />
                Share
              </button>

              <button
                type="button"
                onClick={() => onEdit?.(media)}
                className="flex items-center justify-center gap-2 rounded-2xl border border-[#FFD700]/30 px-4 py-3 text-sm font-semibold text-[#FFD700] transition hover:bg-[#FFD700]/10"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </button>

              <button
                type="button"
                onClick={() => onDelete?.(media)}
                className="flex items-center justify-center gap-2 rounded-2xl border border-red-500/30 px-4 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-900/20"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>

          <div className="border-t border-slate-800 bg-slate-950/60 p-6">
            <p className="text-center text-xs text-slate-500">
              Uploaded on {new Date(media.$createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
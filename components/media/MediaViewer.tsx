"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { X, Download, Share2, Pencil, Trash2, Star, Calendar, Music, AlertTriangle } from "lucide-react";

import { Media } from "@/types/media";
import { TYPE_ACCENT, VISIBILITY_ACCENT } from "@/lib/media/media-accent";

interface MediaViewerProps {
  open: boolean;
  media: Media | null;
  onClose: () => void;
  onEdit?: (media: Media) => void;
  onDelete?: (media: Media) => void;
}

function DeleteMediaDialog({
  open,
  isDeleting,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onCancel}
      />

      <div className="relative w-full max-w-sm rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-6 shadow-2xl">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-900/20 text-red-400 mb-4">
          <AlertTriangle size={22} />
        </div>

        <h3 className="text-lg font-semibold text-white mb-1.5">
          Delete this media?
        </h3>

        <p className="text-sm text-slate-400 mb-6">
          This action cannot be undone. The file will be permanently removed.
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 py-2.5 rounded-3xl border border-slate-700 text-slate-300 text-sm font-medium hover:border-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 py-2.5 rounded-3xl bg-red-900/30 border border-red-500/40 text-red-300 text-sm font-medium hover:bg-red-900/50 hover:border-red-500/60 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MediaViewer({ open, media, onClose, onEdit, onDelete }: MediaViewerProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (showDeleteConfirm) {
          setShowDeleteConfirm(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose, showDeleteConfirm]);

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
    toast.success("Link copied to clipboard.");
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleCancelDelete = () => {
    if (isDeleting) return;
    setShowDeleteConfirm(false);
  };

  const handleConfirmDelete = async () => {
    if (!onDelete) return;

    try {
      setIsDeleting(true);
      await onDelete(media);
      toast.success("Media deleted.");
      setShowDeleteConfirm(false);
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Couldn't delete that media. Try again.");
    } finally {
      setIsDeleting(false);
    }
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
        className="flex h-[88vh] w-full max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 shadow-2xl"
      >
        {/* Media section */}
        <div className="relative flex-1 bg-black">
          {renderMedia()}

          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full bg-slate-950/90 border border-slate-700 p-2.5 transition hover:border-slate-600"
          >
            <X className="h-4 w-4 text-slate-200" />
          </button>

          {media.featured && (
            <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-[#FFD700] px-3 py-1.5 text-xs font-bold text-slate-950 shadow">
              <Star className="h-3.5 w-3.5 fill-current" />
              Featured
            </div>
          )}

          {typeAccent && (
            <div className={`absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full ${typeAccent.chip} px-3 py-1.5 text-xs font-bold text-white capitalize shadow`}>
              <typeAccent.icon className="h-3.5 w-3.5" />
              {media.type}
            </div>
          )}
        </div>

        {/* Information panel */}
        <div className="flex w-[360px] flex-col border-l border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950">
          <div className="border-b border-slate-800 p-5">
            <h2 className="text-lg font-bold text-white leading-snug">
              {media.title || "Untitled Media"}
            </h2>
            {media.description && (
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-400">{media.description}</p>
            )}
          </div>

          <div className="flex-1 space-y-5 overflow-y-auto p-5">
            <div className="flex flex-wrap items-center gap-2">
              {visibility && (
                <span className={`inline-flex items-center gap-1.5 rounded-full bg-slate-800/60 px-2.5 py-1 text-xs font-semibold ${visibility.text}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${visibility.dot}`} />
                  <VisibilityIcon className="h-3.5 w-3.5" />
                  {visibility.label}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-800/60 px-2.5 py-1 text-xs font-semibold text-slate-400">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(media.$createdAt).toLocaleDateString()}
              </span>
            </div>

            {media.album && (
              <div>
                <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-500">Album</p>
                <div className="rounded-2xl bg-slate-800/60 border border-slate-700 px-3 py-2 text-sm text-slate-200">{media.album}</div>
              </div>
            )}

            <div>
              <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-500">Public ID</p>
              <div className="break-all rounded-2xl bg-slate-800/60 border border-slate-700 p-2.5 text-xs text-slate-400">{media.publicId}</div>
            </div>

            <div>
              <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-500">Media URL</p>
              <div className="break-all rounded-2xl bg-slate-800/60 border border-slate-700 p-2.5 text-xs text-slate-400">{media.url}</div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={handleDownload}
                className="flex items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 border border-[#FFD700]/50 px-3 py-2.5 text-xs font-semibold text-[#FFD700] transition hover:border-[#FFD700]"
              >
                <Download className="h-3.5 w-3.5" />
                Download
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="flex items-center justify-center gap-1.5 rounded-2xl border border-slate-700 px-3 py-2.5 text-xs font-semibold text-slate-300 transition hover:border-slate-600"
              >
                <Share2 className="h-3.5 w-3.5" />
                Share
              </button>

              <button
                type="button"
                onClick={() => onEdit?.(media)}
                className="flex items-center justify-center gap-1.5 rounded-2xl border border-[#FFD700]/30 px-3 py-2.5 text-xs font-semibold text-[#FFD700] transition hover:bg-[#FFD700]/10"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </button>

              <button
                type="button"
                onClick={handleDeleteClick}
                className="flex items-center justify-center gap-1.5 rounded-2xl border border-red-500/30 px-3 py-2.5 text-xs font-semibold text-red-400 transition hover:bg-red-900/20"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          </div>

          <div className="border-t border-slate-800 bg-slate-950/60 p-4">
            <p className="text-center text-[11px] text-slate-500">
              Uploaded {new Date(media.$createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <DeleteMediaDialog
        open={showDeleteConfirm}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}
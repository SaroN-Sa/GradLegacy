"use client";

import Image from "next/image";
import { Eye, Pencil, Trash2, Star, Play, Music, Calendar } from "lucide-react";

import { Media } from "@/types/media";
import { TYPE_ACCENT, VISIBILITY_ACCENT } from "@/lib/media/media-accent";

interface MediaCardProps {
  media: Media;
  onView: (media: Media) => void;
  onEdit: (media: Media) => void;
  onDelete: (media: Media) => void;
}

export default function MediaCard({ media, onView, onEdit, onDelete }: MediaCardProps) {
  const visibility = VISIBILITY_ACCENT[media.visibility];
  const typeAccent = TYPE_ACCENT[media.type];
  const VisibilityIcon = visibility?.icon;
  const TypeIcon = typeAccent?.icon;

  const mediaPreview = () => {
    if (media.type === "image") {
      return (
        <Image
          src={media.url}
          alt={media.title || "Media"}
          fill
          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
      );
    }

    if (media.type === "video") {
      return (
        <>
          <video src={media.url} className="h-full w-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="rounded-full bg-white/90 dark:bg-slate-950/90 border border-[#FFD700]/30 p-3 sm:p-4">
              <Play className="h-6 w-6 sm:h-8 sm:w-8 fill-current text-[#B8860B] dark:text-[#FFD700]" />
            </div>
          </div>
        </>
      );
    }

    return (
      <div className="flex h-full items-center justify-center bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900/30 dark:to-emerald-950/30">
        <Music className="h-10 w-10 sm:h-14 sm:w-14 text-emerald-600 dark:text-emerald-400" />
      </div>
    );
  };

  return (
    <div className="group overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 shadow-lg shadow-black/5 dark:shadow-black/20 transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/30">
      {/* Preview */}
      <div
        className="relative aspect-[4/3] cursor-pointer overflow-hidden bg-slate-100 dark:bg-slate-800"
        onClick={() => onView(media)}
      >
        {mediaPreview()}

        {media.featured && (
          <div className="absolute left-2 top-2 sm:left-3 sm:top-3 flex items-center gap-1 rounded-full bg-[#FFD700] px-2.5 py-1 sm:px-3 text-[11px] sm:text-xs font-bold text-slate-950 shadow">
            <Star className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-current" />
            Featured
          </div>
        )}

        {typeAccent && (
          <div className={`absolute right-2 top-2 sm:right-3 sm:top-3 flex items-center gap-1 rounded-full ${typeAccent.chip} px-2.5 py-1 sm:px-3 text-[11px] sm:text-xs font-bold text-white capitalize shadow`}>
            <TypeIcon className="h-3 w-3" />
            {media.type}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-3 p-4 sm:space-y-4 sm:p-5">
        <div>
          <h3 className="truncate text-base sm:text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
            {media.title || "Untitled Media"}
          </h3>

          {media.description && (
            <p className="mt-1.5 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{media.description}</p>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs">
          {visibility && (
            <span className={`inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-800/60 px-2 py-1 sm:px-2.5 font-semibold ${visibility.text}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${visibility.dot}`} />
              <VisibilityIcon className="h-3.5 w-3.5" />
              {visibility.label}
            </span>
          )}

          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-800/60 px-2 py-1 sm:px-2.5 font-semibold text-slate-500 dark:text-slate-400">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(media.$createdAt).toLocaleDateString()}
          </span>

          {media.album && (
            <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800/60 px-2 py-1 sm:px-2.5 font-semibold text-slate-600 dark:text-slate-300">
              {media.album}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between gap-1 border-t border-slate-200 dark:border-slate-800 pt-3 sm:pt-4">
          <button
            type="button"
            onClick={() => onView(media)}
            className="flex items-center gap-1.5 rounded-xl px-2.5 py-2 sm:px-3 text-xs sm:text-sm font-semibold text-[#B8860B] dark:text-[#FFD700] transition-colors hover:bg-[#FFD700]/10"
          >
            <Eye className="h-4 w-4" />
            <span className="hidden xs:inline sm:inline">View</span>
          </button>

          <button
            type="button"
            onClick={() => onEdit(media)}
            className="flex items-center gap-1.5 rounded-xl px-2.5 py-2 sm:px-3 text-xs sm:text-sm font-semibold text-[#B8860B] dark:text-[#FFD700] transition-colors hover:bg-[#FFD700]/10"
          >
            <Pencil className="h-4 w-4" />
            <span className="hidden xs:inline sm:inline">Edit</span>
          </button>

          <button
            type="button"
            onClick={() => onDelete(media)}
            className="flex items-center gap-1.5 rounded-xl px-2.5 py-2 sm:px-3 text-xs sm:text-sm font-semibold text-red-600 dark:text-red-400 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden xs:inline sm:inline">Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
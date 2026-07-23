"use client";

import Image from "next/image";
import { Eye, Star, Play, Music, Calendar } from "lucide-react";

import { Media } from "@/types/media";
import { TYPE_ACCENT, VISIBILITY_ACCENT } from "@/lib/media/media-accent";

interface PublicMediaCardProps {
  media: Media;
  onView: (media: Media) => void;
}

export default function PublicMediaCard({ media, onView }: PublicMediaCardProps) {
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
            <div className="rounded-full border border-[#FFD700]/30 bg-white/90 p-3 dark:bg-slate-950/90 sm:p-4">
              <Play className="h-6 w-6 fill-current text-[#B8860B] dark:text-[#FFD700] sm:h-8 sm:w-8" />
            </div>
          </div>
        </>
      );
    }

    return (
      <div className="flex h-full items-center justify-center bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900/30 dark:to-emerald-950/30">
        <Music className="h-10 w-10 text-emerald-600 dark:text-emerald-400 sm:h-14 sm:w-14" />
      </div>
    );
  };

  return (
    <button
      type="button"
      onClick={() => onView(media)}
      className="group w-full overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 text-left shadow-lg shadow-black/5 transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-black/10 active:translate-y-0 active:shadow-md dark:border-slate-800 dark:from-slate-900 dark:to-slate-950 dark:shadow-black/20 dark:hover:border-slate-700 dark:hover:shadow-black/30 sm:rounded-3xl"
    >
      {/* Preview */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800">
        {mediaPreview()}

        {media.featured && (
          <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-[#FFD700] px-2.5 py-1 text-[11px] font-bold text-slate-950 shadow sm:left-3 sm:top-3 sm:px-3 sm:text-xs">
            <Star className="h-3 w-3 fill-current sm:h-3.5 sm:w-3.5" />
            Featured
          </div>
        )}

        {typeAccent && (
          <div className={`absolute right-2 top-2 flex items-center gap-1 rounded-full ${typeAccent.chip} px-2.5 py-1 text-[11px] font-bold text-white capitalize shadow sm:right-3 sm:top-3 sm:px-3 sm:text-xs`}>
            <TypeIcon className="h-3 w-3" />
            {media.type}
          </div>
        )}

        {/* View affordance on hover/tap, since the whole card is the click target */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-200 group-hover:bg-black/10 group-hover:opacity-100 group-active:bg-black/10 group-active:opacity-100">
          <span className="flex items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-2 text-xs font-bold text-slate-900 shadow sm:px-4 sm:text-sm">
            <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            View
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2.5 p-4 sm:space-y-3 sm:p-5">
        <div>
          <h3 className="truncate text-base font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-lg">
            {media.title || "Untitled Media"}
          </h3>

          {media.description && (
            <p className="mt-1.5 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{media.description}</p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-[11px] sm:gap-2 sm:text-xs">
          {visibility && (
            <span className={`inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2 py-1 font-semibold dark:bg-slate-800/60 sm:px-2.5 ${visibility.text}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${visibility.dot}`} />
              <VisibilityIcon className="h-3.5 w-3.5" />
              {visibility.label}
            </span>
          )}

          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2 py-1 font-semibold text-slate-500 dark:bg-slate-800/60 dark:text-slate-400 sm:px-2.5">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(media.$createdAt).toLocaleDateString()}
          </span>

          {media.album && (
            <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 font-semibold text-slate-600 dark:bg-slate-800/60 dark:text-slate-300 sm:px-2.5">
              {media.album}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
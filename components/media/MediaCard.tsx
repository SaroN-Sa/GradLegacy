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
          sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
      );
    }

    if (media.type === "video") {
      return (
        <>
          <video src={media.url} className="h-full w-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <div className="rounded-full bg-white/90 p-4">
              <Play className="h-8 w-8 fill-current text-[#0f172a]" />
            </div>
          </div>
        </>
      );
    }

    return (
      <div className="flex h-full items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-100">
        <Music className="h-14 w-14 text-emerald-500" />
      </div>
    );
  };

  return (
    <div className="group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-lg shadow-black/5 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10">
      {/* Preview */}
      <div
        className="relative aspect-[4/3] cursor-pointer overflow-hidden bg-gray-100"
        onClick={() => onView(media)}
      >
        {mediaPreview()}

        {media.featured && (
          <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-yellow-400 px-3 py-1 text-xs font-bold text-[#0f172a] shadow">
            <Star className="h-3.5 w-3.5 fill-current" />
            Featured
          </div>
        )}

        {typeAccent && (
          <div className={`absolute right-3 top-3 flex items-center gap-1 rounded-full ${typeAccent.chip} px-3 py-1 text-xs font-bold text-white capitalize shadow`}>
            <TypeIcon className="h-3 w-3" />
            {media.type}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-4 p-5">
        <div>
          <h3 className="truncate text-lg font-extrabold tracking-tight text-gray-900">
            {media.title || "Untitled Media"}
          </h3>

          {media.description && (
            <p className="mt-1.5 line-clamp-2 text-sm text-gray-500">{media.description}</p>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {visibility && (
            <span className={`inline-flex items-center gap-1.5 rounded-full bg-gray-50 px-2.5 py-1 font-semibold ${visibility.text}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${visibility.dot}`} />
              <VisibilityIcon className="h-3.5 w-3.5" />
              {visibility.label}
            </span>
          )}

          <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-50 px-2.5 py-1 font-semibold text-gray-400">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(media.$createdAt).toLocaleDateString()}
          </span>

          {media.album && (
            <span className="inline-flex items-center rounded-full bg-gray-50 px-2.5 py-1 font-semibold text-gray-500">
              {media.album}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
          <button
            type="button"
            onClick={() => onView(media)}
            className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-[#0f172a] transition-colors hover:bg-[#0f172a]/5"
          >
            <Eye className="h-4 w-4" />
            View
          </button>

          <button
            type="button"
            onClick={() => onEdit(media)}
            className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-[#0f172a] transition-colors hover:bg-[#0f172a]/5"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </button>

          <button
            type="button"
            onClick={() => onDelete(media)}
            className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
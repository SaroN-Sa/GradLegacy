"use client";

import Image from "next/image";
import {
  Eye,
  Pencil,
  Trash2,
  Globe,
  Lock,
  Link2,
  Star,
  Play,
  Music,
  Calendar,
} from "lucide-react";

import { Media } from "@/types/media";

interface MediaCardProps {
  media: Media;

  onView: (media: Media) => void;

  onEdit: (media: Media) => void;

  onDelete: (media: Media) => void;
}

export default function MediaCard({
  media,
  onView,
  onEdit,
  onDelete,
}: MediaCardProps) {
  const visibilityIcon = () => {
    switch (media.visibility) {
      case "public":
        return <Globe className="h-4 w-4 text-green-600" />;

      case "private":
        return <Lock className="h-4 w-4 text-red-600" />;

      case "unlisted":
        return <Link2 className="h-4 w-4 text-yellow-600" />;

      default:
        return null;
    }
  };

  const visibilityText = () => {
    switch (media.visibility) {
      case "public":
        return "Public";

      case "private":
        return "Private";

      case "unlisted":
        return "Unlisted";

      default:
        return "";
    }
  };

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
          <video
            src={media.url}
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <div className="rounded-full bg-white/90 p-4">
              <Play className="h-8 w-8 fill-current text-[#0f172a]" />
            </div>
          </div>
        </>
      );
    }

    return (
      <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#0f172a]/5 to-[#0f172a]/10">
        <Music className="h-16 w-16 text-[#0f172a]" />
      </div>
    );
  };

  return (
    <div className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Preview */}
      <div
        className="relative aspect-[4/3] cursor-pointer overflow-hidden bg-gray-100"
        onClick={() => onView(media)}
      >
        {mediaPreview()}

        {/* Featured Badge */}
        {media.featured && (
          <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-yellow-400 px-3 py-1 text-xs font-semibold text-[#0f172a] shadow">
            <Star className="h-3.5 w-3.5 fill-current" />
            Featured
          </div>
        )}

        {/* Media Type */}
        <div className="absolute right-3 top-3 rounded-full bg-[#0f172a]/80 px-3 py-1 text-xs font-medium text-white capitalize">
          {media.type}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4 p-5">
        <div>
          <h3 className="truncate text-lg font-semibold text-gray-900">
            {media.title || "Untitled Media"}
          </h3>

          {media.description && (
            <p className="mt-2 line-clamp-2 text-sm text-gray-600">
              {media.description}
            </p>
          )}
        </div>

        {/* Info */}
        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            {visibilityIcon()}

            <span>{visibilityText()}</span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />

            <span>
              {new Date(media.$createdAt).toLocaleDateString()}
            </span>
          </div>

          {media.album && (
            <div className="rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium text-gray-700">
              Album: {media.album}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between border-t pt-4">
          <button
            type="button"
            onClick={() => onView(media)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[#0f172a] transition hover:bg-[#0f172a]/5"
          >
            <Eye className="h-4 w-4" />
            View
          </button>

          <button
            type="button"
            onClick={() => onEdit(media)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[#0f172a] transition hover:bg-[#0f172a]/5"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </button>

          <button
            type="button"
            onClick={() => onDelete(media)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
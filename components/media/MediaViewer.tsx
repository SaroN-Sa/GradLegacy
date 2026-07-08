"use client";

import { useEffect } from "react";
import Image from "next/image";
import {
  X,
  Download,
  Share2,
  Pencil,
  Trash2,
  Globe,
  Lock,
  Link2,
  Star,
  Calendar,
  Play,
  Music,
} from "lucide-react";

import { Media } from "@/types/media";

interface MediaViewerProps {
  open: boolean;

  media: Media | null;

  onClose: () => void;

  onEdit?: (media: Media) => void;

  onDelete?: (media: Media) => void;
}

export default function MediaViewer({
  open,
  media,
  onClose,
  onEdit,
  onDelete,
}: MediaViewerProps) {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [onClose]);

  if (!open || !media) {
    return null;
  }

  const visibilityIcon = () => {
    switch (media.visibility) {
      case "public":
        return (
          <Globe className="h-4 w-4 text-green-600" />
        );

      case "private":
        return (
          <Lock className="h-4 w-4 text-red-600" />
        );

      case "unlisted":
        return (
          <Link2 className="h-4 w-4 text-yellow-600" />
        );

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

  const handleDownload = () => {
    const link =
      document.createElement("a");

    link.href = media.url;

    link.download = media.title || "media";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (
      navigator.share
    ) {
      try {
        await navigator.share({
          title: media.title,
          text: media.description,
          url: media.url,
        });

        return;
      } catch {}
    }

    await navigator.clipboard.writeText(
      media.url
    );

    alert("Media link copied.");
  };

  const renderMedia = () => {
    if (media.type === "image") {
      return (
        <Image
          src={media.url}
          alt={media.title}
          fill
          className="object-contain"
          sizes="100vw"
          priority
        />
      );
    }

    if (media.type === "video") {
      return (
        <video
          src={media.url}
          controls
          autoPlay
          className="h-full w-full"
        />
      );
    }

    return (
      <div className="flex h-full flex-col items-center justify-center gap-8">

        <Music className="h-24 w-24 text-[#0f172a]" />

        <audio
          controls
          className="w-full max-w-lg"
        >
          <source
            src={media.url}
          />
        </audio>

      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex h-[90vh] w-full max-w-7xl overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        {/* Media Section */}
        <div className="relative flex-1 bg-black">
          {renderMedia()}

          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 rounded-full bg-white/90 p-3 transition hover:bg-white"
          >
            <X className="h-5 w-5" />
          </button>

          {media.featured && (
            <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-yellow-400 px-4 py-2 font-semibold text-[#0f172a] shadow">
              <Star className="h-4 w-4 fill-current" />

              Featured
            </div>
          )}

          <div className="absolute bottom-5 left-5 rounded-full bg-[#0f172a]/80 px-4 py-2 text-sm font-medium text-white capitalize">
            {media.type}
          </div>
        </div>

        {/* Information */}
        <div className="flex w-[420px] flex-col border-l border-gray-200 bg-white">
          <div className="border-b border-gray-100 p-6">
            <h2 className="text-2xl font-bold">
              {media.title || "Untitled Media"}
            </h2>

            {media.description && (
              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-gray-600">
                {media.description}
              </p>
            )}
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto p-6">
            <div className="flex items-center gap-3">
              {visibilityIcon()}

              <span className="font-medium">
                {visibilityText()}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-gray-500" />

              <span>
                {new Date(
                  media.$createdAt
                ).toLocaleString()}
              </span>
            </div>

            {media.album && (
              <div>
                <p className="mb-2 text-sm font-semibold">
                  Album
                </p>

                <div className="rounded-lg bg-gray-100 px-4 py-3">
                  {media.album}
                </div>
              </div>
            )}

            <div>
              <p className="mb-2 text-sm font-semibold">
                Public ID
              </p>

              <div className="break-all rounded-lg bg-gray-100 p-3 text-xs">
                {media.publicId}
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold">
                Media URL
              </p>

              <div className="break-all rounded-lg bg-gray-100 p-3 text-xs">
                {media.url}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4">
              <button
                type="button"
                onClick={handleDownload}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0f172a] to-[#1e3a5f] px-4 py-3 font-medium text-white transition hover:shadow-lg"
              >
                <Download className="h-4 w-4" />

                Download
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-4 py-3 font-medium transition hover:bg-gray-100"
              >
                <Share2 className="h-4 w-4" />

                Share
              </button>

              <button
                type="button"
                onClick={() => onEdit?.(media)}
                className="flex items-center justify-center gap-2 rounded-xl border border-[#0f172a] px-4 py-3 font-medium text-[#0f172a] transition hover:bg-[#0f172a]/5"
              >
                <Pencil className="h-4 w-4" />

                Edit
              </button>

              <button
                type="button"
                onClick={() => onDelete?.(media)}
                className="flex items-center justify-center gap-2 rounded-xl border border-red-500 px-4 py-3 font-medium text-red-600 transition hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />

                Delete
              </button>
            </div>
          </div>

          <div className="border-t border-gray-100 bg-gray-50 p-6">
            <p className="text-center text-xs text-gray-500">
              Uploaded on{" "}
              {new Date(
                media.$createdAt
              ).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
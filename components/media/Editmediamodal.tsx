"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, Loader2, ArrowLeft, ChevronDown, Trash2, Music, Play } from "lucide-react";

import { Media } from "@/types/media";
import { mediaService } from "@/services/media";
import { TYPE_ACCENT, VISIBILITY_ACCENT } from "@/lib/media/media-accent";

interface EditMediaModalProps {
  open: boolean;
  media: Media | null;
  onClose: () => void;
  onSaved?: (media: Media) => void;
  onDelete?: (media: Media) => void;
}

const FIELD_CLASS =
  "w-full rounded-xl border border-gray-200 px-4 py-3 text-[#0f172a] outline-none transition placeholder:text-gray-400 focus:border-[#0f172a] focus:ring-4 focus:ring-[#0f172a]/8";

export default function EditMediaModal({ open, media, onClose, onSaved, onDelete }: EditMediaModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [album, setAlbum] = useState("");
  const [visibility, setVisibility] = useState<"private" | "public" | "unlisted">("private");
  const [featured, setFeatured] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Reset the form every time a new item is opened for editing
  useEffect(() => {
    if (open && media) {
      setTitle(media.title || "");
      setDescription(media.description || "");
      setAlbum(media.album || "");
      setVisibility(media.visibility);
      setFeatured(!!media.featured);
      setSaving(false);
      setError("");
    }
  }, [open, media]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !saving) onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose, saving]);

  if (!open || !media) return null;

  const typeAccent = TYPE_ACCENT[media.type];
  const visibilityAccent = VISIBILITY_ACCENT[visibility];
  const TypeIcon = typeAccent?.icon;

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const updated = await mediaService.updateMedia(media.$id, {
        title,
        description,
        album,
        visibility,
        featured,
      });
      onSaved?.(updated);
      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    onDelete?.(media);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border-2 border-gray-200 p-2 transition hover:bg-gray-100 disabled:opacity-50"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">Edit Media</h2>
              <p className="mt-1 text-sm text-gray-400">Update the details for this item.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-xl p-2 transition hover:bg-gray-100 disabled:opacity-50"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Thumbnail + meta */}
          <div className="flex items-center gap-4">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-gray-100">
              {media.type === "image" ? (
                <Image src={media.url} alt={media.title || "Media"} fill className="object-cover" sizes="96px" />
              ) : media.type === "video" ? (
                <>
                  <video src={media.url} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <Play className="h-5 w-5 fill-current text-white" />
                  </div>
                </>
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-100">
                  <Music className="h-9 w-9 text-emerald-500" />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              {typeAccent && (
                <span className={`inline-flex w-fit items-center gap-1.5 rounded-full ${typeAccent.chip} px-3 py-1 text-xs font-bold capitalize text-white`}>
                  <TypeIcon className="h-3.5 w-3.5" />
                  {media.type}
                </span>
              )}
              <span className="text-xs text-gray-400">
                Uploaded {new Date(media.$createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Fields */}
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-900">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Graduation Ceremony"
                className={FIELD_CLASS}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-900">Album</label>
              <input
                type="text"
                value={album}
                onChange={(e) => setAlbum(e.target.value)}
                placeholder="e.g., Graduation 2026"
                className={FIELD_CLASS}
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="mb-2 block text-sm font-bold text-gray-900">Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write something about this memory..."
              className={FIELD_CLASS}
            />
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-900">Visibility</label>
              <div className="relative">
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value as "private" | "public" | "unlisted")}
                  className={`${FIELD_CLASS} appearance-none pr-10`}
                >
                  <option value="private">Private</option>
                  <option value="public">Public</option>
                  <option value="unlisted">Unlisted</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
              {visibilityAccent && (
                <span className={`mt-2 inline-flex items-center gap-1.5 text-xs font-semibold ${visibilityAccent.text}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${visibilityAccent.dot}`} />
                  {visibilityAccent.label}
                </span>
              )}
            </div>

            <div className="flex items-end pb-1">
              <label className="flex cursor-pointer items-center gap-3 select-none">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="h-5 w-5 rounded border-gray-300 accent-[#0f172a]"
                />
                <span className="text-sm font-semibold text-gray-900">Featured</span>
              </label>
            </div>
          </div>

          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">{error}</div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-3 border-t border-gray-100 bg-gray-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={handleDelete}
            disabled={saving}
            className="flex items-center justify-center gap-2 rounded-xl border-2 border-red-200 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>

          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border-2 border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0f172a] to-[#1e3a5f] px-6 py-3 text-sm font-bold text-white transition hover:shadow-lg disabled:opacity-50"
            >
              {saving && <Loader2 className="h-5 w-5 animate-spin" />}
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, Loader2, ArrowLeft, ChevronDown, Trash2, Music, Play, AlertTriangle } from "lucide-react";

import { Media } from "@/types/media";
import { mediaService } from "@/services/media";
import { TYPE_ACCENT, VISIBILITY_ACCENT } from "@/lib/media/media-accent";

interface EditMediaModalProps {
  open: boolean;
  media: Media | null;
  onClose: () => void;
  onSaved?: (media: Media) => void;
  onDelete?: (media: Media) => void | Promise<void>;
}

const FIELD_CLASS =
  "w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-[#FFD700]/60 focus:ring-4 focus:ring-[#FFD700]/10";

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
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
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

export default function EditMediaModal({ open, media, onClose, onSaved, onDelete }: EditMediaModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [album, setAlbum] = useState("");
  const [visibility, setVisibility] = useState<"private" | "public" | "unlisted">("private");
  const [featured, setFeatured] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
      setShowDeleteConfirm(false);
      setIsDeleting(false);
    }
  }, [open, media]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (showDeleteConfirm) {
        if (!isDeleting) setShowDeleteConfirm(false);
        return;
      }
      if (!saving) onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose, saving, showDeleteConfirm, isDeleting]);

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

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const cancelDelete = () => {
    if (isDeleting) return;
    setShowDeleteConfirm(false);
  };

  const confirmDelete = async () => {
    if (!onDelete) return;

    try {
      setIsDeleting(true);
      await onDelete(media);
      setShowDeleteConfirm(false);
      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to delete this item. Please try again.");
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-2xl border border-slate-700 p-2 transition hover:border-slate-600 disabled:opacity-50"
            >
              <ArrowLeft className="h-5 w-5 text-slate-300" />
            </button>
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-white">Edit Media</h2>
              <p className="mt-1 text-sm text-slate-400">Update the details for this item.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-2xl p-2 transition hover:bg-slate-800 disabled:opacity-50"
          >
            <X className="h-6 w-6 text-slate-300" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Thumbnail + meta */}
          <div className="flex items-center gap-4">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-slate-800 border border-slate-700">
              {media.type === "image" ? (
                <Image src={media.url} alt={media.title || "Media"} fill className="object-cover" sizes="96px" />
              ) : media.type === "video" ? (
                <>
                  <video src={media.url} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Play className="h-5 w-5 fill-current text-[#FFD700]" />
                  </div>
                </>
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-emerald-900/30 to-emerald-950/30">
                  <Music className="h-9 w-9 text-emerald-400" />
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
              <span className="text-xs text-slate-500">
                Uploaded {new Date(media.$createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Fields */}
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-bold text-white">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Graduation Ceremony"
                className={FIELD_CLASS}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-white">Album</label>
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
            <label className="mb-2 block text-sm font-bold text-white">Description</label>
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
              <label className="mb-2 block text-sm font-bold text-white">Visibility</label>
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
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
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
                  className="h-5 w-5 rounded border-slate-600 bg-slate-900 accent-[#FFD700]"
                />
                <span className="text-sm font-semibold text-white">Featured</span>
              </label>
            </div>
          </div>

          {error && (
            <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-900/20 p-4 text-sm text-red-300">{error}</div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-3 border-t border-slate-800 bg-slate-950/60 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={handleDeleteClick}
            disabled={saving}
            className="flex items-center justify-center gap-2 rounded-2xl border border-red-500/30 px-5 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-900/20 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>

          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-2xl border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-300 transition hover:border-slate-600 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 border border-[#FFD700]/50 px-6 py-3 text-sm font-bold text-[#FFD700] transition hover:border-[#FFD700] disabled:opacity-50"
            >
              {saving && <Loader2 className="h-5 w-5 animate-spin" />}
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>

      <DeleteMediaDialog
        open={showDeleteConfirm}
        isDeleting={isDeleting}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}
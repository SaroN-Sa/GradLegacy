"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  X,
  Loader2,
  ChevronDown,
  ImageIcon,
  FolderOpen,
  FileText,
  Eye,
  Star,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import MediaUploader from "./MediaUploader";
import { Media } from "@/types/media";
import { mediaService } from "@/services/media";

interface UploadMediaModalProps {
  open: boolean;
  userId: string;
  onClose: () => void;
  onUploaded?: (media: Media[]) => void;
}

const FIELD_CLASS =
  "w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none transition placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-[#FFD700]/60 focus:ring-4 focus:ring-[#FFD700]/10";

export default function UploadMediaModal({ open, userId, onClose, onUploaded }: UploadMediaModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [album, setAlbum] = useState("");
  const [visibility, setVisibility] = useState<"private" | "public" | "unlisted">("private");
  const [featured, setFeatured] = useState(false);
  const [uploadedMedia, setUploadedMedia] = useState<Media[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      setTitle("");
      setDescription("");
      setAlbum("");
      setVisibility("private");
      setFeatured(false);
      setUploadedMedia([]);
      setSaving(false);
      setError("");
    }
  }, [open]);

  // Lock body scroll while the modal is open (mobile-friendly)
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  if (!open) return null;

  const handleUploadComplete = (media: Media[]) => {
    setUploadedMedia(media);
  };

  const handleSave = async () => {
    if (!uploadedMedia.length) {
      setError("Please upload at least one file.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const updatedMedia: Media[] = [];
      for (const item of uploadedMedia) {
        const updated = await mediaService.updateMedia(item.$id, {
          title: title || item.title,
          description: description || item.description,
          album: album || item.album,
          visibility: visibility || item.visibility,
          featured,
        });
        updatedMedia.push(updated);
      }
      onUploaded?.(updatedMedia);
      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to save media details.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-0 backdrop-blur-sm sm:p-4">
      <div className="relative flex h-[100dvh] w-full max-w-lg flex-col overflow-hidden rounded-none bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 border-0 shadow-2xl sm:h-auto sm:max-h-[85vh] sm:rounded-3xl sm:border sm:border-slate-200 sm:dark:border-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-4 py-3.5 sm:px-6 sm:py-4">
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Back button — primary nav affordance on mobile */}
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              aria-label="Back"
              className="-ml-1.5 rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white sm:hidden"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFD700]/10 text-[#B8860B] dark:text-[#FFD700] sm:h-9 sm:w-9">
              <ImageIcon size={16} className="sm:hidden" />
              <ImageIcon size={17} className="hidden sm:block" />
            </div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white sm:text-base">Upload Media</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close"
            className="hidden rounded-full p-1.5 text-slate-400 dark:text-slate-400 transition hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white disabled:opacity-50 sm:block"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:space-y-5 sm:px-6 sm:py-5">
          <MediaUploader userId={userId} multiple onUploadComplete={handleUploadComplete} onError={setError} />

          {uploadedMedia.length > 0 && (
            <>
              <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-300 dark:border-emerald-500/30 px-4 py-2.5 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 size={14} className="shrink-0" />
                {uploadedMedia.length} file{uploadedMedia.length > 1 ? "s" : ""} uploaded — add details below.
              </div>

              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <FileText size={12} />
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Graduation Ceremony"
                  className={FIELD_CLASS}
                />
              </div>

              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <FolderOpen size={12} />
                  Album
                </label>
                <input
                  type="text"
                  value={album}
                  onChange={(e) => setAlbum(e.target.value)}
                  placeholder="e.g., Graduation 2026"
                  className={FIELD_CLASS}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-slate-400">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Write something about these memories..."
                  className={`${FIELD_CLASS} resize-none`}
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                    <Eye size={12} />
                    Visibility
                  </label>
                  <div className="relative">
                    <select
                      value={visibility}
                      onChange={(e) => setVisibility(e.target.value as "private" | "public" | "unlisted")}
                      className={`${FIELD_CLASS} appearance-none pr-8`}
                    >
                      <option value="private">Private</option>
                      <option value="public">Public</option>
                      <option value="unlisted">Unlisted</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                    <Star size={12} />
                    Featured
                  </label>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={featured}
                    onClick={() => setFeatured((prev) => !prev)}
                    className={`flex h-[42px] w-full items-center justify-between rounded-2xl border px-4 text-sm font-medium transition-colors ${
                      featured
                        ? "border-[#FFD700]/50 bg-[#FFD700]/10 text-[#B8860B] dark:text-[#FFD700]"
                        : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {featured ? "Yes" : "No"}
                    <span
                      className={`relative h-5 w-9 rounded-full transition-colors ${
                        featured ? "bg-[#FFD700]" : "bg-slate-300 dark:bg-slate-700"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white dark:bg-slate-950 transition-transform ${
                          featured ? "translate-x-4" : "translate-x-0.5"
                        }`}
                      />
                    </span>
                  </button>
                </div>
              </div>
            </>
          )}

          {error && (
            <div className="flex items-center gap-2 rounded-2xl border border-red-300 dark:border-red-500/30 bg-red-50 dark:bg-red-900/20 px-4 py-2.5 text-xs text-red-600 dark:text-red-300">
              <AlertCircle size={14} className="shrink-0" />
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60 px-4 py-3.5 sm:px-6 sm:py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="flex-1 rounded-2xl border border-slate-300 dark:border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 transition hover:border-slate-400 dark:hover:border-slate-600 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none sm:py-2"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving || uploadedMedia.length === 0}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 border border-[#FFD700]/50 px-4 py-2.5 text-sm font-semibold text-[#B8860B] dark:text-[#FFD700] transition hover:border-[#FFD700] disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none sm:py-2"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {saving ? "Saving…" : "Save Media"}
          </button>
        </div>
      </div>
    </div>
  );
}
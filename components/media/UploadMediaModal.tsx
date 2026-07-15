"use client";

import { useEffect, useState } from "react";
import { X, Loader2, ArrowLeft, ChevronDown } from "lucide-react";

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
  "w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-[#FFD700]/60 focus:ring-4 focus:ring-[#FFD700]/10";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 shadow-2xl">
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
              <h2 className="text-2xl font-extrabold tracking-tight text-white">Upload Media</h2>
              <p className="mt-1 text-sm text-slate-400">Upload images, videos or audio files to your gallery.</p>
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
          <MediaUploader userId={userId} multiple onUploadComplete={handleUploadComplete} onError={setError} />

          {uploadedMedia.length > 0 && (
            <>
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
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Write something about these memories..."
                  className={FIELD_CLASS}
                />
              </div>

              <div className="mt-6">
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
              </div>

              <label className="mt-6 flex cursor-pointer items-center gap-3 select-none">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="h-5 w-5 rounded border-slate-600 bg-slate-900 accent-[#FFD700]"
                />
                <span className="text-sm font-semibold text-white">Mark uploaded media as Featured</span>
              </label>

              <div className="mt-6 rounded-2xl border border-[#FFD700]/30 bg-[#FFD700]/5 p-4">
                <h3 className="text-sm font-bold text-white">Upload Complete</h3>
                <p className="mt-1 text-sm text-slate-300">
                  {uploadedMedia.length} media {uploadedMedia.length > 1 ? "files have" : "file has"} been uploaded
                  successfully.
                </p>
                <p className="mt-1 text-xs text-slate-500">Fill in the details above and click Save to finalize.</p>
              </div>
            </>
          )}

          {error && (
            <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-900/20 p-4 text-sm text-red-300">{error}</div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-3 border-t border-slate-800 bg-slate-950/60 px-6 py-5 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-2xl border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-300 transition hover:border-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving || uploadedMedia.length === 0}
            className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 border border-[#FFD700]/50 px-6 py-3 text-sm font-bold text-[#FFD700] transition hover:border-[#FFD700] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving && <Loader2 className="h-5 w-5 animate-spin" />}
            {saving ? "Saving…" : "Save Media"}
          </button>
        </div>
      </div>
    </div>
  );
}
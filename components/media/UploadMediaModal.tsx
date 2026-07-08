"use client";

import { useEffect, useState } from "react";
import { X, Loader2, ArrowLeft } from "lucide-react";

import MediaUploader from "./MediaUploader";

import { Media } from "@/types/media";
import { mediaService } from "@/services/media";

interface UploadMediaModalProps {
  open: boolean;
  userId: string;
  onClose: () => void;
  onUploaded?: (media: Media[]) => void;
}

export default function UploadMediaModal({
  open,
  userId,
  onClose,
  onUploaded,
}: UploadMediaModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [album, setAlbum] = useState("");
  const [visibility, setVisibility] = useState<
    "private" | "public" | "unlisted"
  >("private");
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
          featured: featured,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-5">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-gray-300 p-2 transition hover:bg-gray-100 disabled:opacity-50"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-[#0f172a]">
                Upload Media
              </h2>
              <p className="mt-1 text-sm text-gray-400">
                Upload images, videos or audio files to your gallery.
              </p>
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
          <MediaUploader
            userId={userId}
            multiple
            onUploadComplete={handleUploadComplete}
            onError={setError}
          />

          {uploadedMedia.length > 0 && (
            <>
              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                {/* Title */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#0f172a]">
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Graduation Ceremony"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[#0f172a] outline-none transition placeholder:text-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
                  />
                </div>

                {/* Album */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#0f172a]">
                    Album
                  </label>
                  <input
                    type="text"
                    value={album}
                    onChange={(e) => setAlbum(e.target.value)}
                    placeholder="e.g., Graduation 2026"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[#0f172a] outline-none transition placeholder:text-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <label className="mb-2 block text-sm font-semibold text-[#0f172a]">
                  Description
                </label>
                <textarea
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Write something about these memories..."
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[#0f172a] outline-none transition placeholder:text-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
                />
              </div>

              {/* Visibility */}
              <div className="mt-6">
                <label className="mb-2 block text-sm font-semibold text-[#0f172a]">
                  Visibility
                </label>
                <div className="relative">
                  <select
                    value={visibility}
                    onChange={(e) =>
                      setVisibility(
                        e.target.value as "private" | "public" | "unlisted"
                      )
                    }
                    className="w-full appearance-none rounded-xl border border-gray-200 px-4 py-3 text-[#0f172a] outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
                  >
                    <option value="private">Private</option>
                    <option value="public">Public</option>
                    <option value="unlisted">Unlisted</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Featured */}
              <div className="mt-6 flex items-center gap-3">
                <input
                  id="featured"
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="h-5 w-5 rounded border-gray-300 text-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
                />
                <label htmlFor="featured" className="text-sm font-medium text-[#0f172a]">
                  Mark uploaded media as Featured
                </label>
              </div>

              {/* Upload Summary */}
              <div className="mt-6 rounded-xl border border-yellow-400/30 bg-yellow-50 p-4">
                <h3 className="text-sm font-semibold text-[#0f172a]">
                  Upload Complete
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  {uploadedMedia.length} media
                  {uploadedMedia.length > 1 ? " files have" : " file has"} been
                  uploaded successfully.
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Fill in the details above and click Save to finalize.
                </p>
              </div>
            </>
          )}

          {/* Error */}
          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-3 border-t bg-gray-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-xl border border-gray-200 px-6 py-3 font-medium text-[#0f172a] transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving || uploadedMedia.length === 0}
            className="flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-6 py-3 font-medium text-[#0f172a] transition hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving && <Loader2 className="h-5 w-5 animate-spin" />}
            {saving ? "Saving..." : "Save Media"}
          </button>
        </div>
      </div>
    </div>
  );
}
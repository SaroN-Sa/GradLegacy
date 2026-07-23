"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Music, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

import { mediaService } from "@/services/media";
import { CreateMedia, Media } from "@/types/media";

interface MediaUploaderProps {
  userId: string;
  multiple?: boolean;
  maxFiles?: number;
  maxFileSize?: number;
  accept?: string;
  className?: string;
  onUploadComplete?: (media: Media[]) => void;
  onError?: (message: string) => void;
}

interface SelectedFile {
  id: string;
  file: File;
  preview: string;
  progress: number;
  uploading: boolean;
  uploaded: boolean;
  error?: string;
}

export default function MediaUploader({
  userId,
  multiple = true,
  maxFiles = 20,
  maxFileSize = 100 * 1024 * 1024,
  accept = "image/*,video/*,audio/*",
  className = "",
  onUploadComplete,
  onError,
}: MediaUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<SelectedFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const acceptedTypes = useMemo(() => accept.split(",").map((item) => item.trim()), [accept]);

  const generateId = () => `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

  const validateFile = (file: File): string | null => {
    if (file.size > maxFileSize) {
      return `File "${file.name}" exceeds the maximum size.`;
    }
    const valid = acceptedTypes.some((type) => {
      if (type.endsWith("/*")) return file.type.startsWith(type.replace("/*", "/"));
      return file.type === type;
    });
    if (!valid) return `"${file.name}" is not a supported file type.`;
    return null;
  };

  const createPreview = (file: File) => URL.createObjectURL(file);

  const addFiles = useCallback(
    (selectedFiles: File[]) => {
      const currentCount = files.length;
      if (currentCount >= maxFiles) {
        onError?.(`Maximum of ${maxFiles} files allowed.`);
        return;
      }
      const remaining = maxFiles - currentCount;
      const nextFiles = selectedFiles.slice(0, remaining);
      const prepared: SelectedFile[] = [];

      for (const file of nextFiles) {
        const error = validateFile(file);
        prepared.push({
          id: generateId(),
          file,
          preview: createPreview(file),
          progress: 0,
          uploading: false,
          uploaded: false,
          error: error ?? undefined,
        });
      }

      setFiles((prev) => [...prev, ...prepared]);
    },
    [files.length, maxFiles, maxFileSize, onError]
  );

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const file = prev.find((item) => item.id === id);
      if (file) URL.revokeObjectURL(file.preview);
      return prev.filter((item) => item.id !== id);
    });
  };

  const clearFiles = () => {
    files.forEach((item) => URL.revokeObjectURL(item.preview));
    setFiles([]);
  };

  const openPicker = () => inputRef.current?.click();

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? []);
    if (!selected.length) return;
    addFiles(selected);
    event.target.value = "";
  };

  const updateProgress = (id: string, progress: number, uploading: boolean, uploaded: boolean, error?: string) => {
    setFiles((prev) =>
      prev.map((item) => (item.id === id ? { ...item, progress, uploading, uploaded, error } : item))
    );
  };

  const uploadSingleFile = async (selectedFile: SelectedFile): Promise<Media | null> => {
    try {
      updateProgress(selectedFile.id, 10, true, false);

      const formData = new FormData();
      formData.append("file", selectedFile.file);
      formData.append("userId", userId);

      const response = await fetch("/api/media/upload", { method: "POST", body: formData });
      if (!response.ok) throw new Error("Upload failed.");

      updateProgress(selectedFile.id, 60, true, false);

      const result = await response.json();
      if (!result.success) throw new Error(result.error || "Upload failed.");
      if (!result.media || !result.media.publicId) {
        throw new Error("Upload response missing publicId");
      }

      const mediaData: CreateMedia = {
        userId,
        uploadedBy: userId,
        title: selectedFile.file.name,
        description: "",
        type: result.media.type,
        url: result.media.url,
        publicId: result.media.publicId,
        visibility: "private",
        album: "",
        featured: false,
        status: "active",
      };

      const media = await mediaService.createMedia(mediaData);
      updateProgress(selectedFile.id, 100, false, true);
      return media;
    } catch (error) {
      console.error("Upload error:", error);
      updateProgress(selectedFile.id, 0, false, false, error instanceof Error ? error.message : "Upload failed.");
      return null;
    }
  };

  const uploadFiles = async () => {
    const validFiles = files.filter((file) => !file.error && !file.uploaded);
    if (!validFiles.length) return;

    setUploading(true);
    try {
      const uploadedMedia: Media[] = [];
      for (const file of validFiles) {
        const media = await uploadSingleFile(file);
        if (media) uploadedMedia.push(media);
      }
      if (uploadedMedia.length && onUploadComplete) onUploadComplete(uploadedMedia);
    } finally {
      setUploading(false);
    }
  };

  const onDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragging(true);
  };

  const onDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragging(false);
  };

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragging(false);
    const droppedFiles = Array.from(event.dataTransfer.files);
    if (!droppedFiles.length) return;
    addFiles(droppedFiles);
  };

  const hasFiles = files.length > 0;
  const hasErrors = files.some((file) => !!file.error);
  const completedUploads = files.filter((file) => file.uploaded).length;
  const pendingUploads = files.filter((file) => !file.uploaded && !file.error).length;

  return (
    <div className={`w-full ${className}`}>
      <div
        onClick={openPicker}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        className={`cursor-pointer rounded-2xl sm:rounded-3xl border-2 border-dashed p-6 sm:p-8 md:p-10 transition-all duration-200 ${
          dragging
            ? "border-[#FFD700] bg-[#FFD700]/5"
            : "border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/40 hover:border-[#FFD700]/50 hover:bg-slate-100/60 dark:hover:bg-slate-900/70"
        }`}
      >
        <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 text-center">
          <Upload className="h-9 w-9 sm:h-12 sm:w-12 text-[#B8860B] dark:text-[#FFD700]" />
          <div>
            <h3 className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">Upload Media</h3>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              <span className="sm:hidden">Tap to browse files.</span>
              <span className="hidden sm:inline">Drag & drop files here, or click to browse.</span>
            </p>
            <p className="mt-2 text-[11px] sm:text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
              Images • Videos • Audio
            </p>
          </div>
        </div>
        <input ref={inputRef} hidden multiple={multiple} type="file" accept={accept} onChange={onInputChange} />
      </div>

      {hasFiles && (
        <>
          <div className="mt-6 sm:mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {files.map((item) => (
              <div
                key={item.id}
                className="overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 shadow-lg shadow-black/5 dark:shadow-black/20"
              >
                <div className="relative aspect-video bg-slate-100 dark:bg-slate-800">
                  {item.file.type.startsWith("image/") ? (
                    <Image
                      src={item.preview}
                      alt={item.file.name}
                      fill
                      className="object-cover"
                      sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                    />
                  ) : item.file.type.startsWith("video/") ? (
                    <video src={item.preview} controls className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900/30 dark:to-emerald-950/30">
                      <Music className="h-10 w-10 sm:h-14 sm:w-14 text-emerald-600 dark:text-emerald-400" />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(item.id);
                    }}
                    className="absolute right-2 top-2 sm:right-3 sm:top-3 rounded-full bg-white/90 dark:bg-slate-950/90 p-2 shadow transition hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-700"
                  >
                    <X className="h-4 w-4 text-slate-500 dark:text-slate-300" />
                  </button>
                </div>

                <div className="space-y-2.5 sm:space-y-3 p-3.5 sm:p-4">
                  <div>
                    <p className="truncate text-sm font-bold text-slate-900 dark:text-white">{item.file.name}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{(item.file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>

                  {item.error && (
                    <div className="flex items-center gap-2 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-500/30 p-3 text-sm text-red-600 dark:text-red-300">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{item.error}</span>
                    </div>
                  )}

                  {item.uploading && (
                    <div className="space-y-2">
                      <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                        <div className="h-full bg-[#FFD700] transition-all" style={{ width: `${item.progress}%` }} />
                      </div>
                      <p className="text-xs text-slate-400 dark:text-slate-500">Uploading…</p>
                    </div>
                  )}

                  {item.uploaded && (
                    <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-300 dark:border-emerald-500/30 p-3 text-sm font-semibold text-emerald-600 dark:text-emerald-300">
                      <CheckCircle2 className="h-4 w-4" />
                      Upload complete
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 sm:mt-8 flex flex-col items-stretch sm:items-center justify-between gap-4 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 p-4 sm:p-5 md:flex-row">
            <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              <span>
                Selected <strong className="text-slate-900 dark:text-white">{files.length}</strong>
              </span>
              <span>
                Ready <strong className="text-slate-900 dark:text-white">{pendingUploads}</strong>
              </span>
              <span>
                Uploaded <strong className="text-slate-900 dark:text-white">{completedUploads}</strong>
              </span>
              {hasErrors && <span className="font-semibold text-red-600 dark:text-red-400">Some files contain errors</span>}
            </div>

            <div className="grid grid-cols-2 gap-3 sm:flex sm:shrink-0">
              <button
                type="button"
                onClick={clearFiles}
                disabled={uploading}
                className="rounded-2xl border border-slate-300 dark:border-slate-700 px-4 sm:px-5 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 transition hover:border-slate-400 dark:hover:border-slate-600 disabled:opacity-50"
              >
                Clear
              </button>
              <button
                type="button"
                disabled={uploading || pendingUploads === 0}
                onClick={uploadFiles}
                className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 border border-[#FFD700]/50 px-4 sm:px-5 py-2.5 text-sm font-bold text-[#B8860B] dark:text-[#FFD700] transition hover:border-[#FFD700] disabled:opacity-50"
              >
                {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
                {uploading ? "Uploading…" : "Upload Media"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
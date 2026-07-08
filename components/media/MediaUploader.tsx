"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  Upload,
  X,
  Image as ImageIcon,
  Video,
  Music,
  Loader2,
  AlertCircle,
} from "lucide-react";

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

  const acceptedTypes = useMemo(
    () => accept.split(",").map((item) => item.trim()),
    [accept]
  );

  const generateId = () =>
    `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return <ImageIcon className="h-6 w-6" />;
    }
    if (file.type.startsWith("video/")) {
      return <Video className="h-6 w-6" />;
    }
    return <Music className="h-6 w-6" />;
  };

  const validateFile = (file: File): string | null => {
    if (file.size > maxFileSize) {
      return `File "${file.name}" exceeds the maximum size.`;
    }
    const valid = acceptedTypes.some((type) => {
      if (type.endsWith("/*")) {
        return file.type.startsWith(type.replace("/*", "/"));
      }
      return file.type === type;
    });
    if (!valid) {
      return `"${file.name}" is not a supported file type.`;
    }
    return null;
  };

  const createPreview = (file: File) => {
    return URL.createObjectURL(file);
  };

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
      if (file) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  const clearFiles = () => {
    files.forEach((item) => {
      URL.revokeObjectURL(item.preview);
    });
    setFiles([]);
  };

  const openPicker = () => {
    inputRef.current?.click();
  };

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? []);
    if (!selected.length) return;
    addFiles(selected);
    event.target.value = "";
  };

  const updateProgress = (
    id: string,
    progress: number,
    uploading: boolean,
    uploaded: boolean,
    error?: string
  ) => {
    setFiles((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, progress, uploading, uploaded, error }
          : item
      )
    );
  };

  const uploadSingleFile = async (selectedFile: SelectedFile): Promise<Media | null> => {
  try {
    updateProgress(selectedFile.id, 10, true, false);

    const formData = new FormData();
    formData.append("file", selectedFile.file);
    formData.append("userId", userId);

    const response = await fetch("/api/media/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Upload failed.");
    }

    updateProgress(selectedFile.id, 60, true, false);

    const result = await response.json();
    
    // Log the response to see what's coming back
    console.log("Upload API response:", result);

    if (!result.success) {
      throw new Error(result.error || "Upload failed.");
    }

    // Ensure we have the publicId
    if (!result.media || !result.media.publicId) {
      console.error("Missing publicId in response:", result);
      throw new Error("Upload response missing publicId");
    }

    // Create media data
    const mediaData: CreateMedia = {
      userId,
      uploadedBy: userId,
      title: selectedFile.file.name,
      description: "",
      type: result.media.type,
      url: result.media.url,
      publicId: result.media.publicId, // This must be present
      visibility: "private",
      album: "",
      featured: false,
      status: "active",
    };

    console.log("Creating media with data:", mediaData);

    const media = await mediaService.createMedia(mediaData);

    updateProgress(selectedFile.id, 100, false, true);
    return media;
  } catch (error) {
    console.error("Upload error:", error);
    updateProgress(
      selectedFile.id,
      0,
      false,
      false,
      error instanceof Error ? error.message : "Upload failed."
    );
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
        if (media) {
          uploadedMedia.push(media);
        }
      }

      if (uploadedMedia.length && onUploadComplete) {
        onUploadComplete(uploadedMedia);
      }
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
        className={`cursor-pointer rounded-xl border-2 border-dashed p-10 transition-all duration-200 ${
          dragging
            ? "border-[#0f172a] bg-[#0f172a]/5"
            : "border-gray-300 hover:border-[#0f172a]/60 hover:bg-gray-50"
        }`}
      >
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <Upload className="h-12 w-12 text-[#0f172a]" />
          <div>
            <h3 className="text-lg font-semibold">Upload Media</h3>
            <p className="mt-1 text-sm text-gray-500">
              Drag & Drop files here or click to browse.
            </p>
            <p className="mt-2 text-xs text-gray-400">
              Images • Videos • Audio
            </p>
          </div>
        </div>
        <input
          ref={inputRef}
          hidden
          multiple={multiple}
          type="file"
          accept={accept}
          onChange={onInputChange}
        />
      </div>

      {hasFiles && (
        <>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {files.map((item) => (
              <div
                key={item.id}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
              >
                <div className="relative aspect-video bg-gray-100">
                  {item.file.type.startsWith("image/") ? (
                    <Image
                      src={item.preview}
                      alt={item.file.name}
                      fill
                      className="object-cover"
                      sizes="(max-width:768px) 100vw, 33vw"
                    />
                  ) : item.file.type.startsWith("video/") ? (
                    <video
                      src={item.preview}
                      controls
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Music className="h-14 w-14 text-gray-400" />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(item.id);
                    }}
                    className="absolute right-3 top-3 rounded-full bg-white p-2 shadow"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-3 p-4">
                  <div>
                    <p className="truncate font-medium">{item.file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(item.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>

                  {item.error && (
                    <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                      <AlertCircle className="h-4 w-4" />
                      <span>{item.error}</span>
                    </div>
                  )}

                  {item.uploading && (
                    <div className="space-y-2">
                      <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                        <div
                          className="h-full bg-[#0f172a] transition-all"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500">Uploading...</p>
                    </div>
                  )}

                  {item.uploaded && (
                    <div className="rounded-lg bg-green-50 p-3 text-sm font-medium text-green-700">
                      Upload completed
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-xl border border-gray-200 bg-gray-50 p-5 md:flex-row">
            <div className="text-sm text-gray-600">
              <p>
                Selected: <strong>{files.length}</strong>
              </p>
              <p>
                Ready: <strong>{pendingUploads}</strong>
              </p>
              <p>
                Uploaded: <strong>{completedUploads}</strong>
              </p>
              {hasErrors && <p className="text-red-600">Some files contain errors.</p>}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={clearFiles}
                disabled={uploading}
                className="rounded-lg border border-gray-200 px-5 py-2 text-sm font-medium hover:bg-gray-100 disabled:opacity-50"
              >
                Clear
              </button>
              <button
                type="button"
                disabled={uploading || pendingUploads === 0}
                onClick={uploadFiles}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#0f172a] to-[#1e3a5f] px-5 py-2 text-sm font-medium text-white hover:shadow-lg disabled:opacity-50"
              >
                {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
                {uploading ? "Uploading..." : "Upload Media"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
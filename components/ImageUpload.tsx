"use client";

import { useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";

interface Props {
  onUpload: (url: string) => void;
  className?: string;
  iconSize?: number;
}

export default function ImageUpload({
  onUpload,
  className = "",
  iconSize = 20,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const formData = new FormData();

    formData.append("file", file);

    try {
      setLoading(true);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      onUpload(data.url);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleUpload}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={`flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-gray-200 transition hover:scale-105 hover:bg-blue-600 hover:text-white ${className}`}
      >
        {loading ? (
          <Loader2
            size={iconSize}
            className="animate-spin"
          />
        ) : (
          <Camera size={iconSize} />
        )}
      </button>
    </>
  );
}
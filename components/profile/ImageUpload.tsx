"use client";

import { useState } from "react";

interface Props {
  label: string;
  onUpload: (url: string) => void;
}

export default function ImageUpload({
  label,
  onUpload,
}: Props) {
  const [loading, setLoading] =
    useState(false);

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    const formData =
      new FormData();

    formData.append(
      "file",
      file
    );

    try {
      setLoading(true);

      const response =
        await fetch(
          "/api/upload",
          {
            method: "POST",
            body: formData,
          }
        );

      const data =
        await response.json();

      onUpload(data.url);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block font-medium">
        {label}
      </label>

      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
      />

      {loading && (
        <p>
          Uploading...
        </p>
      )}
    </div>
  );
}
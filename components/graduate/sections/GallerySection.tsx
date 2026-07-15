"use client";

import { Globe } from "lucide-react";

interface GallerySectionProps {
  graduateName: string;
}

export default function GallerySection({
  graduateName,
}: GallerySectionProps) {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-xl shadow-black/20">

      {/* Header */}

      <div className="border-b border-gray-100 px-7 py-6">

        <div className="flex items-center gap-2">

          <Globe
            size={17}
            className="text-[#0f172a]"
          />

          <h2 className="text-lg font-bold text-gray-900">
            Graduation Gallery
          </h2>

        </div>

        <p className="mt-2 text-sm text-gray-500">
          Browse photos and videos shared by{" "}
          <span className="font-semibold">
            {graduateName}
          </span>
          .
        </p>

      </div>

      {/* Content */}

      <div className="px-7 py-12 text-center">

        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">

          <Globe
            size={30}
            className="text-gray-400"
          />

        </div>

        <h3 className="text-lg font-semibold text-gray-900">
          No Gallery Yet
        </h3>

        <p className="mt-2 text-sm text-gray-500">
          {graduateName} hasn't published any
          photos or videos yet.
        </p>

      </div>

    </div>
  );
}
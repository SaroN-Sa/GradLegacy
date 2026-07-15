"use client";

import Image from "next/image";

import { Wish } from "@/types/wish";
import ReactionBar from "./ReactionBar";

interface WishCardProps {
  wish: Wish;
  showActions?: boolean;
  onPublish?: (wishId: string) => void;
  onHide?: (wishId: string) => void;
  onDelete?: (wishId: string) => void;
  onFeature?: (wishId: string) => void;
}

export default function WishCard({
  wish,
  showActions = false,
  onPublish,
  onHide,
  onDelete,
  onFeature,
}: WishCardProps) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">

      {(wish.imageUrl || wish.videoUrl) && (
        <div className="relative">

          {wish.imageUrl && (
            <div className="relative h-72 w-full">
              <Image
                src={wish.imageUrl}
                alt="Wish Image"
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
          )}

          {wish.videoUrl && (
            <video
              controls
              className="w-full"
            >
              <source
                src={wish.videoUrl}
                type="video/mp4"
              />
            </video>
          )}
        </div>
      )}

      <div className="space-y-4 p-6">

        <div className="flex items-center justify-between">

          <div>
            <h3 className="text-lg font-semibold">

              {wish.isAnonymous
                ? "Anonymous"
                : wish.visitorName}

            </h3>

            <p className="text-sm text-gray-500 capitalize">
              {wish.relationship}
            </p>
          </div>

          {wish.isFeatured && (
            <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
              Featured
            </span>
          )}

        </div>

        <p className="whitespace-pre-line text-gray-700">
          {wish.message}
        </p>

        <div className="text-xs text-gray-500">

          {new Date(
            wish.createdAt
          ).toLocaleDateString()}

        </div>

        <ReactionBar wishId={wish.$id} />
                {showActions && (

          <div className="flex flex-wrap gap-3 border-t pt-4">

            {wish.status === "pending" && (
              <button
                onClick={() =>
                  onPublish?.(wish.$id)
                }
                className="rounded-lg bg-green-600 px-4 py-2 text-white"
              >
                Publish
              </button>
            )}

            {wish.status === "published" && (
              <>
                <button
                  onClick={() =>
                    onHide?.(wish.$id)
                  }
                  className="rounded-lg bg-yellow-500 px-4 py-2 text-white"
                >
                  Hide
                </button>

                <button
                  onClick={() =>
                    onFeature?.(wish.$id)
                  }
                  className="rounded-lg bg-blue-600 px-4 py-2 text-white"
                >
                  {wish.isFeatured
                    ? "Remove Feature"
                    : "Feature"}
                </button>
              </>
            )}

            <button
              onClick={() =>
                onDelete?.(wish.$id)
              }
              className="rounded-lg bg-red-600 px-4 py-2 text-white"
            >
              Delete
            </button>

          </div>

        )}

      </div>
    </div>
  );
}
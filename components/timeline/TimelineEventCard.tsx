"use client";

import Image from "next/image";

import { TimelineEvent } from "@/types/timeline";

interface TimelineCardProps {
  event: TimelineEvent;
  onEdit: (event: TimelineEvent) => void;
  onDelete: (eventId: string) => void;
}

const categoryIcons = {
  education: "🎓",
  internship: "💼",
  achievement: "🏆",
  graduation: "🎉",
  other: "📌",
};

export default function TimelineCard({
  event,
  onEdit,
  onDelete,
}: TimelineCardProps) {
  return (
    <div className="relative rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">

      {/* Timeline Dot */}
      <div className="absolute -left-3 top-8 h-6 w-6 rounded-full border-4 border-white bg-blue-600 shadow" />

      <div className="p-6">

        {/* Header */}
        <div className="flex items-start justify-between">

          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {categoryIcons[event.category]} {event.title}
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              {new Date(event.date).toLocaleDateString()}
            </p>
          </div>

          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              event.status === "published"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {event.status}
          </span>
        </div>

        {/* Image */}
        {event.image && (
          <div className="relative mt-5 h-60 w-full overflow-hidden rounded-lg">
            <Image
              src={event.image}
              alt={event.title}
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
        )}

        {/* Description */}
        <p className="mt-5 text-gray-700 whitespace-pre-line">
          {event.description}
        </p>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between">

          <div>
            {event.location && (
              <span className="text-sm text-gray-500">
                📍 {event.location}
              </span>
            )}
          </div>

          <div className="flex gap-2">

            <button
              onClick={() => onEdit(event)}
              className="rounded-lg border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
            >
              Edit
            </button>

            <button
              onClick={() => onDelete(event.$id)}
              className="rounded-lg border border-red-600 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              Delete
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}
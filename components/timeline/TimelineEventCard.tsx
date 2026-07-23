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
    <div className="relative rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition hover:shadow-md dark:hover:shadow-black/20">

      {/* Timeline Dot — assumes a left rail from the parent list; hidden on
          mobile where that rail is typically collapsed. Adjust/remove the
          sm: prefix if your mobile layout keeps the rail. */}
      <div className="hidden sm:block absolute -left-3 top-8 h-6 w-6 rounded-full border-4 border-white dark:border-slate-950 bg-blue-600 shadow" />

      <div className="p-4 sm:p-6">

        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

          <div className="min-w-0">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white break-words">
              {categoryIcons[event.category]} {event.title}
            </h3>

            <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
              {new Date(event.date).toLocaleDateString()}
            </p>
          </div>

          <span
            className={`self-start shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
              event.status === "published"
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
            }`}
          >
            {event.status}
          </span>
        </div>

        {/* Image */}
        {event.image && (
          <div className="relative mt-4 sm:mt-5 h-44 sm:h-60 w-full overflow-hidden rounded-lg">
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
        <p className="mt-4 sm:mt-5 text-sm sm:text-base text-gray-700 dark:text-slate-300 whitespace-pre-line">
          {event.description}
        </p>

        {/* Footer */}
        <div className="mt-5 sm:mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div>
            {event.location && (
              <span className="text-sm text-gray-500 dark:text-slate-400">
                📍 {event.location}
              </span>
            )}
          </div>

          <div className="flex gap-2">

            <button
              onClick={() => onEdit(event)}
              className="flex-1 sm:flex-none rounded-lg border border-blue-600 dark:border-blue-500 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 transition hover:bg-blue-50 dark:hover:bg-blue-500/10"
            >
              Edit
            </button>

            <button
              onClick={() => onDelete(event.$id)}
              className="flex-1 sm:flex-none rounded-lg border border-red-600 dark:border-red-500 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 transition hover:bg-red-50 dark:hover:bg-red-500/10"
            >
              Delete
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}
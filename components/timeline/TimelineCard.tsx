"use client";

import Image from "next/image";
import { Pencil, Trash2, MapPin } from "lucide-react";
import { TimelineEvent, TimelineCategory } from "@/types/timeline";

interface TimelineCardProps {
  event: TimelineEvent;
  onEdit: (event: TimelineEvent) => void;
  onDelete: (eventId: string) => void;
}

const CATEGORY_ICONS: Record<TimelineCategory, string> = {
  education: "🎓",
  internship: "💼",
  achievement: "🏆",
  graduation: "🎉",
  other: "📌",
};

const CATEGORY_COLORS: Record<TimelineCategory, string> = {
  education: "text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-900/20",
  internship: "text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-900/20",
  achievement: "text-[#B8860B] dark:text-[#FFD700] border-[#FFD700]/40 dark:border-[#FFD700]/30 bg-[#FFD700]/10",
  graduation: "text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-500/30 bg-purple-50 dark:bg-purple-900/20",
  other: "text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600/30 bg-slate-100 dark:bg-slate-800/40",
};

export default function TimelineCard({
  event,
  onEdit,
  onDelete,
}: TimelineCardProps) {
  return (
    <div className="relative rounded-2xl sm:rounded-3xl border border-gray-200 dark:border-slate-800 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 transition-all duration-200 hover:border-gray-300 dark:hover:border-slate-700 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20">
      {/* Timeline Dot — assumes a left rail from the parent list; hidden on
          mobile where that rail is typically collapsed. Adjust/remove the
          sm: prefix if your mobile layout keeps the rail. */}
      <span className="hidden sm:block absolute -left-[41px] top-8 h-4 w-4 rounded-full bg-[#FFD700] ring-4 ring-white dark:ring-slate-950" />

      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border mb-2 ${CATEGORY_COLORS[event.category]}`}
            >
              {CATEGORY_ICONS[event.category]}{" "}
              {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
            </span>

            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white break-words">
              {event.title}
            </h3>

            <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
              {new Date(event.date).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <span
            className={`self-start shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
              event.status === "published"
                ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
            }`}
          >
            {event.status}
          </span>
        </div>

        {/* Image */}
        {event.image && (
          <div className="relative mt-4 sm:mt-5 h-44 sm:h-56 w-full overflow-hidden rounded-xl sm:rounded-2xl border border-gray-200 dark:border-slate-800">
            <Image
              src={event.image}
              alt={event.title}
              fill
              sizes="(max-width: 768px) 100vw, 600px"
              className="object-cover"
            />
          </div>
        )}

        {/* Description */}
        <p className="mt-4 sm:mt-5 text-sm leading-relaxed text-gray-600 dark:text-slate-300 whitespace-pre-line">
          {event.description}
        </p>

        {/* Footer */}
        <div className="mt-5 sm:mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {event.location && (
              <span className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-slate-500">
                <MapPin size={13} className="shrink-0" />
                {event.location}
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onEdit(event)}
              className="flex flex-1 sm:flex-none items-center justify-center gap-1.5 rounded-xl sm:rounded-2xl border border-gray-300 dark:border-slate-700 px-3.5 py-2 text-xs font-medium text-gray-600 dark:text-slate-300 transition-colors hover:border-[#FFD700]/50 hover:text-[#B8860B] dark:hover:text-[#FFD700]"
            >
              <Pencil size={13} />
              Edit
            </button>

            <button
              onClick={() => onDelete(event.$id)}
              className="flex flex-1 sm:flex-none items-center justify-center gap-1.5 rounded-xl sm:rounded-2xl border border-gray-300 dark:border-slate-700 px-3.5 py-2 text-xs font-medium text-gray-600 dark:text-slate-300 transition-colors hover:border-red-400 dark:hover:border-red-500/50 hover:text-red-600 dark:hover:text-red-400"
            >
              <Trash2 size={13} />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
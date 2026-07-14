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
  education: "text-blue-300 border-blue-500/30 bg-blue-900/20",
  internship: "text-emerald-300 border-emerald-500/30 bg-emerald-900/20",
  achievement: "text-[#FFD700] border-[#FFD700]/30 bg-[#FFD700]/10",
  graduation: "text-purple-300 border-purple-500/30 bg-purple-900/20",
  other: "text-slate-300 border-slate-600/30 bg-slate-800/40",
};

export default function TimelineCard({
  event,
  onEdit,
  onDelete,
}: TimelineCardProps) {
  return (
    <div className="relative rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 transition-all duration-200 hover:border-slate-700 hover:shadow-lg hover:shadow-black/20">
      {/* Timeline Dot */}
      <span className="absolute -left-[41px] top-8 h-4 w-4 rounded-full bg-[#FFD700] ring-4 ring-slate-950" />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border mb-2 ${CATEGORY_COLORS[event.category]}`}
            >
              {CATEGORY_ICONS[event.category]}{" "}
              {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
            </span>

            <h3 className="text-lg font-semibold text-white">
              {event.title}
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              {new Date(event.date).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <span
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
              event.status === "published"
                ? "bg-emerald-900/30 text-emerald-300"
                : "bg-amber-900/30 text-amber-300"
            }`}
          >
            {event.status}
          </span>
        </div>

        {/* Image */}
        {event.image && (
          <div className="relative mt-5 h-56 w-full overflow-hidden rounded-2xl border border-slate-800">
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
        <p className="mt-5 text-sm leading-relaxed text-slate-300 whitespace-pre-line">
          {event.description}
        </p>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between">
          <div>
            {event.location && (
              <span className="flex items-center gap-1.5 text-xs text-slate-500">
                <MapPin size={13} />
                {event.location}
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onEdit(event)}
              className="flex items-center gap-1.5 rounded-2xl border border-slate-700 px-3.5 py-2 text-xs font-medium text-slate-300 transition-colors hover:border-[#FFD700]/50 hover:text-[#FFD700]"
            >
              <Pencil size={13} />
              Edit
            </button>

            <button
              onClick={() => onDelete(event.$id)}
              className="flex items-center gap-1.5 rounded-2xl border border-slate-700 px-3.5 py-2 text-xs font-medium text-slate-300 transition-colors hover:border-red-500/50 hover:text-red-400"
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
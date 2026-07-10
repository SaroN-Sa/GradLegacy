"use client";

import { format } from "date-fns";
import { TimelineEvent, TimelineCategory } from "@/types/timeline";
import { Pencil, Trash2, MapPin, Eye, EyeOff } from "lucide-react";

interface TimelineEventCardProps {
  event: TimelineEvent;
  isOwner: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

const CATEGORY_LABELS: Record<TimelineCategory, string> = {
  education: "Education",
  internship: "Internship",
  achievement: "Achievement",
  graduation: "Graduation",
  other: "Other",
};

const CATEGORY_COLORS: Record<TimelineCategory, string> = {
  education: "text-blue-300 border-blue-500/30 bg-blue-900/20",
  internship: "text-emerald-300 border-emerald-500/30 bg-emerald-900/20",
  achievement: "text-[#FFD700] border-[#FFD700]/30 bg-[#FFD700]/10",
  graduation: "text-purple-300 border-purple-500/30 bg-purple-900/20",
  other: "text-slate-300 border-slate-600/30 bg-slate-800/40",
};

export default function TimelineEventCard({
  event,
  isOwner,
  onEdit,
  onDelete,
}: TimelineEventCardProps) {
  if (!event) return null;

  const formattedDate = (() => {
    try {
      return format(new Date(event.date), "MMMM d, yyyy");
    } catch {
      return event.date;
    }
  })();

  return (
    <div className="relative">
      <span className="absolute -left-[29px] top-6 w-3 h-3 rounded-full bg-[#FFD700] ring-4 ring-slate-950" />

      <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-5 hover:border-slate-700 transition-colors">
        {event.image && (
          <div className="mb-4 rounded-2xl overflow-hidden">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-44 object-cover"
            />
          </div>
        )}

        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-full border ${CATEGORY_COLORS[event.category]}`}
            >
              {CATEGORY_LABELS[event.category]}
            </span>
            {isOwner && (
              <span className="flex items-center gap-1 text-xs text-slate-500">
                {event.status === "published" ? (
                  <>
                    <Eye size={12} /> Published
                  </>
                ) : (
                  <>
                    <EyeOff size={12} /> Draft
                  </>
                )}
              </span>
            )}
          </div>

          {isOwner && (
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={onEdit}
                className="p-1.5 rounded-full text-slate-400 hover:text-[#FFD700] hover:bg-slate-800 transition-colors"
                aria-label="Edit event"
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={onDelete}
                className="p-1.5 rounded-full text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                aria-label="Delete event"
              >
                <Trash2 size={15} />
              </button>
            </div>
          )}
        </div>

        <h3 className="text-lg font-semibold text-white mb-1">{event.title}</h3>
        <p className="text-sm text-slate-400 mb-3">{formattedDate}</p>
        <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
          {event.description}
        </p>

        {event.location && (
          <div className="flex items-center gap-1.5 mt-3 text-xs text-slate-500">
            <MapPin size={13} />
            {event.location}
          </div>
        )}
      </div>
    </div>
  );
}
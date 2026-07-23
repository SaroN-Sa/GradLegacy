"use client";

import { useMemo, useState } from "react";
import { TimelineEvent, TimelineCategory, TimelineStatus } from "@/types/timeline";
import TimelineCard from "./TimelineCard";
import { Sparkles, ArrowDownAZ, ArrowUpAZ } from "lucide-react";

interface TimelineListProps {
  events: TimelineEvent[];
  onEdit: (event: TimelineEvent) => void;
  onDelete: (eventId: string) => void;
}

type CategoryFilter = "all" | TimelineCategory;
type StatusFilter = "all" | TimelineStatus;
type SortOrder = "newest" | "oldest";

const CATEGORY_FILTERS: { value: CategoryFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "education", label: "🎓 Education" },
  { value: "internship", label: "💼 Internship" },
  { value: "achievement", label: "🏆 Achievement" },
  { value: "graduation", label: "🎉 Graduation" },
  { value: "other", label: "📌 Other" },
];

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
];

export default function TimelineList({
  events,
  onEdit,
  onDelete,
}: TimelineListProps) {
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  const filteredEvents = useMemo(() => {
    let result = events;

    if (categoryFilter !== "all") {
      result = result.filter((event) => event.category === categoryFilter);
    }

    if (statusFilter !== "all") {
      result = result.filter((event) => event.status === statusFilter);
    }

    result = [...result].sort((a, b) => {
      const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
      return sortOrder === "newest" ? -diff : diff;
    });

    return result;
  }, [events, categoryFilter, statusFilter, sortOrder]);

  if (events.length === 0) {
    return (
      <div className="rounded-2xl sm:rounded-3xl border border-dashed border-slate-700 bg-gradient-to-br from-slate-900 to-slate-950 p-6 sm:p-12 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#FFD700]/10 text-2xl sm:text-3xl">
          📅
        </div>

        <h2 className="text-lg sm:text-xl font-semibold text-white">
          No Timeline Events
        </h2>

        <p className="mt-2 text-sm text-slate-400 max-w-sm mx-auto">
          Start documenting your academic journey by creating your first
          timeline event.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Filter & sort bar */}
      <div className="mb-5 sm:mb-6 space-y-3">
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {CATEGORY_FILTERS.map((filter) => {
            const isActive = categoryFilter === filter.value;
            const count =
              filter.value === "all"
                ? events.length
                : events.filter((e) => e.category === filter.value).length;

            if (filter.value !== "all" && count === 0) return null;

            return (
              <button
                key={filter.value}
                onClick={() => setCategoryFilter(filter.value)}
                className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-slate-800 to-slate-900 border-[#FFD700] text-[#FFD700] scale-105"
                    : "border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-200"
                }`}
              >
                {filter.label}
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? "bg-[#FFD700]/20 text-[#FFD700]"
                      : "bg-slate-800 text-slate-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-1.5">
            {STATUS_FILTERS.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setStatusFilter(filter.value)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  statusFilter === filter.value
                    ? "bg-[#FFD700]/10 text-[#FFD700]"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <button
            onClick={() =>
              setSortOrder((prev) => (prev === "newest" ? "oldest" : "newest"))
            }
            className="flex items-center gap-1.5 self-start sm:self-auto text-xs font-medium text-slate-400 hover:text-[#FFD700] transition-colors"
          >
            {sortOrder === "newest" ? (
              <ArrowDownAZ size={14} />
            ) : (
              <ArrowUpAZ size={14} />
            )}
            {sortOrder === "newest" ? "Newest first" : "Oldest first"}
          </button>
        </div>
      </div>

      {/* Results */}
      {filteredEvents.length === 0 ? (
        <div className="rounded-2xl sm:rounded-3xl border border-slate-800 bg-slate-900/40 p-6 sm:p-10 text-center">
          <Sparkles className="mx-auto mb-3 text-slate-600" size={24} />
          <p className="text-sm text-slate-400">
            No events match these filters.
          </p>
          <button
            onClick={() => {
              setCategoryFilter("all");
              setStatusFilter("all");
            }}
            className="mt-3 text-xs font-medium text-[#FFD700] hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="relative ml-2 sm:ml-3 space-y-5 sm:space-y-6 border-l-2 border-slate-800 pl-6 sm:pl-8">
          {filteredEvents.map((event, index) => (
            <div
              key={event.$id}
              className="animate-timeline-in"
              style={{ animationDelay: `${Math.min(index * 60, 400)}ms` }}
            >
              <TimelineCard event={event} onEdit={onEdit} onDelete={onDelete} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
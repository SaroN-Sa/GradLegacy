"use client";

import { Search, X, SlidersHorizontal } from "lucide-react";

interface WishFiltersProps {
  search: string;
  status: "all" | "pending" | "published" | "hidden";
  onSearchChange: (value: string) => void;
  onStatusChange: (
    value: "all" | "pending" | "published" | "hidden"
  ) => void;
}

const STATUS_OPTIONS: {
  value: "all" | "pending" | "published" | "hidden";
  label: string;
}[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "published", label: "Published" },
  { value: "hidden", label: "Hidden" },
];

export default function WishFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: WishFiltersProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-4 shadow-lg shadow-black/20 sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        {/* Search */}
        <div className="flex-1 lg:max-w-sm">
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">
            Search Wishes
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by visitor, relationship or message..."
              className="w-full rounded-xl border border-slate-700 bg-slate-900 py-2.5 sm:py-2.5 pl-10 pr-9 text-base sm:text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-[#FFD700]/60 focus:bg-slate-900 focus:ring-4 focus:ring-[#FFD700]/10"
            />
            {search && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-slate-500 transition-colors hover:bg-slate-800 hover:text-slate-300"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Status — segmented pill control */}
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
            <SlidersHorizontal className="h-3 w-3" />
            Status
          </label>
          <div className="flex flex-wrap gap-1 rounded-xl border border-slate-700 bg-slate-900 p-1 sm:inline-flex">
            {STATUS_OPTIONS.map((option) => {
              const isActive = status === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onStatusChange(option.value)}
                  className={`flex-1 sm:flex-none rounded-lg px-3.5 py-2 sm:py-1.5 text-xs font-medium transition-all ${
                    isActive
                      ? "bg-[#FFD700]/10 text-[#FFD700] shadow-sm ring-1 ring-[#FFD700]/30"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
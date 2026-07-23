"use client";

import { Heart, Images, CalendarDays } from "lucide-react";

export type GraduateTab = "wishes" | "gallery" | "timeline";

interface GraduateTabsProps {
  activeTab: GraduateTab;
  onChange: (tab: GraduateTab) => void;

  wishCount?: number;
  galleryCount?: number;
  timelineCount?: number;
}

const tabs = [
  { key: "wishes", label: "Wishes", icon: Heart },
  { key: "gallery", label: "Gallery", icon: Images },
  { key: "timeline", label: "Timeline", icon: CalendarDays },
] as const;

export default function GraduateTabs({
  activeTab,
  onChange,
  wishCount = 0,
  galleryCount = 0,
  timelineCount = 0,
}: GraduateTabsProps) {
  const getCount = (tab: GraduateTab) => {
    switch (tab) {
      case "wishes":
        return wishCount;
      case "gallery":
        return galleryCount;
      case "timeline":
        return timelineCount;
      default:
        return 0;
    }
  };

  return (
    <div className="mt-4 sm:mt-5 flex gap-1 rounded-xl sm:rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-1 sm:p-1.5 shadow-lg shadow-black/20 w-full max-w-full">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.key;
        const count = getCount(tab.key);

        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            aria-current={isActive ? "true" : undefined}
            className={`flex flex-1 items-center justify-center gap-1 sm:gap-1.5 md:gap-2 rounded-lg sm:rounded-xl px-1.5 py-2.5 sm:px-2 sm:py-3 transition-all duration-200 min-w-0 ${
              isActive
                ? "bg-[#FFD700]/10 text-[#FFD700] shadow-sm ring-1 ring-[#FFD700]/30"
                : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
            }`}
          >
            <Icon size={14} className="shrink-0 sm:w-[15px] sm:h-[15px]" />

            <span className="hidden text-xs sm:text-sm font-semibold sm:inline truncate">{tab.label}</span>

            {count > 0 && (
              <span
                className={`min-w-[1.1rem] sm:min-w-[1.25rem] rounded-full px-1 sm:px-1.5 py-0.5 text-center text-[10px] sm:text-[11px] font-semibold tabular-nums leading-none shrink-0 ${
                  isActive ? "bg-[#FFD700]/15 text-[#FFD700]" : "bg-slate-800 text-slate-400"
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
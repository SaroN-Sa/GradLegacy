"use client";

import { Heart, Images, CalendarDays } from "lucide-react";

export type ProfileTab = "wishes" | "gallery" | "timeline";

interface ProfileTabsProps {
  activeTab: ProfileTab;
  onChange: (tab: ProfileTab) => void;

  wishCount?: number;
  galleryCount?: number;
  timelineCount?: number;
}

const tabs = [
  { key: "wishes", label: "Wishes", icon: Heart },
  { key: "gallery", label: "Gallery", icon: Images },
  { key: "timeline", label: "Timeline", icon: CalendarDays },
] as const;

export default function ProfileTabs({
  activeTab,
  onChange,
  wishCount = 0,
  galleryCount = 0,
  timelineCount = 0,
}: ProfileTabsProps) {
  const getCount = (tab: ProfileTab) => {
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
    <div className="mt-5 flex gap-1 rounded-2xl bg-white p-1.5 shadow-xl shadow-black/20">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.key;
        const count = getCount(tab.key);

        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            aria-current={isActive ? "true" : undefined}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-3 px-2 transition-all duration-200 sm:gap-2 ${
              isActive
                ? "bg-[#0f172a] text-yellow-400 shadow-md"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <Icon size={15} className="shrink-0" />

            <span className="hidden text-sm font-semibold sm:inline">
              {tab.label}
            </span>

            {count > 0 && (
              <span
                className={`min-w-[1.25rem] rounded-full px-1.5 py-0.5 text-center text-[11px] font-semibold tabular-nums leading-none ${
                  isActive ? "bg-white/15 text-yellow-300" : "bg-gray-100 text-gray-600"
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
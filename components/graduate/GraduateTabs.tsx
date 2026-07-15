"use client";

import {
  Heart,
  Globe,
  CalendarDays,
} from "lucide-react";

export type ProfileTab =
  | "wishes"
  | "gallery"
  | "timeline";

interface ProfileTabsProps {
  activeTab: ProfileTab;
  onChange: (tab: ProfileTab) => void;

  wishCount?: number;
  galleryCount?: number;
  timelineCount?: number;
}

const tabs = [
  {
    key: "wishes",
    label: "Wishes",
    icon: Heart,
  },
  {
    key: "gallery",
    label: "Gallery",
    icon: Globe,
  },
  {
    key: "timeline",
    label: "Timeline",
    icon: CalendarDays,
  },
] as const;

export default function ProfileTabs({
  activeTab,
  onChange,
  wishCount = 0,
  galleryCount = 0,
  timelineCount = 0,
}: ProfileTabsProps) {
  const getCount = (
    tab: ProfileTab
  ) => {
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
    <div className="mt-5 bg-white rounded-2xl shadow-xl shadow-black/20 p-1.5 flex gap-1">

      {tabs.map((tab) => {
        const Icon = tab.icon;

        return (
          <button
            key={tab.key}
            onClick={() =>
              onChange(tab.key)
            }
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all duration-200 ${
              activeTab === tab.key
                ? "bg-[#0f172a] text-yellow-400 shadow-md"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <Icon size={15} />

            <span className="font-semibold">
              {tab.label}
            </span>

            <span
              className={`text-xs rounded-full px-2 py-0.5 ${
                activeTab === tab.key
                  ? "bg-white/10"
                  : "bg-gray-100"
              }`}
            >
              {getCount(tab.key)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
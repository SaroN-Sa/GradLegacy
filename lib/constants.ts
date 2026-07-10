import { TimelineCategory, TimelineStatus } from "@/types/timeline";

export const TIMELINE_CATEGORIES: TimelineCategory[] = [
  "education",
  "internship",
  "achievement",
  "graduation",
  "other",
];

export const TIMELINE_CATEGORY_LABELS: Record<TimelineCategory, string> = {
  education: "Education",
  internship: "Internship",
  achievement: "Achievement",
  graduation: "Graduation",
  other: "Other",
};

export const TIMELINE_CATEGORY_COLORS: Record<TimelineCategory, string> = {
  education: "text-blue-300 border-blue-500/30 bg-blue-900/20",
  internship: "text-emerald-300 border-emerald-500/30 bg-emerald-900/20",
  achievement: "text-[#FFD700] border-[#FFD700]/30 bg-[#FFD700]/10",
  graduation: "text-purple-300 border-purple-500/30 bg-purple-900/20",
  other: "text-slate-300 border-slate-600/30 bg-slate-800/40",
};

export const TIMELINE_STATUS_OPTIONS: TimelineStatus[] = ["draft", "published"];

export const APP_NAME = "Your App Name";
export const ACCENT_COLOR = "#FFD700";
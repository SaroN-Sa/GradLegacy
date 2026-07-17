import { BookOpen, Briefcase, Trophy, GraduationCap, Sparkles, type LucideIcon } from "lucide-react";
import { TimelineCategory } from "@/types/timeline";

export const CATEGORY_ACCENT: Record<
  TimelineCategory,
  { icon: LucideIcon; text: string; bg: string; dot: string; label: string }
> = {
  education: { icon: BookOpen, text: "text-sky-600", bg: "bg-sky-500", dot: "bg-sky-500", label: "Education" },
  internship: { icon: Briefcase, text: "text-violet-600", bg: "bg-violet-500", dot: "bg-violet-500", label: "Internship" },
  achievement: { icon: Trophy, text: "text-[#B8860B]", bg: "bg-[#FFD700]", dot: "bg-[#FFD700]", label: "Achievement" },
  graduation: { icon: GraduationCap, text: "text-emerald-600", bg: "bg-emerald-500", dot: "bg-emerald-500", label: "Graduation" },
  other: { icon: Sparkles, text: "text-slate-600", bg: "bg-slate-500", dot: "bg-slate-500", label: "Other" },
};
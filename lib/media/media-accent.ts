import { Globe, Lock, Link2, Image as ImageIcon, Film, Music, type LucideIcon } from "lucide-react";

export const TYPE_ACCENT: Record<string, { icon: LucideIcon; bg: string; chip: string }> = {
  image: { icon: ImageIcon, bg: "bg-violet-500", chip: "bg-violet-500/90" },
  video: { icon: Film, bg: "bg-rose-500", chip: "bg-rose-500/90" },
  audio: { icon: Music, bg: "bg-emerald-500", chip: "bg-emerald-500/90" },
};

export const VISIBILITY_ACCENT: Record<string, { icon: LucideIcon; text: string; dot: string; label: string }> = {
  public: { icon: Globe, text: "text-sky-600", dot: "bg-sky-500", label: "Public" },
  private: { icon: Lock, text: "text-slate-600", dot: "bg-slate-500", label: "Private" },
  unlisted: { icon: Link2, text: "text-orange-600", dot: "bg-orange-500", label: "Unlisted" },
};
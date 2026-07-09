import {
  Images, ImageIcon, Film, Music, Star, Eye, EyeOff, Link2,
  type LucideIcon,
} from "lucide-react";
import { Media } from "@/types/media";

export type CategorySlug =
  | "all"
  | "images"
  | "videos"
  | "audio"
  | "featured"
  | "public"
  | "private"
  | "unlisted";

export interface CategoryConfig {
  slug: CategorySlug;
  label: string;
  eyebrow: string;
  description: string;
  icon: LucideIcon;
  accent: {
    text: string;   // number / heading color
    bg: string;     // solid icon-tile background
    soft: string;   // low-opacity background for empty states — kept as a full literal token for Tailwind
    from: string;   // gradient start
    to: string;     // gradient end
  };
  /** every item here shares one `type` — the category page hides the type filter */
  typeLocked: boolean;
  /** every item here shares one `visibility` — the category page hides the visibility filter */
  visibilityLocked: boolean;
  match: (m: Media) => boolean;
}

export const CATEGORIES: CategoryConfig[] = [
  {
    slug: "all",
    label: "All Media",
    eyebrow: "Everything",
    description: "Every photo, video and voice note in your vault.",
    icon: Images,
    accent: {
      text: "text-[#0f172a]",
      bg: "bg-[#0f172a]",
      soft: "bg-[#0f172a]/10",
      from: "from-[#0f172a]",
      to: "to-[#1e3a5f]",
    },
    typeLocked: false,
    visibilityLocked: false,
    match: () => true,
  },
  {
    slug: "images",
    label: "Images",
    eyebrow: "Photos",
    description: "Portraits, snapshots and gallery stills.",
    icon: ImageIcon,
    accent: {
      text: "text-violet-600",
      bg: "bg-violet-500",
      soft: "bg-violet-500/10",
      from: "from-violet-500",
      to: "to-violet-700",
    },
    typeLocked: true,
    visibilityLocked: false,
    match: (m) => m.type === "image",
  },
  {
    slug: "videos",
    label: "Videos",
    eyebrow: "Motion",
    description: "Clips, speeches and recorded moments.",
    icon: Film,
    accent: {
      text: "text-rose-600",
      bg: "bg-rose-500",
      soft: "bg-rose-500/10",
      from: "from-rose-500",
      to: "to-rose-700",
    },
    typeLocked: true,
    visibilityLocked: false,
    match: (m) => m.type === "video",
  },
  {
    slug: "audio",
    label: "Audio",
    eyebrow: "Sound",
    description: "Voice messages and recorded audio.",
    icon: Music,
    accent: {
      text: "text-emerald-600",
      bg: "bg-emerald-500",
      soft: "bg-emerald-500/10",
      from: "from-emerald-500",
      to: "to-emerald-700",
    },
    typeLocked: true,
    visibilityLocked: false,
    match: (m) => m.type === "audio",
  },
  {
    slug: "featured",
    label: "Featured",
    eyebrow: "Highlights",
    description: "The pieces you've pinned to the top.",
    icon: Star,
    accent: {
      text: "text-yellow-600",
      bg: "bg-yellow-400",
      soft: "bg-yellow-400/10",
      from: "from-yellow-400",
      to: "to-yellow-500",
    },
    typeLocked: false,
    visibilityLocked: false,
    match: (m) => !!m.featured,
  },
  {
    slug: "public",
    label: "Public",
    eyebrow: "Visible to all",
    description: "Media anyone with your link can see.",
    icon: Eye,
    accent: {
      text: "text-sky-600",
      bg: "bg-sky-500",
      soft: "bg-sky-500/10",
      from: "from-sky-500",
      to: "to-sky-700",
    },
    typeLocked: false,
    visibilityLocked: true,
    match: (m) => m.visibility === "public",
  },
  {
    slug: "private",
    label: "Private",
    eyebrow: "Only you",
    description: "Kept out of your public profile.",
    icon: EyeOff,
    accent: {
      text: "text-slate-600",
      bg: "bg-slate-500",
      soft: "bg-slate-500/10",
      from: "from-slate-500",
      to: "to-slate-700",
    },
    typeLocked: false,
    visibilityLocked: true,
    match: (m) => m.visibility === "private",
  },
  {
    slug: "unlisted",
    label: "Unlisted",
    eyebrow: "Link only",
    description: "Hidden from your profile, open by direct link.",
    icon: Link2,
    accent: {
      text: "text-orange-600",
      bg: "bg-orange-500",
      soft: "bg-orange-500/10",
      from: "from-orange-500",
      to: "to-orange-700",
    },
    typeLocked: false,
    visibilityLocked: true,
    match: (m) => m.visibility === "unlisted",
  },
];

export function getCategory(slug: string): CategoryConfig | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
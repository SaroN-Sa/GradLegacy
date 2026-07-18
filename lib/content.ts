import React from "react";
import {
  GraduationCap,
  BookOpen,
  HeartHandshake,
  Trophy,
  Rocket,
  School,
  Camera,
  Video,
  Mic,
  Clock3,
  Globe,
  UserPlus,
  Share2,
  MessageSquareHeart,
  Sparkles,
} from "lucide-react";
import type { TimelineEntry, Feature, Step, Wish } from "@/lib/types";

export const HERO_IMG =
  "https://images.unsplash.com/photo-1775623606576-3e049f72b8e7?auto=format&fit=crop&w=2000&q=80";

export const GALLERY_IMGS = [
  "https://images.unsplash.com/photo-1695425173758-37e9c23b962a?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1770208524687-9ed3dfa80c7c?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1761781342506-821be95168c5?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1775623606576-3e049f72b8e7?auto=format&fit=crop&w=900&q=80",
];

export const TIMELINE: TimelineEntry[] = [
  { icon: React.createElement(School, { size: 18 }), year: "2011 — Age 5", title: "First Day of School", body: "A backpack bigger than they were, and a wave goodbye that took three tries to actually let go of.", fold: -10 },
  { icon: React.createElement(BookOpen, { size: 18 }), year: "2016 — Age 10", title: "Fell in Love With a Subject", body: "The library card got more use than any toy that year. Curiosity became a habit.", fold: 10 },
  { icon: React.createElement(HeartHandshake, { size: 18 }), year: "2020 — Age 14", title: "The Hard Year", body: "Learned what it means to keep going when nothing is easy. It mattered more than any grade.", fold: -10 },
  { icon: React.createElement(Trophy, { size: 18 }), year: "2023 — Age 17", title: "Captain, Leader, Late-Nighter", body: "Led the team. Aced the exam after failing the first one. Started to believe.", fold: 10 },
  { icon: React.createElement(Rocket, { size: 18 }), year: "2025 — Senior Year", title: "The Final Push", body: "Applications, all-nighters, and a growing stack of acceptance letters on the wall.", fold: -10 },
  { icon: React.createElement(GraduationCap, { size: 18 }), year: "2026 — Today", title: "The Cap Goes Up", body: "Every early morning, every doubt talked through — all of it lands here, on this stage.", fold: 10 },
];

export const FEATURES: Feature[] = [
  { icon: React.createElement(Camera, { size: 22 }), title: "Photo Memories", description: "Upload and organize photos from every chapter of your journey." },
  { icon: React.createElement(Video, { size: 22 }), title: "Video Wishes", description: "Let friends and family leave heartfelt video messages." },
  { icon: React.createElement(Mic, { size: 22 }), title: "Voice Messages", description: "Capture the warmth of a spoken congratulations." },
  { icon: React.createElement(Clock3, { size: 22 }), title: "Time Capsule", description: "Lock away messages to be revealed on a future date." },
  { icon: React.createElement(BookOpen, { size: 22 }), title: "Memory Book", description: "Compile your favorite moments into a shareable keepsake." },
  { icon: React.createElement(Globe, { size: 22 }), title: "Multi Language", description: "Collect wishes from anyone, in any language." },
];

export const STEPS: Step[] = [
  { icon: React.createElement(UserPlus, { size: 16 }), title: "Create Your Profile", description: "Set the stage with photos, a headline, and your story so far." },
  { icon: React.createElement(Share2, { size: 16 }), title: "Share Your Link", description: "Send it to family and friends — no app or account required." },
  { icon: React.createElement(MessageSquareHeart, { size: 16 }), title: "Collect Wishes", description: "Photos, videos, and voice notes land in one place automatically." },
  { icon: React.createElement(Sparkles, { size: 16 }), title: "Preserve Memories Forever", description: "Your page, and everything on it, stays yours to revisit anytime." },
];

export const WISHES: Wish[] = [
  { num: "01", line: "Congratulations — we are so, so proud of you.", from: "Text from Mom & Dad" },
  { num: "02", line: "Knew you'd do it. Never doubted you for a second.", from: "Voice message from Grandma" },
  { num: "03", line: "So many late nights led to this exact moment.", from: "Video wish from your roommate" },
  { num: "04", line: "Best study partner anyone could ask for.", from: "Photo + note from your lab group" },
  { num: "05", line: "Cheers to the next chapter — you've earned it.", from: "Video wish from your mentor" },
];

export const EVENT_DATE = new Date("2026-10-16T16:00:00");
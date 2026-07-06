"use client";

import { useEffect, useRef, useState } from "react";
import {
  X,
  GraduationCap,
  Building2,
  BookOpen,
  CalendarDays,
  Heart,
  Globe,
  Sparkles,
  Share2,
  Send,
  CheckCircle2,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Profile {
  $id: string;
  fullName: string;
  username: string;
  bio?: string;
  university?: string;
  department?: string;
  graduationYear?: number;
  profileImage?: string;
  coverImage?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  profile: Profile;
}

// ─── Tabs ────────────────────────────────────────────────────────────────────
const TABS = [
  { key: "wishes",   label: "Wishes",   icon: Heart },
  { key: "gallery",  label: "Gallery",  icon: Globe },
  { key: "timeline", label: "Timeline", icon: CalendarDays },
] as const;
type Tab = (typeof TABS)[number]["key"];

// ─── Wish Form (preview-mode: no real submission) ─────────────────────────────
function WishFormPreview({ name }: { name: string }) {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center">
          <CheckCircle2 size={26} className="text-emerald-600" />
        </div>
        <p className="font-bold text-gray-900">Wish sent! 🎉</p>
        <p className="text-xs text-gray-500">
          This is a preview — wishes won't be saved.
        </p>
        <button
          onClick={() => setSent(false)}
          className="mt-1 text-xs font-semibold text-[#0f172a] hover:underline underline-offset-2"
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Your Name (optional)
        </label>
        <input
          type="text"
          placeholder="Anonymous"
          disabled
          className="w-full rounded-xl border border-gray-200 bg-gray-100 px-3.5 py-2.5 text-sm text-gray-400 placeholder:text-gray-400 outline-none cursor-not-allowed"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Your Wish <span className="text-red-400">*</span>
        </label>
        <textarea
          rows={3}
          disabled
          placeholder="Write a heartfelt message…"
          className="w-full rounded-xl border border-gray-200 bg-gray-100 px-3.5 py-2.5 text-sm text-gray-400 placeholder:text-gray-400 outline-none resize-none cursor-not-allowed"
        />
      </div>

      {/* Preview-mode notice */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-3.5 py-2.5 text-xs text-amber-700 font-medium">
        👁 Preview mode — wish form is disabled on your own page.
      </div>

      <button
        onClick={() => setSent(true)}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0f172a] to-[#1e3a5f] py-3 text-sm font-bold text-white opacity-60 cursor-not-allowed"
        disabled
      >
        <Send size={14} />
        Send Wish
      </button>
    </div>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────
export default function ProfilePreviewModal({ open, onClose, profile }: Props) {
  const overlayRef              = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<Tab>("wishes");
  const [copied, setCopied]     = useState(false);

  // Escape key to close
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Backdrop click
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/graduate/${profile.username}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* noop */ }
  };

  if (!open) return null;

  const firstName = profile.fullName.split(" ")[0];

  return (
    /* ── Full-screen backdrop ── */
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`Preview of ${profile.fullName}'s graduation page`}
    >
      {/*
        ── Modal shell ──
        Tall card, scrollable internally, never overflows viewport.
        Max width 420px mirrors a phone viewport so the graduate sees
        exactly what visitors on mobile will see.
      */}
      <div className="
        relative w-full max-w-[420px] max-h-[90vh]
        bg-gradient-to-br from-[#0b1120] via-[#0f172a] to-[#162035]
        rounded-3xl shadow-2xl shadow-black/60
        overflow-hidden flex flex-col
      ">

        {/* ── Ambient glow inside modal ── */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-purple-500/8 rounded-full blur-[80px] pointer-events-none" />

        {/* ── Top accent bar ── */}
        <div className="h-1 w-full bg-gradient-to-r from-[#0f172a] via-yellow-400 to-[#0f172a] shrink-0" />

        {/* ── Sticky header ── */}
        <div className="relative z-10 flex items-center justify-between px-5 py-4 shrink-0 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="bg-white/10 p-1.5 rounded-xl border border-white/10">
              <GraduationCap size={16} className="text-yellow-400" />
            </div>
            <span className="text-sm font-bold text-white">
              Grad<span className="text-yellow-400">Legacy</span>
            </span>
          </div>

          {/* Preview badge */}
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1 bg-yellow-400/15 border border-yellow-400/30 px-2.5 py-1 rounded-full text-[10px] font-bold text-yellow-400 uppercase tracking-widest">
              👁 Preview
            </span>

            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Close preview"
              className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto">

          {/* Cover image */}
          <div className="relative w-full h-32 shrink-0">
            {profile.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.coverImage}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-[#0f172a] via-[#1e3a5f] to-[#0f172a]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />

            {/* Share button over cover */}
            <button
              onClick={handleShare}
              className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/15 backdrop-blur-sm hover:bg-white/25 border border-white/20 px-3 py-1.5 rounded-xl text-[11px] font-bold text-white transition-all"
            >
              <Share2 size={11} />
              {copied ? "Copied!" : "Share"}
            </button>
          </div>

          {/* ── White profile card ── */}
          <div className="relative z-10 mx-4 bg-white rounded-3xl shadow-2xl shadow-black/40 -mt-8 p-5">

            {/* Avatar + name */}
            <div className="flex items-end gap-4">
              <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-[#0f172a] flex items-center justify-center shrink-0 -mt-12">
                {profile.profileImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.profileImage}
                    alt={profile.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <GraduationCap size={30} className="text-yellow-400" />
                )}
              </div>

              <div className="flex-1 min-w-0 pb-1">
                <div className="inline-flex items-center gap-1 bg-[#0f172a] px-2.5 py-0.5 rounded-full text-[9px] font-bold text-yellow-400 mb-1.5 tracking-widest uppercase">
                  <Sparkles size={8} />
                  {profile.graduationYear ? `Class of ${profile.graduationYear}` : "Graduate"}
                </div>
                <h1 className="text-lg font-extrabold text-gray-900 tracking-tight leading-tight truncate">
                  {profile.fullName}
                </h1>
                <p className="text-xs text-gray-400 font-medium">@{profile.username}</p>
              </div>
            </div>

            {/* Bio */}
            {profile.bio && (
              <p className="mt-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                {profile.bio}
              </p>
            )}

            {/* Info chips */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {profile.university && (
                <span className="inline-flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1 text-[11px] font-semibold text-gray-700">
                  <Building2 size={10} className="text-[#0f172a]" />
                  {profile.university}
                </span>
              )}
              {profile.department && (
                <span className="inline-flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1 text-[11px] font-semibold text-gray-700">
                  <BookOpen size={10} className="text-[#0f172a]" />
                  {profile.department}
                </span>
              )}
              {profile.graduationYear && (
                <span className="inline-flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1 text-[11px] font-semibold text-gray-700">
                  <CalendarDays size={10} className="text-[#0f172a]" />
                  {profile.graduationYear}
                </span>
              )}
            </div>
          </div>

          {/* ── Tab bar ── */}
          <div className="mx-4 mt-4 bg-white/10 backdrop-blur-sm rounded-2xl p-1 flex gap-1 border border-white/10">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === key
                    ? "bg-white text-[#0f172a] shadow-md"
                    : "text-white/50 hover:text-white"
                }`}
              >
                <Icon size={13} />
                {label}
              </button>
            ))}
          </div>

          {/* ── Tab content ── */}
          <div className="mx-4 mt-3 mb-6">

            {activeTab === "wishes" && (
              <div className="bg-white rounded-3xl shadow-xl shadow-black/20 overflow-hidden">
                <div className="px-5 pt-5 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2 mb-0.5">
                    <Heart size={14} className="text-[#0f172a]" />
                    <h2 className="text-sm font-extrabold text-gray-900">Send a Wish</h2>
                  </div>
                  <p className="text-xs text-gray-400">
                    Celebrate {firstName}'s graduation with a message.
                  </p>
                </div>
                <div className="px-5 py-5">
                  <WishFormPreview name={firstName} />
                </div>
              </div>
            )}

            {activeTab === "gallery" && (
              <div className="bg-white rounded-3xl shadow-xl shadow-black/20 px-5 py-10 text-center">
                <div className="w-11 h-11 rounded-2xl bg-[#0f172a]/8 flex items-center justify-center mx-auto mb-3">
                  <Globe size={20} className="text-[#0f172a]" />
                </div>
                <p className="text-sm font-bold text-gray-900">No photos yet</p>
                <p className="text-xs text-gray-400 mt-1">
                  Add photos from your dashboard.
                </p>
              </div>
            )}

            {activeTab === "timeline" && (
              <div className="bg-white rounded-3xl shadow-xl shadow-black/20 px-5 py-10 text-center">
                <div className="w-11 h-11 rounded-2xl bg-[#0f172a]/8 flex items-center justify-center mx-auto mb-3">
                  <CalendarDays size={20} className="text-[#0f172a]" />
                </div>
                <p className="text-sm font-bold text-gray-900">No timeline yet</p>
                <p className="text-xs text-gray-400 mt-1">
                  Add milestones from your dashboard.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center pb-4">
            <p className="text-[10px] text-white/25">
              Powered by{" "}
              <span className="text-white/40 font-semibold">
                Grad<span className="text-yellow-400/60">Legacy</span>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
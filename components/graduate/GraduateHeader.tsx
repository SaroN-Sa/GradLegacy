"use client";

import {
  ArrowLeft,
  GraduationCap,
  Building2,
  BookOpen,
  CalendarDays,
  Share2,
  Sparkles,
  Check,
} from "lucide-react";

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

interface ProfileHeaderProps {
  profile: Profile;
  copied: boolean;
  onShare: () => void;
  /** Show a back arrow in the top bar — use when this profile is reached from a list/search page */
  showBack?: boolean;
  /** Optional custom back handler; defaults to window.history.back() */
  onBack?: () => void;
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function ProfileHeader({
  profile,
  copied,
  onShare,
  showBack = false,
  onBack,
}: ProfileHeaderProps) {
  return (
    <>
      {/* Cover */}
      <div className="relative h-44 w-full xs:h-52 sm:h-64 md:h-72">
        {profile.coverImage ? (
          <img
            src={profile.coverImage}
            alt="Cover"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-r from-[#0f172a] via-[#1e3a5f] to-[#0f172a]" />
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/60" />

        {/* Top Bar */}
        <div className="absolute inset-x-0 top-0 flex items-center justify-between px-3 py-3 sm:px-6 sm:py-4 md:px-8">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            {showBack && (
              <button
                onClick={onBack ?? (() => window.history.back())}
                aria-label="Go back"
                className="rounded-xl border border-white/20 bg-white/15 p-2 text-white backdrop-blur-sm transition-all hover:bg-white/25 shrink-0"
              >
                <ArrowLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
              </button>
            )}

            <div className="rounded-xl border border-white/20 bg-white/15 p-1.5 sm:p-2 backdrop-blur-sm shrink-0">
              <GraduationCap size={16} className="text-[#FFD700] sm:w-[18px] sm:h-[18px]" />
            </div>

            <span className="text-xs sm:text-sm font-bold text-white truncate">
              Grad<span className="text-[#FFD700]">Legacy</span>
            </span>
          </div>

          <button
            onClick={onShare}
            className="flex items-center gap-1.5 sm:gap-2 rounded-xl border border-white/20 bg-white/15 px-3 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-bold text-white backdrop-blur-sm transition-all hover:bg-white/25 shrink-0"
          >
            {copied ? <Check size={13} /> : <Share2 size={13} />}
            <span className="hidden xs:inline">{copied ? "Copied!" : "Share"}</span>
          </button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6">
        <div className="relative rounded-2xl sm:rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-5 pt-12 shadow-lg shadow-black/20 sm:p-8 sm:pt-16">
          {/* Avatar — single, predictable overlap above the card */}
          <div className="absolute -top-10 left-5 h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-4 border-slate-950 bg-[#0f172a] shadow-xl sm:-top-14 sm:left-8 sm:h-24 sm:w-24">
            {profile.profileImage ? (
              <img
                src={profile.profileImage}
                alt={profile.fullName}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-base sm:text-lg font-bold text-[#FFD700]">
                {getInitials(profile.fullName) || (
                  <GraduationCap size={30} className="sm:w-9 sm:h-9" />
                )}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/30 px-2.5 py-1 sm:px-3 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-[#FFD700]">
              <Sparkles size={9} />
              {profile.graduationYear
                ? `Class of ${profile.graduationYear}`
                : "Graduate"}
            </div>

            <h1 className="truncate text-xl font-extrabold text-white xs:text-2xl sm:text-3xl">
              {profile.fullName}
            </h1>

            <p className="mt-1 text-xs sm:text-sm text-slate-400 truncate">@{profile.username}</p>
          </div>

          {profile.bio && (
            <p className="mt-4 sm:mt-5 border-t border-slate-800 pt-4 sm:pt-5 text-xs sm:text-sm leading-relaxed text-slate-300">
              {profile.bio}
            </p>
          )}

          {(profile.university || profile.department || profile.graduationYear) && (
            <div className="mt-4 sm:mt-5 flex flex-wrap gap-1.5 sm:gap-2">
              {profile.university && (
                <span className="inline-flex items-center gap-1.5 sm:gap-2 rounded-xl border border-slate-700 bg-slate-900/60 px-2.5 py-1.5 sm:px-3 sm:py-2 text-[11px] sm:text-xs font-semibold text-slate-200">
                  <Building2 size={12} className="text-[#FFD700] shrink-0" />
                  <span className="truncate">{profile.university}</span>
                </span>
              )}

              {profile.department && (
                <span className="inline-flex items-center gap-1.5 sm:gap-2 rounded-xl border border-slate-700 bg-slate-900/60 px-2.5 py-1.5 sm:px-3 sm:py-2 text-[11px] sm:text-xs font-semibold text-slate-200">
                  <BookOpen size={12} className="text-[#FFD700] shrink-0" />
                  <span className="truncate">{profile.department}</span>
                </span>
              )}

              {profile.graduationYear && (
                <span className="inline-flex items-center gap-1.5 sm:gap-2 rounded-xl border border-slate-700 bg-slate-900/60 px-2.5 py-1.5 sm:px-3 sm:py-2 text-[11px] sm:text-xs font-semibold text-slate-200">
                  <CalendarDays size={12} className="text-[#FFD700] shrink-0" />
                  {profile.graduationYear}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
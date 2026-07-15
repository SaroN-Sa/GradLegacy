"use client";

import {
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
}: ProfileHeaderProps) {
  return (
    <>
      {/* Cover */}
      <div className="relative h-52 w-full sm:h-72">
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
        <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 py-4 sm:px-8">
          <div className="flex items-center gap-2">
            <div className="rounded-xl border border-white/20 bg-white/15 p-2 backdrop-blur-sm">
              <GraduationCap size={18} className="text-[#FFD700]" />
            </div>

            <span className="text-sm font-bold text-white">
              Grad<span className="text-[#FFD700]">Legacy</span>
            </span>
          </div>

          <button
            onClick={onShare}
            className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/15 px-4 py-2 text-xs font-bold text-white backdrop-blur-sm transition-all hover:bg-white/25"
          >
            {copied ? <Check size={13} /> : <Share2 size={13} />}
            {copied ? "Copied!" : "Share"}
          </button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6">
        <div className="relative rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-6 pt-14 shadow-lg shadow-black/20 sm:p-8 sm:pt-16">
          {/* Avatar — single, predictable overlap above the card */}
          <div className="absolute -top-12 left-6 h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-4 border-slate-950 bg-[#0f172a] shadow-xl sm:-top-14 sm:left-8">
            {profile.profileImage ? (
              <img
                src={profile.profileImage}
                alt={profile.fullName}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-lg font-bold text-[#FFD700]">
                {getInitials(profile.fullName) || (
                  <GraduationCap size={36} />
                )}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/30 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#FFD700]">
              <Sparkles size={9} />
              {profile.graduationYear
                ? `Class of ${profile.graduationYear}`
                : "Graduate"}
            </div>

            <h1 className="truncate text-2xl font-extrabold text-white sm:text-3xl">
              {profile.fullName}
            </h1>

            <p className="mt-1 text-sm text-slate-400">@{profile.username}</p>
          </div>

          {profile.bio && (
            <p className="mt-5 border-t border-slate-800 pt-5 text-sm leading-relaxed text-slate-300">
              {profile.bio}
            </p>
          )}

          {(profile.university || profile.department || profile.graduationYear) && (
            <div className="mt-5 flex flex-wrap gap-2">
              {profile.university && (
                <span className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-xs font-semibold text-slate-200">
                  <Building2 size={12} className="text-[#FFD700]" />
                  {profile.university}
                </span>
              )}

              {profile.department && (
                <span className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-xs font-semibold text-slate-200">
                  <BookOpen size={12} className="text-[#FFD700]" />
                  {profile.department}
                </span>
              )}

              {profile.graduationYear && (
                <span className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-xs font-semibold text-slate-200">
                  <CalendarDays size={12} className="text-[#FFD700]" />
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
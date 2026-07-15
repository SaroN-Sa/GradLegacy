"use client";

import {
  GraduationCap,
  Building2,
  BookOpen,
  CalendarDays,
  Share2,
  Sparkles,
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

export default function ProfileHeader({
  profile,
  copied,
  onShare,
}: ProfileHeaderProps) {
  return (
    <>
      {/* Cover */}
      <div className="relative w-full h-52 sm:h-72">

        {profile.coverImage ? (
          <img
            src={profile.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-[#0f172a] via-[#1e3a5f] to-[#0f172a]" />
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/60" />

        {/* Top Bar */}

        <div className="absolute top-0 left-0 right-0 px-4 sm:px-8 py-4 flex items-center justify-between">

          <div className="flex items-center gap-2">

            <div className="bg-white/15 backdrop-blur-sm p-2 rounded-xl border border-white/20">
              <GraduationCap
                size={18}
                className="text-yellow-400"
              />
            </div>

            <span className="text-sm font-bold text-white">
              Grad
              <span className="text-yellow-400">
                Legacy
              </span>
            </span>

          </div>

          <button
            onClick={onShare}
            className="flex items-center gap-2 bg-white/15 backdrop-blur-sm hover:bg-white/25 border border-white/20 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all"
          >
            <Share2 size={13} />

            {copied
              ? "Copied!"
              : "Share"}

          </button>

        </div>

      </div>

      {/* Profile Card */}

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6">

        <div className="bg-white rounded-3xl shadow-2xl shadow-black/40 -mt-16 p-6 sm:p-8">

          <div className="flex items-end gap-5 flex-wrap">

            <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-[#0f172a] flex items-center justify-center shrink-0 -mt-16 sm:-mt-20">

              {profile.profileImage ? (
                <img
                  src={profile.profileImage}
                  alt={profile.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <GraduationCap
                  size={36}
                  className="text-yellow-400"
                />
              )}

            </div>

            <div className="flex-1 min-w-0 pb-1">

              <div className="inline-flex items-center gap-1.5 bg-[#0f172a] px-3 py-1 rounded-full text-[10px] font-bold text-yellow-400 mb-2 uppercase tracking-widest">

                <Sparkles size={9} />

                {profile.graduationYear
                  ? `Class of ${profile.graduationYear}`
                  : "Graduate"}

              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 truncate">
                {profile.fullName}
              </h1>

              <p className="mt-1 text-sm text-gray-400">
                @{profile.username}
              </p>

            </div>

          </div>

          {profile.bio && (
            <p className="mt-5 border-t pt-5 text-sm leading-relaxed text-gray-600">
              {profile.bio}
            </p>
          )}

          <div className="mt-5 flex flex-wrap gap-2">

            {profile.university && (
              <span className="inline-flex items-center gap-2 rounded-xl border bg-gray-50 px-3 py-2 text-xs font-semibold">
                <Building2
                  size={12}
                  className="text-[#0f172a]"
                />

                {profile.university}
              </span>
            )}

            {profile.department && (
              <span className="inline-flex items-center gap-2 rounded-xl border bg-gray-50 px-3 py-2 text-xs font-semibold">
                <BookOpen
                  size={12}
                  className="text-[#0f172a]"
                />

                {profile.department}
              </span>
            )}

            {profile.graduationYear && (
              <span className="inline-flex items-center gap-2 rounded-xl border bg-gray-50 px-3 py-2 text-xs font-semibold">
                <CalendarDays
                  size={12}
                  className="text-[#0f172a]"
                />

                {profile.graduationYear}
              </span>
            )}

          </div>

        </div>

      </div>
    </>
  );
}
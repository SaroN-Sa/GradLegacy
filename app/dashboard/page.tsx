"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  GraduationCap,
  CheckCircle2,
  Clock,
  XCircle,
  Circle,
  ArrowRight,
  Eye,
  Pencil,
  Sparkles,
  UserRound,
} from "lucide-react";

import { authService } from "@/services/auth";
import { profileService } from "@/services/profile";

type ProfileStatus = "pending" | "approved" | "rejected" | undefined;

interface Profile {
  $id: string;
  fullName: string;
  username: string;
  bio?: string;
  university?: string;
  department?: string;
  profileImage?: string;
  coverImage?: string;
  status?: ProfileStatus;
}

const PROFILE_FIELDS = [
  "fullName",
  "username",
  "bio",
  "university",
  "department",
  "profileImage",
  "coverImage",
] as const;

const STATUS_CONFIG: Record<
  string,
  { label: string; icon: typeof Circle; badgeClass: string; dotClass: string }
> = {
  pending: {
    label: "Pending Review",
    icon: Clock,
    badgeClass: "bg-yellow-50 text-yellow-700 border-yellow-200",
    dotClass: "bg-yellow-400",
  },
  approved: {
    label: "Approved",
    icon: CheckCircle2,
    badgeClass: "bg-green-50 text-green-700 border-green-200",
    dotClass: "bg-green-400",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    badgeClass: "bg-red-50 text-red-700 border-red-200",
    dotClass: "bg-red-400",
  },
  none: {
    label: "Not Applied",
    icon: Circle,
    badgeClass: "bg-gray-50 text-gray-500 border-gray-200",
    dotClass: "bg-gray-300",
  },
  draft: {
    label: "Draft Saved",
    icon: Pencil,
    badgeClass: "bg-blue-50 text-blue-600 border-blue-200",
    dotClass: "bg-blue-400",
  },
};

export default function DashboardPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const user = await authService.getCurrentUser();
      if (!user) {
        router.push("/login");
        return;
      }
      const res = await profileService.getProfileByUserId(user.$id);
      setProfile(res || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async () => {
    try {
      if (!profile) {
        router.push("/dashboard/profile/setup");
        return;
      }
      if (profile.status === "pending") return; // blocked
      if (profile.status === "approved") {
        router.push(`/graduate/${profile.username}`);
        return;
      }
      await profileService.updateProfile(profile.$id, { status: "pending" });
      router.push("/dashboard/profile/setup");
    } catch (err) {
      console.error(err);
    }
  };

  const calculateProgress = (p: Profile | null) => {
    if (!p) return 0;
    const filled = PROFILE_FIELDS.filter((f) => Boolean(p[f])).length;
    return Math.round((filled / PROFILE_FIELDS.length) * 100);
  };

  const rawStatus = profile?.status ?? "none";
  const status = (rawStatus in STATUS_CONFIG ? rawStatus : "none") as keyof typeof STATUS_CONFIG;
  const statusInfo = STATUS_CONFIG[status];
  const StatusIcon = statusInfo.icon;
  const progress = calculateProgress(profile);

  const buttonLabel =
    status === "pending" ? "Pending Approval"
    : status === "approved" ? "View Public Page"
    : status === "rejected" ? "Edit & Reapply"
    : status === "draft" ? "Continue Application"
    : "Apply Now";

  const ButtonIcon =
    status === "approved" ? Eye
    : status === "rejected" || status === "draft" ? Pencil
    : ArrowRight;

  /* ── Loading state ── */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b1120] via-[#0f172a] to-[#162035]">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-7 w-7 text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-sm text-white/50">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0b1120] via-[#0f172a] to-[#162035] px-4 py-10 sm:px-6">

      {/* Ambient glow — consistent with auth pages */}
      <div className="fixed top-0 right-0 w-[26rem] h-[26rem] bg-blue-500/10 rounded-full blur-[110px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[32rem] h-[32rem] bg-purple-500/8 rounded-full blur-[110px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto">

        {/* ── Top bar — logo + status pill ── */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2.5 rounded-2xl backdrop-blur-sm border border-white/10">
              <GraduationCap size={22} className="text-yellow-400" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              Grad<span className="text-yellow-400">Legacy</span>
            </span>
          </div>

          <div className={`hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-semibold ${statusInfo.badgeClass}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotClass}`} />
            {statusInfo.label}
          </div>
        </div>

        {/* ── Header card ── */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-black/40 p-7 mb-5 flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-[#0f172a]/8 flex items-center justify-center shrink-0 overflow-hidden">
            {profile?.profileImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.profileImage} alt={profile.fullName} className="w-full h-full object-cover" />
            ) : (
              <UserRound size={26} className="text-[#0f172a]" />
            )}
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-[#0f172a] tracking-tight">
              {profile ? `Welcome back, ${profile.fullName.split(" ")[0]}` : "Welcome to GradLegacy"}
            </h1>
            <p className="mt-0.5 text-sm text-gray-400">
              {profile
                ? "Here's where your graduation legacy application stands."
                : "No profile found yet — let's start your application."}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

          {/* ── Status card ── */}
          <div className="bg-white rounded-3xl shadow-xl shadow-black/20 p-6">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
              Application Status
            </p>
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${statusInfo.badgeClass}`}>
                <StatusIcon size={17} />
              </div>
              <p className="text-lg font-bold text-[#0f172a]">{statusInfo.label}</p>
            </div>
          </div>

          {/* ── Progress card ── */}
          <div className="bg-white rounded-3xl shadow-xl shadow-black/20 p-6">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
              Profile Completion
            </p>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-gray-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="h-2.5 rounded-full bg-gradient-to-r from-[#0f172a] to-[#1e3a5f] transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-sm font-bold text-[#0f172a] w-10 text-right">{progress}%</span>
            </div>
          </div>
        </div>

        {/* ── Main action card ── */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-black/40 p-7 mt-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#0f172a]/8 px-3 py-1 rounded-full text-[10px] font-bold text-[#0f172a] mb-3 tracking-[0.15em] uppercase">
                <Sparkles size={10} className="text-yellow-500" />
                Graduation Page
              </div>
              <h2 className="text-lg font-bold text-[#0f172a]">Graduation Page Application</h2>
              <p className="mt-1 text-sm text-gray-400 max-w-md">
                Manage your public graduation page application — fill it out, track its review, and share it once approved.
              </p>
            </div>
          </div>

          <button
            onClick={handleAction}
            disabled={status === "pending"}
            className={`mt-5 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition-all active:scale-[0.99] disabled:cursor-not-allowed ${
              status === "pending"
                ? "bg-yellow-400/90 disabled:opacity-80"
                : status === "approved"
                ? "bg-gradient-to-r from-green-600 to-green-700 hover:shadow-lg"
                : status === "rejected"
                ? "bg-gradient-to-r from-red-600 to-red-700 hover:shadow-lg"
                : "bg-gradient-to-r from-[#0f172a] to-[#1e3a5f] hover:shadow-lg hover:from-[#1a2a4a] hover:to-[#0f172a]"
            }`}
          >
            {buttonLabel}
            <ButtonIcon size={15} />
          </button>
        </div>

        {/* ── Rejected info ── */}
        {status === "rejected" && (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-6 py-4 flex items-start gap-3">
            <XCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-700">Application was rejected</p>
              <p className="text-xs text-red-500 mt-0.5">Please review and update your profile, then reapply.</p>
            </div>
          </div>
        )}

        {/* ── Approved info ── */}
        {status === "approved" && (
          <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 px-6 py-4 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-start gap-3">
              <CheckCircle2 size={18} className="text-green-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-green-700">Your public page is live 🎉</p>
                <p className="text-xs text-green-600 mt-0.5">Share it with friends and family.</p>
              </div>
            </div>
            {profile?.username && (
              <Link
                href={`/graduate/${profile.username}`}
                className="text-xs font-semibold text-green-700 hover:underline underline-offset-2 flex items-center gap-1"
              >
                View page <ArrowRight size={12} />
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
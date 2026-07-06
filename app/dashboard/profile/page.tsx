"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { account } from "@/lib/appwrite";
import { profileService } from "@/services/profile";

import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileCompletion from "@/components/profile/ProfileCompletion";
import QuickActions from "@/components/profile/QuickActions";
import ProfileStats from "@/components/profile/ProfileStats";
import QRCodeModal from "@/components/profile/QRCodeModal";
import ProfilePreviewModal from "@/components/profile/ProfilePreviewModal";  // ← new

import type { GraduateProfile } from "@/types/profile";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function calcCompletion(profile: GraduateProfile): number {
  const fields = [
    profile.fullName,
    profile.username,
    profile.bio,
    profile.university,
    profile.department,
    profile.graduationYear,
    profile.profileImage,
    profile.coverImage,
  ];
  return Math.round((fields.filter(Boolean).length / fields.length) * 100);
}

// publicUrl must be computed lazily (window is not available during SSR)
function getPublicUrl(username: string): string {
  if (typeof window === "undefined") return "";
  return `${window.location.origin}/graduate/${username}`;
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────
function LoadingState() {
  return (
    <div className="flex h-96 items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <svg
          className="animate-spin h-7 w-7 text-[#0f172a]"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <p className="text-sm text-gray-400">Loading your profile…</p>
      </div>
    </div>
  );
}

// ─── Not found state ──────────────────────────────────────────────────────────
function NotFoundState({ onSetup }: { onSetup: () => void }) {
  return (
    <div className="flex h-96 flex-col items-center justify-center gap-4 text-center px-4">
      <div className="w-14 h-14 rounded-2xl bg-[#0f172a]/8 flex items-center justify-center">
        <span className="text-2xl">🎓</span>
      </div>
      <div>
        <p className="text-base font-bold text-gray-900">No profile yet</p>
        <p className="text-sm text-gray-400 mt-1">Set up your graduation legacy page to get started.</p>
      </div>
      <button
        onClick={onSetup}
        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#0f172a] to-[#1e3a5f] px-5 py-2.5 text-sm font-bold text-white hover:shadow-lg transition-all"
      >
        Set Up Profile
      </button>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const router = useRouter();

  const [profile, setProfile]     = useState<GraduateProfile | null>(null);
  const [loading, setLoading]     = useState(true);
  const [showQR, setShowQR]       = useState(false);
  const [showPreview, setShowPreview] = useState(false);  // ← new
  const [shareMsg, setShareMsg]   = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const user = await account.get();
      const data = await profileService.getProfileByUserId(user.$id);
      if (data) setProfile(data as GraduateProfile);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleProfileImageChange(url: string) {
    if (!profile) return;
    try {
      await profileService.updateProfile(profile.$id, { profileImage: url });
      setProfile({ ...profile, profileImage: url });
    } catch (err) {
      console.error(err);
    }
  }

  async function handleCoverImageChange(url: string) {
    if (!profile) return;
    try {
      await profileService.updateProfile(profile.$id, { coverImage: url });
      setProfile({ ...profile, coverImage: url });
    } catch (err) {
      console.error(err);
    }
  }

  // Copy link with a transient label — no alert()
  async function handleShare() {
    if (!profile) return;
    try {
      await navigator.clipboard.writeText(getPublicUrl(profile.username));
      setShareMsg("Copied!");
      setTimeout(() => setShareMsg(""), 2000);
    } catch {
      setShareMsg("Failed to copy");
      setTimeout(() => setShareMsg(""), 2000);
    }
  }

  // ── Render states ──────────────────────────────────────────────────────────
  if (loading) return <LoadingState />;

  if (!profile) {
    return <NotFoundState onSetup={() => router.push("/dashboard/profile/setup")} />;
  }

  const completion = calcCompletion(profile);
  const publicUrl  = getPublicUrl(profile.username);

  return (
    <>
      <div className="mx-auto max-w-7xl space-y-8 p-6">

        {/* Share feedback toast — appears briefly top-right */}
        {shareMsg && (
          <div className="fixed top-6 right-6 z-40 rounded-2xl bg-[#0f172a] text-white text-sm font-semibold px-5 py-3 shadow-2xl flex items-center gap-2 animate-fade-in">
            ✓ {shareMsg}
          </div>
        )}

        {/* HEADER */}
        <ProfileHeader
          profile={profile}
          onEdit={() => router.push("/dashboard/profile/setup")}
          onProfileImageChange={handleProfileImageChange}
          onCoverImageChange={handleCoverImageChange}
        />

        {/* COMPLETION */}
        <ProfileCompletion profile={profile} />

        {/* QUICK ACTIONS */}
        <QuickActions
          onEdit={() => router.push("/dashboard/profile/setup")}
          onPreview={() => setShowPreview(true)}           // ← opens modal
          onPublicPage={() => window.open(publicUrl, "_blank")}
          onShare={handleShare}
          onQr={() => setShowQR(true)}
        />

        {/* STATS */}
        <ProfileStats completion={completion} />
      </div>

      {/* QR CODE MODAL */}
      <QRCodeModal
        open={showQR}
        onClose={() => setShowQR(false)}
        url={publicUrl}
      />

      {/* PREVIEW MODAL ← new, same pattern as QRCodeModal */}
      <ProfilePreviewModal
        open={showPreview}
        onClose={() => setShowPreview(false)}
        profile={profile}
      />
    </>
  );
}
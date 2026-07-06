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

import type { GraduateProfile } from "@/types/profile";

export default function ProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState<GraduateProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const user = await account.get();

      const data = await profileService.getProfileByUserId(user.$id);

      if (data) {
        setProfile(data as GraduateProfile);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleProfileImageChange(url: string) {
    if (!profile) return;

    try {
      await profileService.updateProfile(profile.$id, {
        profileImage: url,
      });

      setProfile({
        ...profile,
        profileImage: url,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function handleCoverImageChange(url: string) {
    if (!profile) return;

    try {
      await profileService.updateProfile(profile.$id, {
        coverImage: url,
      });

      setProfile({
        ...profile,
        coverImage: url,
      });
    } catch (error) {
      console.error(error);
    }
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-red-500">Profile not found</p>
      </div>
    );
  }

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

  const completion = Math.round(
    (fields.filter(Boolean).length / fields.length) * 100
  );

  const publicUrl = `${window.location.origin}/graduate/${profile.username}`;

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6">

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
        onPreview={() => window.open(publicUrl, "_blank")}
        onPublicPage={() => router.push(publicUrl)}
        onShare={async () => {
          await navigator.clipboard.writeText(publicUrl);
          alert("Public page copied");
        }}
        onQr={() => setShowQR(true)}
      />

      {/* QR MODAL */}
            <QRCodeModal
  open={showQR}
  onClose={() => setShowQR(false)}
  url={`${window.location.origin}/graduate/${profile.username}`}
/>

      {/* STATS */}
      <ProfileStats completion={completion} />
    </div>
  );
}
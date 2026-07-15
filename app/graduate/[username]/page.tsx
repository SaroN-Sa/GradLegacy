"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { GraduationCap } from "lucide-react";

import { profileService } from "@/services/profile";

import GraduateHeader from "@/components/graduate/GraduateHeader";
import GraduateTabs, {
  GraduateTab,
} from "@/components/graduate/GraduateTabs";

import WishesSection from "@/components/graduate/sections/WishesSection";
import GallerySection from "@/components/graduate/sections/GallerySection";
import TimelineSection from "@/components/graduate/sections/TimelineSection";
import GraduateFooter from "@/components/graduate/GraduateFooter";

interface Profile {
  $id: string;

  userId: string;

  fullName: string;

  username: string;

  bio?: string;

  university?: string;

  department?: string;

  graduationYear?: number;

  profileImage?: string;

  coverImage?: string;

  status?: string;
}

export default function GraduatePage() {
  const params = useParams();

  const username = params.username as string;

  const [profile, setProfile] =
    useState<Profile | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [notFound, setNotFound] =
    useState(false);

  const [copied, setCopied] =
    useState(false);

  const [activeTab, setActiveTab] =
    useState<GraduateTab>("wishes");

  useEffect(() => {
    if (username) {
      loadProfile();
    }
  }, [username]);

  const loadProfile = async () => {
    try {
      const data =
        await profileService.getProfileByUsername(
          username
        );

      if (
        !data ||
        data.status !== "approved"
      ) {
        setNotFound(true);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error(error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `${profile?.fullName}'s Graduation Page`,
          url,
        });
      } else {
        await navigator.clipboard.writeText(
          url
        );

        setCopied(true);

        setTimeout(() => {
          setCopied(false);
        }, 2000);
      }
    } catch {}
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0b1120] via-[#0f172a] to-[#162035]">

        <div className="flex flex-col items-center gap-4">

          <div className="h-8 w-8 animate-spin rounded-full border-4 border-yellow-400 border-t-transparent" />

          <p className="text-sm text-white/60">
            Loading profile...
          </p>

        </div>

      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0b1120] via-[#0f172a] to-[#162035] px-4">

        <div className="w-full max-w-md rounded-3xl bg-white p-10 text-center shadow-2xl">

          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0f172a]">

            <GraduationCap
              className="text-yellow-400"
            />

          </div>

          <h1 className="text-2xl font-bold">
            Page Not Found
          </h1>

          <p className="mt-3 text-gray-500">
            This graduation page does not
            exist or has not been approved.
          </p>

          <a
            href="/"
            className="mt-8 inline-flex rounded-xl bg-[#0f172a] px-6 py-3 text-white"
          >
            Go Home
          </a>

        </div>

      </div>
    );
  }  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1120] via-[#0f172a] to-[#162035]">

      {/* Ambient Background */}
      <div className="fixed top-0 right-0 h-[28rem] w-[28rem] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />

      <div className="fixed bottom-0 left-0 h-[32rem] w-[32rem] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />

      {/* Graduate Header */}
      <GraduateHeader
        profile={profile}
        copied={copied}
        onShare={handleShare}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 pb-16">

        {/* Tabs */}

        <GraduateTabs
          activeTab={activeTab}
          onChange={setActiveTab}
          wishCount={0}
          galleryCount={0}
          timelineCount={0}
        />

        {/* Sections */}

        <div className="mt-5">

          {activeTab === "wishes" && (
            <WishesSection
              userId={profile.userId}
              graduateName={profile.fullName}
            />
          )}

          {activeTab === "gallery" && (
            <GallerySection
              graduateName={profile.fullName}
            />
          )}

          {activeTab === "timeline" && (
            <TimelineSection
              graduateName={profile.fullName}
            />
          )}

        </div>

        {/* Footer */}

        <GraduateFooter />

      </div>

    </div>
  );
}
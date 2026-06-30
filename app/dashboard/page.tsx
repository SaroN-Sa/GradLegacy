"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { authService } from "@/services/auth";
import { profileService } from "@/services/profile";

export default function DashboardPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    loadUser();
  }, []);

  // 🔥 LOAD USER + PROFILE
  const loadUser = async () => {
    try {
      const user = await authService.getCurrentUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const res = await profileService.getProfileByUserId(user.$id);

      if (!res) {
        router.push("/dashboard/profile/setup");
        return;
      }

      setProfile(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 APPLY BUTTON
  const applyForApproval = async () => {
    try {
      await profileService.updateProfile(profile.$id, {
        status: "pending",
      });

      router.push("/dashboard/profile/setup");
    } catch (err) {
      console.error(err);
    }
  };

  // 📊 PROFILE PROGRESS CALC
  const calculateProgress = (p: any) => {
    const fields = [
      "fullName",
      "username",
      "bio",
      "university",
      "department",
      "profileImage",
      "coverImage",
    ];

    let filled = 0;

    fields.forEach((f) => {
      if (p?.[f]) filled++;
    });

    return Math.round((filled / fields.length) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-900 dark:text-white">
        Loading dashboard...
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-white p-6">

      <div className="max-w-4xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="p-6 rounded-2xl shadow bg-white dark:bg-zinc-900 border">
          <h1 className="text-2xl font-bold">
            Welcome, {profile.fullName}
          </h1>

          <p className="text-gray-700 dark:text-gray-300">
            Status: {profile.status || "draft"}
          </p>
        </div>

        {/* 📊 PROGRESS BAR */}
        <div className="p-6 rounded-2xl shadow bg-white dark:bg-zinc-900 border">
          <h2 className="font-semibold mb-3">
            Profile Completion
          </h2>

          <div className="w-full bg-gray-200 dark:bg-zinc-700 h-3 rounded-full">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all"
              style={{
                width: `${calculateProgress(profile)}%`,
              }}
            />
          </div>

          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            {calculateProgress(profile)}% complete
          </p>
        </div>

        {/* 🟡 DRAFT */}
        {(!profile.status || profile.status === "draft") && (
          <div className="p-6 rounded-2xl shadow bg-white dark:bg-zinc-900 border">
            <h2 className="font-semibold mb-3">
              Complete Your Profile
            </h2>

            <button
              onClick={applyForApproval}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Apply for Public Page
            </button>
          </div>
        )}

        {/* 🟠 PENDING */}
        {profile.status === "pending" && (
          <div className="p-6 rounded-2xl shadow bg-yellow-100 dark:bg-yellow-900/30 border">
            <h2 className="font-semibold mb-2">
              Waiting for Approval
            </h2>

            <p className="text-gray-700 dark:text-gray-300">
              Your profile is under review by admin.
            </p>
          </div>
        )}

        {/* 🔴 REJECTED */}
        {profile.status === "rejected" && (
          <div className="p-6 rounded-2xl shadow bg-red-100 dark:bg-red-900/30 border">
            <h2 className="font-semibold mb-2 text-red-600">
              Rejected
            </h2>

            <p className="mb-3 text-gray-700 dark:text-gray-300">
              Please update your profile and reapply.
            </p>

            <button
              onClick={applyForApproval}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Re-Apply
            </button>
          </div>
        )}

        {/* 🟢 APPROVED DASHBOARD */}
        {profile.status === "approved" && (
          <div className="space-y-6">

            {/* PROFILE CARD */}
            <div className="p-6 rounded-2xl shadow bg-white dark:bg-zinc-900 border">
              <h2 className="text-xl font-bold">
                {profile.fullName}
              </h2>

              <p className="text-gray-700 dark:text-gray-300">
                @{profile.username}
              </p>

              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {profile.bio}
              </p>
            </div>

            {/* PUBLIC PAGE */}
            <div className="p-6 rounded-2xl shadow bg-white dark:bg-zinc-900 border">
              <h3 className="font-semibold mb-2">
                Public Page
              </h3>

              <p className="text-gray-700 dark:text-gray-300">
                /graduate/{profile.username}
              </p>

              <button
                onClick={() =>
                  router.push(`/graduate/${profile.username}`)
                }
                className="mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
              >
                View Page
              </button>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-3 gap-4">

              <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border text-center">
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-gray-500">
                  Wishes
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border text-center">
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-gray-500">
                  Photos
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border text-center">
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-gray-500">
                  Visitors
                </p>
              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}
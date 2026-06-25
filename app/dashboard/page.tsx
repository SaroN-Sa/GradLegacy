"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { authService } from "@/services/auth";
import { profileService } from "@/services/profile";

export default function DashboardPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const user =
        await authService.getCurrentUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const existingProfile =
        await profileService.getProfileByUserId(
          user.$id
        );

      if (!existingProfile) {
        router.push(
          "/dashboard/profile/setup"
        );
        return;
      }

      setProfile(existingProfile);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await authService.logout();

    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-3xl font-bold mb-2">
          Welcome, {profile.fullName}
        </h1>

        <p className="text-gray-500 mb-8">
          Manage your graduation page.
        </p>

        <div className="border rounded-xl p-6 mb-6">
          <h2 className="font-semibold text-xl mb-4">
            Profile
          </h2>

          <p>
            Username:
            {" "}
            {profile.username}
          </p>

          <p>
            University:
            {" "}
            {profile.university}
          </p>

          <p>
            Graduation Year:
            {" "}
            {profile.graduationYear}
          </p>
        </div>

        <div className="border rounded-xl p-6 mb-6">
          <h2 className="font-semibold text-xl mb-4">
            Public Page
          </h2>

          <p className="mb-4">
            /graduate/{profile.username}
          </p>

          <button className="border px-4 py-2 rounded">
            View Page
          </button>
        </div>

        <div className="border rounded-xl p-6 mb-6">
          <h2 className="font-semibold text-xl mb-4">
            Statistics
          </h2>

          <p>Wishes: 0</p>
          <p>Photos: 0</p>
          <p>Visitors: 0</p>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>

      </div>
    </div>
  );
}
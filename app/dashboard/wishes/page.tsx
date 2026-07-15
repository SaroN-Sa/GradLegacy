"use client";

import { useEffect, useState } from "react";

import { account } from "@/lib/appwrite";

import WishList from "@/components/wishes/WishList";

export default function DashboardWishPage() {
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await account.get();
        setUserId(user.$id);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg font-medium text-gray-500">
          Loading wishes...
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">

      <div className="mx-auto max-w-7xl">

        {/* Header */}

        <div className="mb-8 rounded-xl bg-white p-6 shadow">

          <h1 className="text-3xl font-bold">
            Graduation Wishes
          </h1>

          <p className="mt-2 text-gray-500">
            View and manage all wishes submitted
            by your family, friends, teachers,
            relatives and visitors.
          </p>

        </div>

        {/* Statistics */}

        <div className="mb-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-sm text-gray-500">
              Total Wishes
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              --
            </h2>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-sm text-gray-500">
              Pending
            </p>

            <h2 className="mt-3 text-3xl font-bold text-yellow-600">
              --
            </h2>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-sm text-gray-500">
              Published
            </p>

            <h2 className="mt-3 text-3xl font-bold text-green-600">
              --
            </h2>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-sm text-gray-500">
              Featured
            </p>

            <h2 className="mt-3 text-3xl font-bold text-blue-600">
              --
            </h2>
          </div>

        </div>

        {/* Wishes */}

        <div className="rounded-xl bg-white p-6 shadow">

          <WishList
            userId={userId}
            dashboard
          />

        </div>

      </div>

    </main>
  );
}
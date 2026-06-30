import {
  databases,
  DATABASE_ID,
  COLLECTION_ID,
  Query,
} from "@/lib/appwrite-db";

import { notFound } from "next/navigation";

async function getProfile(username?: string) {
  if (!username) return null;

  try {
    const res = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [Query.equal("username", username)]
    );

    return res.documents?.[0] || null;
  } catch (error) {
    console.error("Profile fetch error:", error);
    return null;
  }
}

export default async function GraduatePage({
  params,
}: {
  params: Promise<{ username: string }>; // ✅ FIXED: Promise type
}) {
  // ✅ IMPORTANT: unwrap params
  const { username } = await params;

  console.log("ROUTE USERNAME:", username);

  const profile = await getProfile(username);

  if (!profile) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-zinc-950 dark:to-zinc-900">

      {/* Header */}
      <div className="h-60 bg-gradient-to-r from-blue-600 to-indigo-600" />

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 -mt-20">

        <div className="rounded-2xl border bg-white p-8 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {profile.fullName}
          </h1>

          <p className="text-gray-500">
            @{profile.username}
          </p>

          <p className="mt-3 text-gray-700 dark:text-gray-300">
            🎓 {profile.university}
          </p>

          <p className="text-gray-700 dark:text-gray-300">
            📚 {profile.department}
          </p>

          <p className="text-gray-700 dark:text-gray-300">
            🎓 Class of {profile.graduationYear}
          </p>

          {profile.bio && (
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              {profile.bio}
            </p>
          )}

        </div>

      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { profileService } from "@/services/profile";

export default function AdminPage() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔥 FETCH ALL USERS
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await profileService.getAllProfiles();
      setProfiles(res);

    } catch (err) {
      console.error("FETCH ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 UPDATE STATUS
  const updateStatus = async (id: string, status: string) => {
    try {
      await profileService.updateProfile(id, { status });

      // refresh from DB
      await fetchUsers();
    } catch (err) {
      console.error("UPDATE ERROR:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading users...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-zinc-950">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl font-bold mb-6">
          Admin Test Panel
        </h1>

        {/* USERS */}
        <div className="space-y-4">

          {profiles.length === 0 && (
            <p className="text-gray-500">
              No users found
            </p>
          )}

          {profiles.map((p) => (
            <div
              key={p.$id}
              className="p-4 bg-white dark:bg-zinc-900 rounded shadow"
            >

              {/* USER INFO */}
              <h2 className="text-lg font-bold">
                {p.fullName}
              </h2>

              <p className="text-gray-500">
                @{p.username}
              </p>

              <p className="mt-1">
                Status:{" "}
                <span className="font-bold">
                  {p.status || "draft"}
                </span>
              </p>

              {/* BUTTONS */}
              <div className="flex gap-2 mt-3 flex-wrap">

                <button
                  onClick={() =>
                    updateStatus(p.$id, "approved")
                  }
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Approve
                </button>

                <button
                  onClick={() =>
                    updateStatus(p.$id, "pending")
                  }
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Pending
                </button>

                <button
                  onClick={() =>
                    updateStatus(p.$id, "rejected")
                  }
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Reject
                </button>

              </div>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}
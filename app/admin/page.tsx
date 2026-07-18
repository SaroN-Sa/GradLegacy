"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth";
import { profileService } from "@/services/profile";

const ADMIN_EMAIL = "anjulosaron@gmail.com";

export default function AdminPage() {
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    checkAccess();
  }, []);

  // 🔥 GATE: only the admin account may view this page
  const checkAccess = async () => {
    try {
      const user = await authService.getCurrentUser();

      if (!user || user.email !== ADMIN_EMAIL) {
        router.push("/login");
        return;
      }

      setAuthorized(true);
      fetchUsers();
    } catch (err) {
      console.error("AUTH CHECK ERROR:", err);
      router.push("/login");
    } finally {
      setCheckingAuth(false);
    }
  };

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

  /*🔥 DELETE PROFILE
  const deleteProfile = async (id: string, fullName: string) => {
    const confirmed = window.confirm(
      `Delete ${fullName || "this profile"}? This cannot be undone.`
    );
    if (!confirmed) return;

    try {
      setDeletingId(id);
      await profileService.deleteProfile(id);

      // refresh from DB
      await fetchUsers();
    } catch (err) {
      console.error("DELETE ERROR:", err);
    } finally {
      setDeletingId(null);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Checking access…
      </div>
    );
  }

  if (!authorized) {
    // We already redirect in checkAccess(), this is just a safety fallback
    // in case the redirect hasn't completed yet.
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading users...
      </div>
    );
  } */

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-zinc-950">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Admin Test Panel</h1>

        {/* USERS */}
        <div className="space-y-4">
          {profiles.length === 0 && (
            <p className="text-gray-500">No users found</p>
          )}

          {profiles.map((p) => (
            <div
              key={p.$id}
              className="p-4 bg-white dark:bg-zinc-900 rounded shadow"
            >
              {/* USER INFO */}
              <h2 className="text-lg font-bold">{p.fullName}</h2>

              <p className="text-gray-500">@{p.username}</p>

              <p className="mt-1">
                Status:{" "}
                <span className="font-bold">{p.status || "draft"}</span>
              </p>

              {/* BUTTONS */}
              <div className="flex gap-2 mt-3 flex-wrap">
                <button
                  onClick={() => updateStatus(p.$id, "approved")}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Approve
                </button>

                <button
                  onClick={() => updateStatus(p.$id, "pending")}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Pending
                </button>

                <button
                  onClick={() => updateStatus(p.$id, "rejected")}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Reject
                </button>

                <button
                  onClick={() => deleteProfile(p.$id, p.fullName)}
                  disabled={deletingId === p.$id}
                  className="bg-zinc-700 text-white px-3 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deletingId === p.$id ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

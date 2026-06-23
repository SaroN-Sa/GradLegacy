"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth";

export default function TestPage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const currentUser =
        await authService.getCurrentUser();

      if (!currentUser) {
        router.replace("/login");
        return;
      }

      setUser(currentUser);
      setLoading(false);
    }

    loadUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      await authService.logout();

      router.replace("/login");
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-10">
      <div className="max-w-2xl mx-auto">

        <h1 className="text-4xl font-bold mb-6">
          Authentication Test Page
        </h1>

        <div className="bg-white border rounded-2xl p-6 space-y-3">

          <p>
            <strong>Name:</strong>{" "}
            {user?.name}
          </p>

          <p>
            <strong>Email:</strong>{" "}
            {user?.email}
          </p>

          <p>
            <strong>User ID:</strong>{" "}
            {user?.$id}
          </p>

          <p className="text-green-600 font-semibold">
            ✅ Logged In Successfully
          </p>

          <button
            onClick={handleLogout}
            className="
              mt-4
              px-6
              py-3
              bg-red-600
              text-white
              rounded-xl
              hover:bg-red-700
            "
          >
            Logout
          </button>

        </div>
      </div>
    </div>
  );
}
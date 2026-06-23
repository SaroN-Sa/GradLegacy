"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { authService } from "@/services/auth";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const userId =
    searchParams.get("userId") || "";

  const secret =
    searchParams.get("secret") || "";

  const [password, setPassword] =
    useState("");

  const [confirmPassword,
    setConfirmPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (
      password !== confirmPassword
    ) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await authService.resetPassword(
        userId,
        secret,
        password
      );

      alert(
        "Password updated successfully"
      );

      router.push("/login");
    } catch (error) {
      console.error(error);
      alert("Failed to reset password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">
        Reset Password
      </h1>

      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New Password"
          className="border p-3 w-full mb-4"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="border p-3 w-full"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(
              e.target.value
            )
          }
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full border p-3"
        >
          {loading
            ? "Updating..."
            : "Update Password"}
        </button>
      </form>
    </div>
  );
}
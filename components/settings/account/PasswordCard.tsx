"use client";

import { Lock, KeyRound } from "lucide-react";

interface PasswordCardProps {
  onChangePassword: () => void;
}

export default function PasswordCard({
  onChangePassword,
}: PasswordCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
          <Lock className="h-5 w-5 text-red-600" />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Password
          </h2>

          <p className="text-sm text-gray-500">
            Update your account password.
          </p>
        </div>
      </div>

      {/* Password */}
      <div className="mb-8">
        <p className="text-sm text-gray-500">
          Current Password
        </p>

        <p className="mt-2 text-xl tracking-[0.35em] font-bold text-gray-900 dark:text-white">
          ••••••••••••
        </p>
      </div>

      {/* Button */}
      <button
        onClick={onChangePassword}
        className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
      >
        <KeyRound className="h-4 w-4" />

        Change Password
      </button>
    </div>
  );
}
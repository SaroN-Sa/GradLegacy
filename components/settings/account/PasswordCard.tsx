"use client";

import { Lock, KeyRound } from "lucide-react";

interface PasswordCardProps {
  onChangePassword: () => void;
}

export default function PasswordCard({
  onChangePassword,
}: PasswordCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      {/* Header */}
      <div className="mb-5 sm:mb-6 flex items-start sm:items-center gap-3">
        <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
          <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
        </div>

        <div>
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
            Password
          </h2>

          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Update your account password.
          </p>
        </div>
      </div>

      {/* Password */}
      <div className="mb-6 sm:mb-8">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Current Password
        </p>

        <p className="mt-2 text-lg sm:text-xl tracking-[0.3em] sm:tracking-[0.35em] font-bold text-gray-900 dark:text-white">
          ••••••••••••
        </p>
      </div>

      {/* Button */}
      <button
        onClick={onChangePassword}
        className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 sm:py-2 text-sm sm:text-base text-white transition hover:bg-red-700"
      >
        <KeyRound className="h-4 w-4" />

        Change Password
      </button>
    </div>
  );
}
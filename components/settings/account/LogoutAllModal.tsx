"use client";

import { LogOut, X } from "lucide-react";

interface LogoutAllModalProps {
  open: boolean;
  loading?: boolean;
  error?: string | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export default function LogoutAllModal({
  open,
  loading = false,
  error = null,
  onClose,
  onConfirm,
}: LogoutAllModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4">

      <div className="w-full max-w-md rounded-2xl bg-white p-5 sm:p-6 shadow-xl dark:bg-gray-900">

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <LogOut className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />

            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              Logout All Devices
            </h2>
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-full p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-4 sm:mt-5 text-sm sm:text-base text-gray-600 dark:text-gray-300">
          This will sign you out from every browser and
          device currently logged into your account.
        </p>

        {error && (
          <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">
            {error}
          </p>
        )}

        <div className="mt-6 sm:mt-8 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end sm:gap-3">

          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-gray-300 px-4 py-2.5 sm:py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={onConfirm}
            className="rounded-lg bg-orange-600 px-5 py-2.5 sm:py-2 text-sm font-medium text-white transition hover:bg-orange-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading
              ? "Logging out..."
              : "Logout All"}
          </button>

        </div>
      </div>
    </div>
  );
}
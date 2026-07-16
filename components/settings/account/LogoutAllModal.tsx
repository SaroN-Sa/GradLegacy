"use client";

import { LogOut, X } from "lucide-react";

interface LogoutAllModalProps {
  open: boolean;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export default function LogoutAllModal({
  open,
  loading = false,
  onClose,
  onConfirm,
}: LogoutAllModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900">

        <div className="flex items-center gap-3">
          <LogOut className="h-6 w-6 text-orange-600" />

          <h2 className="text-lg font-semibold">
            Logout All Devices
          </h2>
        </div>

        <p className="mt-5 text-gray-600 dark:text-gray-300">
          This will sign you out from every browser and
          device currently logged into your account.
        </p>

        <div className="mt-8 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="rounded-lg border px-4 py-2"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={onConfirm}
            className="rounded-lg bg-orange-600 px-5 py-2 text-white"
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
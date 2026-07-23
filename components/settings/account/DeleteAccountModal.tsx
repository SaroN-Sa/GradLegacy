"use client";

import { useState } from "react";

import {
  AlertTriangle,
  Trash2,
  X,
} from "lucide-react";

interface DeleteAccountModalProps {
  open: boolean;
  loading?: boolean;
  onClose: () => void;
  onConfirm: (password: string) => Promise<void>;
}

export default function DeleteAccountModal({
  open,
  loading = false,
  onClose,
  onConfirm,
}: DeleteAccountModalProps) {
  const [password, setPassword] =
    useState("");

  if (!open) return null;

  const handleDelete = async () => {
    await onConfirm(password);

    setPassword("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4">

      <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-gray-900">

        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 p-4 sm:p-5 dark:border-gray-800">

          <div className="flex items-center gap-2.5 sm:gap-3">
            <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />

            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              Delete Account
            </h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

        </div>

        <div className="space-y-4 sm:space-y-5 overflow-y-auto p-5 sm:p-6">

          <div className="rounded-lg border border-red-300 bg-red-50 p-3.5 sm:p-4 text-sm sm:text-base text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
            This action is permanent.

            <ul className="mt-3 list-disc pl-5 sm:pl-6 text-sm">
              <li>Profile</li>
              <li>Timeline</li>
              <li>Gallery</li>
              <li>Wishes</li>
              <li>Voice Messages</li>
              <li>Memory Book</li>
              <li>Analytics</li>
            </ul>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Enter your password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 sm:py-2 text-sm text-gray-900 outline-none transition focus:border-red-600 focus:ring-4 focus:ring-red-600/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end sm:gap-3">

            <button
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2.5 sm:py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>

            <button
              disabled={loading}
              onClick={handleDelete}
              className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 sm:py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />

              {loading
                ? "Deleting..."
                : "Delete Account"}
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}
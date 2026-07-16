"use client";

import { AlertTriangle, Trash2 } from "lucide-react";

interface DeleteAccountCardProps {
  onDeleteAccount: () => void;
}

export default function DeleteAccountCard({
  onDeleteAccount,
}: DeleteAccountCardProps) {
  return (
    <div className="rounded-2xl border border-red-300 bg-red-50 p-6 shadow-sm dark:border-red-800 dark:bg-red-950">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
          <AlertTriangle className="h-5 w-5 text-red-600" />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-red-700 dark:text-red-400">
            Danger Zone
          </h2>

          <p className="text-sm text-red-600 dark:text-red-300">
            These actions are permanent and cannot be undone.
          </p>
        </div>
      </div>

      {/* Warning */}
      <div className="rounded-xl border border-red-200 bg-white p-4 dark:border-red-800 dark:bg-red-900">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Delete Account
        </h3>

        <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
          Deleting your account will permanently remove all of your
          GradLegacy data, including:
        </p>

        <ul className="mt-4 list-disc space-y-2 pl-6 text-sm text-gray-700 dark:text-gray-300">
          <li>Your profile</li>
          <li>Your timeline</li>
          <li>Your gallery</li>
          <li>Your wishes</li>
          <li>Your voice messages</li>
          <li>Your memory book</li>
          <li>Your analytics</li>
        </ul>

        <div className="mt-6">
          <button
            onClick={onDeleteAccount}
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-white transition hover:bg-red-700"
          >
            <Trash2 className="h-4 w-4" />

            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
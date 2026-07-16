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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl dark:bg-gray-900">

        <div className="flex items-center justify-between border-b p-5">

          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-red-600" />

            <h2 className="text-lg font-semibold">
              Delete Account
            </h2>
          </div>

          <button onClick={onClose}>
            <X className="h-5 w-5" />
          </button>

        </div>

        <div className="space-y-5 p-6">

          <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
            This action is permanent.

            <ul className="mt-3 list-disc pl-6">
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
            <label className="mb-2 block text-sm font-medium">
              Enter your password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="w-full rounded-lg border px-4 py-2"
            />
          </div>

          <div className="flex justify-end gap-3">

            <button
              onClick={onClose}
              className="rounded-lg border px-4 py-2"
            >
              Cancel
            </button>

            <button
              disabled={loading}
              onClick={handleDelete}
              className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2 text-white"
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
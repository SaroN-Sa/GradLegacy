"use client";

import { useState } from "react";

import { X, Lock, Save } from "lucide-react";

import { ChangePasswordData } from "@/types/account";

interface ChangePasswordModalProps {
  open: boolean;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (data: ChangePasswordData) => Promise<void>;
}

export default function ChangePasswordModal({
  open,
  loading = false,
  onClose,
  onSubmit,
}: ChangePasswordModalProps) {
  const [form, setForm] = useState<ChangePasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  if (!open) return null;

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (
      form.newPassword !== form.confirmPassword
    ) {
      setError("Passwords do not match.");
      return;
    }

    if (form.newPassword.length < 8) {
      setError(
        "Password must be at least 8 characters."
      );
      return;
    }

    setError("");

    await onSubmit(form);

    setForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4">
      <div className="flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-gray-900">

        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 p-4 sm:p-5 dark:border-gray-800">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Lock className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />

            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              Change Password
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

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 sm:space-y-5 overflow-y-auto p-5 sm:p-6"
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Current Password
            </label>

            <input
              type="password"
              required
              value={form.currentPassword}
              onChange={(e) =>
                setForm({
                  ...form,
                  currentPassword: e.target.value,
                })
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 sm:py-2 text-sm text-gray-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              New Password
            </label>

            <input
              type="password"
              required
              value={form.newPassword}
              onChange={(e) =>
                setForm({
                  ...form,
                  newPassword: e.target.value,
                })
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 sm:py-2 text-sm text-gray-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Confirm Password
            </label>

            <input
              type="password"
              required
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({
                  ...form,
                  confirmPassword: e.target.value,
                })
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 sm:py-2 text-sm text-gray-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-100 p-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2.5 sm:py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 sm:py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />

              {loading
                ? "Updating..."
                : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
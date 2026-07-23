"use client";

import { useState } from "react";
import { Mail, Save, X } from "lucide-react";

import { ChangeEmailData } from "@/types/account";

interface ChangeEmailModalProps {
  open: boolean;
  loading?: boolean;
  currentEmail: string;
  onClose: () => void;
  onSubmit: (data: ChangeEmailData) => Promise<void>;
}

export default function ChangeEmailModal({
  open,
  loading = false,
  currentEmail,
  onClose,
  onSubmit,
}: ChangeEmailModalProps) {
  const [email, setEmail] = useState(currentEmail);
  const [password, setPassword] = useState("");

  if (!open) return null;

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    await onSubmit({
      email,
      password,
    });

    setPassword("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4">
      <div className="flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-gray-900">
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 p-4 sm:p-5 dark:border-gray-800">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              Change Email
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

        <form
          onSubmit={handleSubmit}
          className="space-y-4 sm:space-y-5 overflow-y-auto p-5 sm:p-6"
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              New Email
            </label>

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 sm:py-2 text-sm text-gray-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Current Password
            </label>

            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 sm:py-2 text-sm text-gray-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2.5 sm:py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 sm:py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
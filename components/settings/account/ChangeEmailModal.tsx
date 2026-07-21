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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl dark:bg-gray-900">

        <div className="flex items-center justify-between border-b p-5">
          <div className="flex items-center gap-3">
            <Mail className="h-6 w-6 text-blue-600" />
            <h2 className="text-lg font-semibold">
              Change Email
            </h2>
          </div>

          <button onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6"
        >
          <div>
            <label className="mb-2 block text-sm font-medium">
              New Email
            </label>

            <input
              type="email"
              required
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full rounded-lg border px-4 py-2"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Current Password
            </label>

            <input
              type="password"
              required
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="w-full rounded-lg border px-4 py-2"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-4 py-2"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-white"
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
"use client";

import {
  BadgeAlert,
  BadgeCheck,
  Mail,
  Pencil,
} from "lucide-react";

import { AccountInfo } from "@/app/types/account";

interface EmailCardProps {
  account: AccountInfo | null;
  onChangeEmail: () => void;
  onVerifyEmail?: () => void;
}

export default function EmailCard({
  account,
  onChangeEmail,
  onVerifyEmail,
}: EmailCardProps) {
  if (!account) return null;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
          <Mail className="h-5 w-5 text-blue-600" />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Email
          </h2>

          <p className="text-sm text-gray-500">
            Manage your account email address.
          </p>
        </div>
      </div>

      {/* Email */}
      <div className="mb-6">
        <p className="text-sm text-gray-500">
          Email Address
        </p>

        <p className="mt-2 text-base font-medium text-gray-900 dark:text-white">
          {account.email}
        </p>
      </div>

      {/* Status */}
      <div className="mb-8 flex items-center gap-2">
        {account.emailVerification ? (
          <>
            <BadgeCheck className="h-5 w-5 text-green-600" />

            <span className="font-medium text-green-600">
              Verified
            </span>
          </>
        ) : (
          <>
            <BadgeAlert className="h-5 w-5 text-yellow-500" />

            <span className="font-medium text-yellow-500">
              Not Verified
            </span>
          </>
        )}
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={onChangeEmail}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
        >
          <Pencil className="h-4 w-4" />
          Change Email
        </button>

        {!account.emailVerification && onVerifyEmail && (
          <button
            onClick={onVerifyEmail}
            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Verify Email
          </button>
        )}
      </div>
    </div>
  );
}
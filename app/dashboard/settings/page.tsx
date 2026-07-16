"use client";

import Link from "next/link";

import {
  ChevronRight,
  Shield,
  Settings,
} from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-4xl p-6">

      <div className="mb-10">

        <div className="flex items-center gap-3">

          <Settings className="h-8 w-8 text-blue-600" />

          <div>

            <h1 className="text-3xl font-bold">
              Settings
            </h1>

            <p className="text-gray-500">
              Manage your GradLegacy account settings.
            </p>

          </div>

        </div>

      </div>

      <Link href="/dashboard/settings/account">

        <div className="cursor-pointer rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-blue-500 hover:shadow-md dark:border-gray-800 dark:bg-gray-900">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-4">

              <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">

                <Shield className="h-6 w-6 text-blue-600" />

              </div>

              <div>

                <h2 className="text-lg font-semibold">
                  Account
                </h2>

                <p className="text-sm text-gray-500">
                  Email, password, sessions and account security.
                </p>

              </div>

            </div>

            <ChevronRight className="h-5 w-5 text-gray-500" />

          </div>

        </div>

      </Link>

    </div>
  );
}
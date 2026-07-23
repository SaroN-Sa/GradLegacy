"use client";

import {
  Laptop,
  Globe,
  Monitor,
  LogOut,
  ShieldCheck,
} from "lucide-react";

import { SessionInfo } from "@/types/account";

interface SessionsCardProps {
  sessions: SessionInfo[];
  // This just opens the confirmation modal (e.g. () => setLogoutOpen(true)).
  // The actual account.deleteSessions() call + redirect happens in the
  // modal's onConfirm handler, NOT here.
  onLogoutAll: () => void;
}

export default function SessionsCard({
  sessions,
  onLogoutAll,
}: SessionsCardProps) {
  const currentSession =
    sessions.find((session) => session.current) || sessions[0];

  if (!currentSession) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
          Sessions
        </h2>

        <p className="mt-4 text-sm sm:text-base text-gray-500 dark:text-gray-400">
          No active sessions found.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      {/* Header */}
      <div className="mb-5 sm:mb-6 flex items-start sm:items-center gap-3">
        <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
          <Laptop className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
        </div>

        <div>
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
            Sessions
          </h2>

          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Manage your active login sessions.
          </p>
        </div>
      </div>

      {/* Current Device */}
      <div className="space-y-4 sm:space-y-5">

        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
          <span className="flex items-center gap-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">
            <Monitor className="h-5 w-5 shrink-0" />
            Device
          </span>

          <span className="font-medium text-gray-900 dark:text-white sm:text-right sm:max-w-[60%] break-words">
            {currentSession.deviceName || "Unknown Device"}
          </span>
        </div>

        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
          <span className="flex items-center gap-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">
            <Globe className="h-5 w-5 shrink-0" />
            Browser
          </span>

          <span className="font-medium text-gray-900 dark:text-white sm:text-right sm:max-w-[60%] break-words">
            {currentSession.clientName}
          </span>
        </div>

        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
          <span className="flex items-center gap-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">
            <Laptop className="h-5 w-5 shrink-0" />
            Operating System
          </span>

          <span className="font-medium text-gray-900 dark:text-white sm:text-right sm:max-w-[60%] break-words">
            {currentSession.osName}
          </span>
        </div>

        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
          <span className="flex items-center gap-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">
            <ShieldCheck className="h-5 w-5 shrink-0" />
            Status
          </span>

          <span className="w-fit rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700 dark:bg-green-900 dark:text-green-300">
            Current Session
          </span>
        </div>

      </div>

      {/* Logout */}
      <div className="mt-6 sm:mt-8">
        <button
          onClick={onLogoutAll}
          className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 sm:py-2 text-sm sm:text-base text-white transition hover:bg-orange-700"
        >
          <LogOut className="h-4 w-4" />

          Logout All Devices
        </button>
      </div>
    </div>
  );
}
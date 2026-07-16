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
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Sessions
        </h2>

        <p className="mt-4 text-gray-500">
          No active sessions found.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
          <Laptop className="h-5 w-5 text-green-600" />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Sessions
          </h2>

          <p className="text-sm text-gray-500">
            Manage your active login sessions.
          </p>
        </div>
      </div>

      {/* Current Device */}
      <div className="space-y-5">

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <Monitor className="h-5 w-5" />
            Device
          </span>

          <span className="font-medium">
            {currentSession.deviceName || "Unknown Device"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <Globe className="h-5 w-5" />
            Browser
          </span>

          <span className="font-medium">
            {currentSession.clientName}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <Laptop className="h-5 w-5" />
            Operating System
          </span>

          <span className="font-medium">
            {currentSession.osName}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <ShieldCheck className="h-5 w-5" />
            Status
          </span>

          <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700 dark:bg-green-900 dark:text-green-300">
            Current Session
          </span>
        </div>

      </div>

      {/* Logout */}
      <div className="mt-8">
        <button
          onClick={onLogoutAll}
          className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-white transition hover:bg-orange-700"
        >
          <LogOut className="h-4 w-4" />

          Logout All Devices
        </button>
      </div>
    </div>
  );
}
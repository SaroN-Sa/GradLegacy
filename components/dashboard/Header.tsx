"use client";

import { ArrowLeft, Bell } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { account } from "@/lib/appwrite";

interface HeaderProps {
  title: string;
  subtitle?: string;
  /** Show a back arrow before the title — use on nested/sub pages (e.g. Profile, Settings) */
  showBack?: boolean;
  /** Optional custom back handler; defaults to router.back() */
  onBack?: () => void;
}

export default function Header({ title, subtitle, showBack = false, onBack }: HeaderProps) {
  const { loading, user } = useCurrentUser();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const firstName = user?.name?.split(" ")[0];
  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  async function handleLogout() {
    try {
      await account.deleteSession("current");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      router.replace("/login");
    }
  }

  return (
    <header className="min-h-[4.5rem] sm:h-20 border-b border-gray-100 bg-white px-4 sm:px-6 md:px-8 py-3 sm:py-0 flex items-center justify-between gap-3 shrink-0 flex-wrap sm:flex-nowrap">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {showBack && (
          <button
            onClick={onBack ?? (() => router.back())}
            aria-label="Go back"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors shrink-0"
          >
            <ArrowLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
          </button>
        )}

        <div className="min-w-0">
          <h1 className="text-base sm:text-lg md:text-xl font-extrabold text-[#0f172a] tracking-tight truncate">
            {title}
          </h1>

          {subtitle && (
            <p className="text-xs sm:text-sm text-gray-400 mt-0.5 truncate">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-5 shrink-0">
        {/* Notifications */}
        <button
          aria-label="Notifications"
          className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors"
        >
          <Bell size={17} className="sm:w-[18px] sm:h-[18px]" />
          <span className="absolute top-2 right-2.5 w-1.5 h-1.5 rounded-full bg-red-500" />
        </button>

        {/* User */}
        <div className="relative flex items-center gap-2.5 sm:gap-3">
          {loading ? (
            <div className="space-y-2 hidden md:block">
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
            </div>
          ) : (
            <div className="text-right hidden md:block">
              <p className="text-sm font-semibold text-[#0f172a]">
                {firstName ? `${greeting}, ${firstName} 👋` : "Welcome 👋"}
              </p>
              <p className="text-xs text-gray-400">
                Manage your graduation page
              </p>
            </div>
          )}

          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Open user menu"
            className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#0f172a] to-[#1e3a5f] flex items-center justify-center text-yellow-400 font-bold text-xs sm:text-sm shrink-0 overflow-hidden"
          >
            {loading ? (
              <div className="w-full h-full bg-gray-200 animate-pulse" />
            ) : user?.image ? (
              <Image
                src={user.image}
                alt={user.name}
                width={40}
                height={40}
                className="object-cover w-full h-full"
              />
            ) : (
              initials || "U"
            )}

            {!loading && (
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white" />
            )}
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-12 sm:top-14 w-44 sm:w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-50">
              <p className="px-4 py-2 text-sm font-semibold text-[#0f172a] border-b border-gray-50 truncate">
                {user?.name || "Account"}
              </p>
              <a
                href="/dashboard/profile"
                className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                My Profile
              </a>
              <a
                href="/dashboard"
                className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                Dashboard
              </a>
              <a
                href="/dashboard/settings"
                className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                Settings
              </a>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
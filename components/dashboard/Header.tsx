"use client";

import { Bell } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  userName?: string;
  userImage?: string;
}

export default function Header({
  title,
  subtitle,
  userName,
  userImage,
}: HeaderProps) {
  const firstName = userName?.split(" ")[0];
  const initials = userName
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="h-20 border-b border-gray-100 bg-white px-8 flex items-center justify-between shrink-0">

      <div>
        <h1 className="text-xl font-extrabold text-[#0f172a] tracking-tight">
          {title}
        </h1>

        {subtitle && (
          <p className="text-sm text-gray-400 mt-0.5">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-5">

        <button
          aria-label="Notifications"
          className="relative w-10 h-10 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors"
        >
          <Bell size={18} />
          <span className="absolute top-2 right-2.5 w-1.5 h-1.5 rounded-full bg-red-500" />
        </button>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-[#0f172a]">
              {firstName ? `Welcome, ${firstName} 👋` : "Welcome 👋"}
            </p>
            <p className="text-xs text-gray-400">
              Manage your graduation page
            </p>
          </div>

          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0f172a] to-[#1e3a5f] flex items-center justify-center text-yellow-400 font-bold text-sm shrink-0 overflow-hidden">
            {userImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={userImage} alt={userName || "User"} className="w-full h-full object-cover" />
            ) : (
              initials || "U"
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
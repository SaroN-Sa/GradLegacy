"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  LayoutDashboard,
  User,
  Images,
  Clock3,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  GraduationCap,
} from "lucide-react";

import { authService } from "@/services/auth";

const menuItems = [
  { name: "Dashboard",  href: "/dashboard",                icon: LayoutDashboard },
  { name: "My Profile", href: "/dashboard/profile/edit",   icon: User },
  { name: "Gallery",    href: "/dashboard/gallery",        icon: Images },
  { name: "Timeline",   href: "/dashboard/timeline",       icon: Clock3 },
  { name: "Wishes",     href: "/dashboard/wishes",         icon: MessageSquare },
  { name: "Analytics",  href: "/dashboard/analytics",      icon: BarChart3 },
  { name: "Settings",   href: "/dashboard/settings",       icon: Settings },
] as const;

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    try {
      setLoggingOut(true);
      await authService.logout();
      router.push("/login");
    } catch (err) {
      console.error(err);
      setLoggingOut(false);
    }
  }

  return (
    <aside className="w-72 h-screen bg-[#0f172a] flex flex-col shrink-0 relative overflow-hidden">

      {/* Ambient glow — matches dashboard/auth design language */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/8 rounded-full blur-[100px] pointer-events-none" />

      {/* Logo */}
      <div className="p-6 border-b border-white/10 relative z-10">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-2.5 rounded-2xl backdrop-blur-sm border border-white/10 shrink-0">
            <GraduationCap className="h-6 w-6 text-yellow-400" />
          </div>
          <div>
            <h1 className="font-bold text-base text-white tracking-tight">
              Grad<span className="text-yellow-400">Legacy</span>
            </h1>
            <p className="text-[11px] text-white/40">
              Graduate Dashboard
            </p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 relative z-10 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 mb-1.5 text-sm font-medium transition-all ${
                active
                  ? "bg-white text-[#0f172a] shadow-lg shadow-black/20"
                  : "text-white/60 hover:bg-white/8 hover:text-white"
              }`}
            >
              <Icon size={18} className={active ? "text-[#0f172a]" : ""} />
              {item.name}
              {active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-yellow-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-white/10 p-4 relative z-10">
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LogOut size={18} />
          {loggingOut ? "Logging out…" : "Logout"}
        </button>
      </div>
    </aside>
  );
}
"use client";

import { useEffect, useState } from "react";
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
  Menu,
  X,
} from "lucide-react";

import { authService } from "@/services/auth";

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Profile", href: "/dashboard/profile", icon: User },
  { name: "Media", href: "/dashboard/media", icon: Images },
  { name: "Timeline", href: "/dashboard/timeline", icon: Clock3 },
  { name: "Wishes", href: "/dashboard/wishes", icon: MessageSquare },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
] as const;

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close the drawer whenever the route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll while the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

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

  const sidebarContent = (
    <>
      {/* Ambient glow — matches dashboard/auth design language */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/8 rounded-full blur-[100px] pointer-events-none" />

      {/* Logo */}
      <div className="p-6 border-b border-white/10 relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-2.5 rounded-2xl backdrop-blur-sm border border-white/10 shrink-0">
            <GraduationCap className="h-6 w-6 text-yellow-400" />
          </div>
          <div>
            <h1 className="font-bold text-base text-white tracking-tight">
              Grad<span className="text-yellow-400">Legacy</span>
            </h1>
            <p className="text-[11px] text-white/40">Graduate Dashboard</p>
          </div>
        </div>

        {/* Close button — mobile drawer only */}
        <button
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
          className="lg:hidden text-white/60 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
        >
          <X size={20} />
        </button>
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
    </>
  );

  return (
    <>
      {/* Mobile top bar — visible below lg breakpoint only */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#0f172a] flex items-center justify-between px-4 z-30 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm border border-white/10">
            <GraduationCap className="h-5 w-5 text-yellow-400" />
          </div>
          <h1 className="font-bold text-sm text-white tracking-tight">
            Grad<span className="text-yellow-400">Legacy</span>
          </h1>
        </div>

        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Spacer so page content isn't hidden under the fixed mobile top bar */}
      <div className="lg:hidden h-16" />

      {/* Overlay — mobile only, shown when drawer is open */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          aria-hidden="true"
        />
      )}

      {/* Desktop sidebar — always visible, static position */}
      <aside className="hidden lg:flex w-72 h-screen bg-[#0f172a] flex-col shrink-0 relative overflow-hidden">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar — slide-in drawer */}
      <aside
        className={`lg:hidden fixed top-0 left-0 h-screen w-[85%] max-w-72 bg-[#0f172a] flex flex-col shrink-0 relative overflow-hidden z-50 transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
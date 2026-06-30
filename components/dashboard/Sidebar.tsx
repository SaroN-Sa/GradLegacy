"use client";

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

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "My Profile",
      href: "/dashboard/profile/edit",
      icon: User,
    },
    {
      name: "Gallery",
      href: "/dashboard/gallery",
      icon: Images,
    },
    {
      name: "Timeline",
      href: "/dashboard/timeline",
      icon: Clock3,
    },
    {
      name: "Wishes",
      href: "/dashboard/wishes",
      icon: MessageSquare,
    },
    {
      name: "Analytics",
      href: "/dashboard/analytics",
      icon: BarChart3,
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ];

  async function handleLogout() {
    await authService.logout();
    router.push("/login");
  }

  return (
    <aside className="w-72 h-screen border-r bg-white dark:bg-zinc-900 flex flex-col">

      {/* Logo */}

      <div className="p-6 border-b">
        <div className="flex items-center gap-3">

          <GraduationCap className="h-8 w-8 text-blue-600" />

          <div>
            <h1 className="font-bold text-xl">
              GradLegacy
            </h1>

            <p className="text-xs text-gray-500">
              Graduate Dashboard
            </p>
          </div>

        </div>
      </div>

      {/* Menu */}

      <nav className="flex-1 p-4">

        {menuItems.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 mb-2 transition

              ${
                active
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100 dark:hover:bg-zinc-800"
              }`}
            >
              <Icon size={20} />

              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}

      <div className="border-t p-4">

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-red-600 hover:bg-red-50"
        >
          <LogOut size={20} />

          Logout
        </button>

      </div>

    </aside>
  );
}
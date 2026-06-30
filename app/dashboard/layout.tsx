"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";

import {
  UserProvider,
} from "@/context/UserContext";

import {
  ProfileProvider,
} from "@/context/ProfileContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <ProfileProvider>

        <div className="flex h-screen bg-gray-50 dark:bg-zinc-950">

          <Sidebar />

          <div className="flex flex-1 flex-col">

            <Header
              title="Dashboard"
              subtitle="Welcome back to GradLegacy"
            />

            <main className="flex-1 overflow-y-auto p-8">
              {children}
            </main>

          </div>

        </div>

      </ProfileProvider>
    </UserProvider>
  );
}
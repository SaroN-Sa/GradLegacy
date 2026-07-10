"use client";

import { useState, useEffect } from "react";
import { authService } from "@/services/auth"; // adjust path if different
import { Models } from "appwrite";
import TimelineList from "@/components/timeline/TimelineList";

export default function DashboardTimelinePage() {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      setIsLoading(false);
    };
    loadUser();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-[#FFD700] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 text-center text-slate-400">
        Please sign in to manage your timeline.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <TimelineList userId={user.$id} />
    </div>
  );
}
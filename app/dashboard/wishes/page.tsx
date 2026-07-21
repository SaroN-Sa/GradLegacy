"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Sparkles,
  Clock,
  CheckCircle2,
  MessageSquareHeart,
  AlertCircle,
} from "lucide-react";

import { account } from "@/lib/appwrite";
import { wishService } from "@/services/wish";
import { Wish } from "@/types/wish";

import WishList from "@/components/wishes/WishList";

const STAT_CARDS = [
  {
    key: "total",
    label: "Total Wishes",
    icon: MessageSquareHeart,
    valueClassName: "text-white",
    iconClassName: "bg-slate-800 text-slate-300",
  },
  {
    key: "pending",
    label: "Pending",
    icon: Clock,
    valueClassName: "text-amber-400",
    iconClassName: "bg-amber-500/10 text-amber-400",
  },
  {
    key: "published",
    label: "Published",
    icon: CheckCircle2,
    valueClassName: "text-emerald-400",
    iconClassName: "bg-emerald-500/10 text-emerald-400",
  },
  {
    key: "featured",
    label: "Featured",
    icon: Sparkles,
    valueClassName: "text-[#FFD700]",
    iconClassName: "bg-[#FFD700]/10 text-[#FFD700]",
  },
] as const;

export default function DashboardWishPage() {
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [statsError, setStatsError] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await account.get();
        setUserId(user.$id);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  async function loadStats() {
    if (!userId) return;

    try {
      setStatsError(false);
      const data = await wishService.getWishes(userId);
      setWishes(data);
    } catch (error) {
      console.error(error);
      setStatsError(true);
    }
  }

  useEffect(() => {
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const stats = useMemo(() => {
    return {
      total: wishes.length,
      pending: wishes.filter((w) => w.status === "pending").length,
      published: wishes.filter((w) => w.status === "published").length,
      featured: wishes.filter((w) => w.isFeatured).length,
    };
  }, [wishes]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#FFD700] border-t-transparent" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-6 shadow-lg shadow-black/20">
          <h1 className="text-3xl font-bold text-white">
            Graduation Wishes
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            View and manage all wishes submitted by your family, friends,
            teachers, relatives and visitors.
          </p>
        </div>

        {/* Statistics */}
        <div className="mb-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {STAT_CARDS.map((card) => {
            const Icon = card.icon;
            const value = stats[card.key as keyof typeof stats];

            return (
              <div
                key={card.key}
                className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-6 shadow-lg shadow-black/20 transition-colors hover:border-slate-700"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-400">{card.label}</p>
                  <div className={`rounded-lg p-2 ${card.iconClassName}`}>
                    <Icon size={16} />
                  </div>
                </div>

                <h2 className={`mt-3 text-3xl font-bold ${card.valueClassName}`}>
                  {statsError ? "—" : value}
                </h2>
              </div>
            );
          })}
        </div>

        {statsError && (
          <div className="mb-8 flex items-center gap-2 rounded-2xl border border-red-500/30 bg-red-900/20 p-4 text-sm text-red-300">
            <AlertCircle size={16} className="shrink-0" />
            Couldn't load wish statistics. The list below may still work.
          </div>
        )}

        {/* Wishes — WishList handles its own delete confirmation internally */}
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-6 shadow-lg shadow-black/20">
          <WishList userId={userId} dashboard />
        </div>
      </div>
    </main>
  );
}
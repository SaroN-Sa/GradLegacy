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
    valueClassName: "text-gray-900",
    iconClassName: "bg-slate-100 text-slate-600",
  },
  {
    key: "pending",
    label: "Pending",
    icon: Clock,
    valueClassName: "text-yellow-600",
    iconClassName: "bg-yellow-50 text-yellow-600",
  },
  {
    key: "published",
    label: "Published",
    icon: CheckCircle2,
    valueClassName: "text-green-600",
    iconClassName: "bg-green-50 text-green-600",
  },
  {
    key: "featured",
    label: "Featured",
    icon: Sparkles,
    valueClassName: "text-blue-600",
    iconClassName: "bg-blue-50 text-blue-600",
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

  useEffect(() => {
    if (!userId) return;

    const loadStats = async () => {
      try {
        setStatsError(false);
        const data = await wishService.getWishes(userId);
        setWishes(data);
      } catch (error) {
        console.error(error);
        setStatsError(true);
      }
    };

    loadStats();
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
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg font-medium text-gray-500">
          Loading wishes...
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow">
          <h1 className="text-3xl font-bold text-gray-900">
            Graduation Wishes
          </h1>

          <p className="mt-2 text-gray-500">
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
                className="rounded-xl bg-white p-6 shadow transition-shadow hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">{card.label}</p>
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
          <div className="mb-8 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            <AlertCircle size={16} className="shrink-0" />
            Couldn't load wish statistics. The list below may still work.
          </div>
        )}

        {/* Wishes */}
        <div className="rounded-xl bg-white p-6 shadow">
          <WishList userId={userId} dashboard />
        </div>
      </div>
    </main>
  );
}
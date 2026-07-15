"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Sparkles,
  Clock,
  CheckCircle2,
  MessageSquareHeart,
  AlertCircle,
  AlertTriangle,
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
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  async function performDelete(wishId: string) {
    try {
      setDeletingId(wishId);
      await wishService.deleteWish(wishId);
      await loadStats();
      toast.success("Wish deleted.");
    } catch (error) {
      console.error(error);
      toast.error("Couldn't delete that wish. Try again.");
    } finally {
      setDeletingId(null);
    }
  }

  function handleDeleteRequest(wishId: string) {
    toast.custom(
      (t) => (
        <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-4 shadow-xl shadow-black/30">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-900/20 text-red-400">
              <AlertTriangle size={16} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white">
                Delete this wish?
              </p>
              <p className="mt-0.5 text-xs text-slate-400">
                This can't be undone. Reactions on it will be lost too.
              </p>

              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => toast.dismiss(t)}
                  className="flex-1 rounded-xl border border-slate-700 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    toast.dismiss(t);
                    performDelete(wishId);
                  }}
                  className="flex-1 rounded-xl border border-red-500/40 bg-red-900/30 py-1.5 text-xs font-medium text-red-300 transition-colors hover:border-red-500/60 hover:bg-red-900/50"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      ),
      { duration: 8000 }
    );
  }

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

        {/* Wishes */}
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-6 shadow-lg shadow-black/20">
          <WishList
            userId={userId}
            dashboard
            onDelete={handleDeleteRequest}
            deletingId={deletingId}
          />
        </div>
      </div>
    </main>
  );
}
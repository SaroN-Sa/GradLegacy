"use client";

import { useEffect, useMemo, useState } from "react";
import { MessageSquareHeart } from "lucide-react";

import { wishService } from "@/services/wish";

import { Wish } from "@/types/wish";

import WishCard from "./WishCard";
import WishFilters from "./WishFilters";

interface WishListProps {
  userId: string;
  dashboard?: boolean;
}

export default function WishList({
  userId,
  dashboard = false,
}: WishListProps) {
  const [loading, setLoading] = useState(true);

  const [wishes, setWishes] = useState<Wish[]>([]);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState<
    "all" | "pending" | "published" | "hidden"
  >("all");

  const loadWishes = async () => {
    try {
      setLoading(true);

      const data = dashboard
        ? await wishService.getWishes(userId)
        : await wishService.getPublishedWishes(userId);

      setWishes(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishes();
  }, [userId]);

  const filteredWishes = useMemo(() => {
    return wishes.filter((wish) => {
      const matchesSearch =
        wish.visitorName
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        wish.message
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        wish.relationship
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        status === "all"
          ? true
          : wish.status === status;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [wishes, search, status]);

  const publishWish = async (
    wishId: string
  ) => {
    await wishService.updateWish(wishId, {
      status: "published",
    });

    loadWishes();
  };

  const hideWish = async (
    wishId: string
  ) => {
    await wishService.updateWish(wishId, {
      status: "hidden",
    });

    loadWishes();
  };

  const featureWish = async (
    wishId: string
  ) => {
    const wish = wishes.find(
      (item) => item.$id === wishId
    );

    if (!wish) return;

    await wishService.updateWish(wishId, {
      isFeatured: !wish.isFeatured,
    });

    loadWishes();
  };

  const deleteWish = async (
    wishId: string
  ) => {
    const confirmed = confirm(
      "Delete this wish?"
    );

    if (!confirmed) return;

    await wishService.deleteWish(
      wishId
    );

    loadWishes();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-2 border-[#FFD700] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <WishFilters
        search={search}
        status={status}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
      />

      {filteredWishes.length === 0 && (
        <div className="rounded-3xl border border-dashed border-slate-700 bg-gradient-to-br from-slate-900 to-slate-950 p-10 text-center">
          <MessageSquareHeart className="mx-auto mb-3 text-slate-600" size={28} />
          <p className="text-sm text-slate-400">No wishes found.</p>
        </div>
      )}

      <div className="space-y-6">

        {filteredWishes.map((wish) => (
          <WishCard
            key={wish.$id}
            wish={wish}
            showActions={dashboard}
            onPublish={publishWish}
            onHide={hideWish}
            onDelete={deleteWish}
            onFeature={featureWish}
          />
        ))}

      </div>

    </div>
  );
}
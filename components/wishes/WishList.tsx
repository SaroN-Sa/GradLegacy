"use client";

import { useEffect, useMemo, useState } from "react";
import { MessageSquareHeart, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

import { wishService } from "@/services/wish";

import { Wish } from "@/types/wish";

import WishCard from "./WishCard";
import WishFilters from "./WishFilters";

interface WishListProps {
  userId: string;
  dashboard?: boolean;
}

function DeleteWishDialog({
  open,
  isDeleting,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onCancel}
      />

      <div className="relative w-full max-w-sm rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-6 shadow-2xl">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-900/20 text-red-400 mb-4">
          <AlertTriangle size={22} />
        </div>

        <h3 className="text-lg font-semibold text-white mb-1.5">
          Delete this wish?
        </h3>

        <p className="text-sm text-slate-400 mb-6">
          This action cannot be undone. The wish will be permanently removed.
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 py-2.5 rounded-3xl border border-slate-700 text-slate-300 text-sm font-medium hover:border-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 py-2.5 rounded-3xl bg-red-900/30 border border-red-500/40 text-red-300 text-sm font-medium hover:bg-red-900/50 hover:border-red-500/60 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
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

  const [wishPendingDelete, setWishPendingDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadWishes = async () => {
    try {
      setLoading(true);

      const data = dashboard
        ? await wishService.getWishes(userId)
        : await wishService.getPublishedWishes(userId);

      setWishes(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load wishes.");
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

  const publishWish = async (wishId: string) => {
    try {
      await wishService.updateWish(wishId, { status: "published" });
      await loadWishes();
      toast.success("Wish published.");
    } catch (error) {
      console.error(error);
      toast.error("Couldn't publish that wish.");
    }
  };

  const hideWish = async (wishId: string) => {
    try {
      await wishService.updateWish(wishId, { status: "hidden" });
      await loadWishes();
      toast.success("Wish hidden.");
    } catch (error) {
      console.error(error);
      toast.error("Couldn't hide that wish.");
    }
  };

  const featureWish = async (wishId: string) => {
    const wish = wishes.find((item) => item.$id === wishId);
    if (!wish) return;

    try {
      await wishService.updateWish(wishId, { isFeatured: !wish.isFeatured });
      await loadWishes();
      toast.success(wish.isFeatured ? "Removed from featured." : "Marked as featured.");
    } catch (error) {
      console.error(error);
      toast.error("Couldn't update that wish.");
    }
  };

  const deleteWish = (wishId: string) => {
    setWishPendingDelete(wishId);
  };

  const cancelDelete = () => {
    if (isDeleting) return;
    setWishPendingDelete(null);
  };

  const confirmDelete = async () => {
    if (!wishPendingDelete) return;

    try {
      setIsDeleting(true);
      await wishService.deleteWish(wishPendingDelete);
      await loadWishes();
      toast.success("Wish deleted.");
    } catch (error) {
      console.error(error);
      toast.error("Couldn't delete that wish.");
    } finally {
      setIsDeleting(false);
      setWishPendingDelete(null);
    }
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

      <DeleteWishDialog
        open={wishPendingDelete !== null}
        isDeleting={isDeleting}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

    </div>
  );
}
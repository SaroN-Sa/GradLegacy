"use client";

import { useEffect, useMemo, useState } from "react";
import { MessageSquareHeart, AlertTriangle, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { wishService } from "@/services/wish";

import { Wish } from "@/types/wish";

import WishCard from "./WishCard";
import WishFilters from "./WishFilters";
import WishLightbox, { LightboxItem } from "./WishLightbox";

interface WishListProps {
  userId: string;
  dashboard?: boolean;
  onBack?: () => void; // optional — only shown in the dashboard variant, if provided
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
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />

      <div className="relative w-full max-w-sm rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-5 sm:p-6 shadow-2xl">
        <div className="mb-4 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-red-900/20 text-red-400">
          <AlertTriangle size={20} />
        </div>

        <h3 className="mb-1.5 text-base sm:text-lg font-semibold text-white">Delete this wish?</h3>

        <p className="mb-6 text-sm text-slate-400">
          This action cannot be undone. The wish will be permanently removed.
        </p>

        <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 rounded-3xl border border-slate-700 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:border-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 rounded-3xl border border-red-500/40 bg-red-900/30 py-2.5 text-sm font-medium text-red-300 transition-colors hover:border-red-500/60 hover:bg-red-900/50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function WishList({ userId, dashboard = false, onBack }: WishListProps) {
  const [loading, setLoading] = useState(true);
  const [wishes, setWishes] = useState<Wish[]>([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "pending" | "published" | "hidden">("all");

  // Which single wish is mid-update (publish/hide/feature) — drives WishCard's isProcessing prop
  const [processingId, setProcessingId] = useState<string | null>(null);

  const [wishPendingDelete, setWishPendingDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Index into `mediaItems` for the lightbox, or null when closed
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const filteredWishes = useMemo(() => {
    return wishes.filter((wish) => {
      const matchesSearch =
        wish.visitorName.toLowerCase().includes(search.toLowerCase()) ||
        wish.message.toLowerCase().includes(search.toLowerCase()) ||
        wish.relationship.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = status === "all" ? true : wish.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [wishes, search, status]);

  // Flattened list of every image/video across the currently visible wishes,
  // in card order — this is what the lightbox scrolls/swipes through.
  const mediaItems: LightboxItem[] = useMemo(() => {
    const items: LightboxItem[] = [];
    filteredWishes.forEach((wish) => {
      if (wish.imageUrl) {
        items.push({ type: "image", url: wish.imageUrl, name: wish.visitorName });
      }
      if (wish.videoUrl) {
        items.push({ type: "video", url: wish.videoUrl, name: wish.visitorName });
      }
    });
    return items;
  }, [filteredWishes]);

  const openMedia = (type: "image" | "video", url: string) => {
    const idx = mediaItems.findIndex((item) => item.type === type && item.url === url);
    if (idx !== -1) setLightboxIndex(idx);
  };

  const publishWish = async (wishId: string) => {
    if (processingId) return; // one in-flight action at a time
    setProcessingId(wishId);
    try {
      await wishService.updateWish(wishId, { status: "published" });
      await loadWishes();
      toast.success("Wish published.");
    } catch (error) {
      console.error(error);
      toast.error("Couldn't publish that wish.");
    } finally {
      setProcessingId(null);
    }
  };

  const hideWish = async (wishId: string) => {
    if (processingId) return;
    setProcessingId(wishId);
    try {
      await wishService.updateWish(wishId, { status: "hidden" });
      await loadWishes();
      toast.success("Wish hidden.");
    } catch (error) {
      console.error(error);
      toast.error("Couldn't hide that wish.");
    } finally {
      setProcessingId(null);
    }
  };

  const featureWish = async (wishId: string) => {
    if (processingId) return;
    const wish = wishes.find((item) => item.$id === wishId);
    if (!wish) return;

    setProcessingId(wishId);
    try {
      await wishService.updateWish(wishId, { isFeatured: !wish.isFeatured });
      await loadWishes();
      toast.success(wish.isFeatured ? "Removed from featured." : "Marked as featured.");
    } catch (error) {
      console.error(error);
      toast.error("Couldn't update that wish.");
    } finally {
      setProcessingId(null);
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
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#FFD700] border-t-transparent" />
      </div>
    );
  }

  const deleteDialog = (
    <DeleteWishDialog
      open={wishPendingDelete !== null}
      isDeleting={isDeleting}
      onConfirm={confirmDelete}
      onCancel={cancelDelete}
    />
  );

  const lightbox = lightboxIndex !== null && (
    <WishLightbox
      items={mediaItems}
      index={lightboxIndex}
      onClose={() => setLightboxIndex(null)}
      onIndexChange={setLightboxIndex}
    />
  );

  // -------------------------------------------------------------------
  // Public page: TikTok-style full-height vertical snap-scroll feed.
  // Swipe / scroll up and down to move between wishes.
  // -------------------------------------------------------------------
  if (!dashboard) {
    if (filteredWishes.length === 0) {
      return (
        <div className="flex h-[100dvh] items-center justify-center px-4">
          <div className="rounded-3xl border border-dashed border-slate-700 bg-gradient-to-br from-slate-900 to-slate-950 p-6 sm:p-10 text-center">
            <MessageSquareHeart className="mx-auto mb-3 text-slate-600" size={28} />
            <p className="text-sm text-slate-400">No wishes found.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="h-[100dvh] w-full snap-y snap-mandatory overflow-y-scroll scroll-smooth">
        {filteredWishes.map((wish) => (
          <section
            key={wish.$id}
            className="flex h-[100dvh] w-full snap-start snap-always items-center justify-center px-0 py-0 sm:px-6 sm:py-6"
          >
            <div className="h-full w-full max-w-md sm:h-[92dvh]">
              <WishCard wish={wish} variant="feed" onMediaClick={openMedia} />
            </div>
          </section>
        ))}

        {deleteDialog}
        {lightbox}
      </div>
    );
  }

  // -------------------------------------------------------------------
  // Dashboard: normal stacked list with filters and management actions.
  // -------------------------------------------------------------------
  return (
    <div className="space-y-5 sm:space-y-6">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      )}

      <WishFilters search={search} status={status} onSearchChange={setSearch} onStatusChange={setStatus} />

      {filteredWishes.length === 0 && (
        <div className="rounded-3xl border border-dashed border-slate-700 bg-gradient-to-br from-slate-900 to-slate-950 p-6 sm:p-10 text-center">
          <MessageSquareHeart className="mx-auto mb-3 text-slate-600" size={28} />
          <p className="text-sm text-slate-400">No wishes found.</p>
        </div>
      )}

      <div className="space-y-5 sm:space-y-6">
        {filteredWishes.map((wish) => (
          <WishCard
            key={wish.$id}
            wish={wish}
            variant="list"
            showActions={dashboard}
            onPublish={publishWish}
            onHide={hideWish}
            onDelete={deleteWish}
            onFeature={featureWish}
            onMediaClick={openMedia}
            isProcessing={processingId === wish.$id}
          />
        ))}
      </div>

      {deleteDialog}
      {lightbox}
    </div>
  );
}
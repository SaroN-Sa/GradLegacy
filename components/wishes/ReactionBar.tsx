"use client";

import { useEffect, useMemo, useState } from "react";

import { reactionService } from "@/services/reaction";

import { Reaction, ReactionType } from "@/types/reaction";

interface ReactionBarProps {
  wishId: string;
}

const reactions: {
  type: ReactionType;
  emoji: string;
  label: string;
}[] = [
  { type: "love", emoji: "❤️", label: "Love" },
  { type: "congratulations", emoji: "🎉", label: "Congratulations" },
  { type: "proud", emoji: "👏", label: "Proud" },
  { type: "amazing", emoji: "🤩", label: "Amazing" },
  { type: "inspiring", emoji: "🌟", label: "Inspiring" },
];

function getGuestId() {
  if (typeof window === "undefined") {
    return "";
  }

  let guestId = localStorage.getItem("guestId");

  if (!guestId) {
    guestId = crypto.randomUUID();
    localStorage.setItem("guestId", guestId);
  }

  return guestId;
}

export default function ReactionBar({ wishId }: ReactionBarProps) {
  const [loading, setLoading] = useState<ReactionType | null>(null);
  const [reactionList, setReactionList] = useState<Reaction[]>([]);
  const [guestReactionId, setGuestReactionId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<ReactionType | null>(null);

  const guestId = useMemo(() => getGuestId(), []);

  const loadReactions = async () => {
    try {
      const data = await reactionService.getWishReactions(wishId);
      setReactionList(data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadGuestReaction = async () => {
    if (!guestId) return;
    try {
      const existing = await reactionService.getGuestReaction(wishId, guestId);
      if (existing) {
        setGuestReactionId(existing.$id);
        setActiveType(existing.reactionType as ReactionType);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadReactions();
    loadGuestReaction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wishId]);

  const counts = useMemo(() => {
    return reactions.reduce((acc, reaction) => {
      acc[reaction.type] = reactionList.filter(
        (item) => item.reactionType === reaction.type
      ).length;
      return acc;
    }, {} as Record<ReactionType, number>);
  }, [reactionList]);

  const handleReaction = async (reactionType: ReactionType) => {
    // Toggle off if clicking the already-active reaction
    const isRemoving = activeType === reactionType;

    try {
      setLoading(reactionType);

      const previousType = activeType;
      const previousGuestReactionId = guestReactionId;

      // Optimistic update
      setActiveType(isRemoving ? null : reactionType);

      if (!previousGuestReactionId) {
        const created = await reactionService.createReaction({
          wishId,
          guestId,
          reactionType,
        });
        setGuestReactionId(created?.$id ?? null);
      } else if (isRemoving) {
        await reactionService.deleteReaction?.(previousGuestReactionId);
        setGuestReactionId(null);
      } else {
        await reactionService.updateReaction(previousGuestReactionId, {
          reactionType,
        });
      }

      await loadReactions();
    } catch (error) {
      console.error(error);
      // Revert optimistic update on failure
      await loadGuestReaction();
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-4">
      {reactions.map((reaction) => {
        const isActive = activeType === reaction.type;
        const count = counts[reaction.type] ?? 0;
        const isLoading = loading === reaction.type;

        return (
          <button
            key={reaction.type}
            disabled={loading !== null}
            onClick={() => handleReaction(reaction.type)}
            title={reaction.label}
            aria-pressed={isActive}
            className={`flex items-center gap-1 rounded-full border px-2.5 py-1.5 text-xs font-medium transition-all disabled:cursor-not-allowed ${
              isActive
                ? "border-[#FFD700] bg-[#FFD700]/10 text-slate-900 scale-105"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
            } ${isLoading ? "opacity-50" : "opacity-100"}`}
          >
            <span className="text-sm leading-none">{reaction.emoji}</span>
            {count > 0 && (
              <span
                className={`text-[11px] font-semibold tabular-nums ${
                  isActive ? "text-slate-900" : "text-slate-500"
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
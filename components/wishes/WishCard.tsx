"use client";

import Image from "next/image";
import {
  CheckCircle2,
  EyeOff,
  Star,
  Trash2,
  Clock,
  Sparkles,
  Users,
  GraduationCap,
  Heart,
  Briefcase,
  UserRound,
  User,
  Loader2,
} from "lucide-react";

import { Wish, WishRelationship } from "@/types/wish";
import ReactionBar from "./ReactionBar";

interface WishCardProps {
  wish: Wish;
  showActions?: boolean;
  onPublish?: (wishId: string) => void;
  onHide?: (wishId: string) => void;
  onDelete?: (wishId: string) => void;
  onFeature?: (wishId: string) => void;
  isProcessing?: boolean;
}

const RELATIONSHIP_ICONS: Record<WishRelationship, typeof User> = {
  parent: Heart,
  friend: Users,
  teacher: GraduationCap,
  relative: UserRound,
  mentor: User,
  colleague: Briefcase,
};

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/30",
  },
  published: {
    label: "Published",
    icon: CheckCircle2,
    className: "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30",
  },
  hidden: {
    label: "Hidden",
    icon: EyeOff,
    className: "bg-slate-800 text-slate-400 ring-1 ring-slate-700",
  },
} as const;

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function WishCard({
  wish,
  showActions = false,
  onPublish,
  onHide,
  onDelete,
  onFeature,
  isProcessing = false,
}: WishCardProps) {
  const displayName = wish.isAnonymous ? "Anonymous" : wish.visitorName;
  const RelationshipIcon = RELATIONSHIP_ICONS[wish.relationship] ?? User;
  const statusInfo = STATUS_CONFIG[wish.status as keyof typeof STATUS_CONFIG];
  const StatusIcon = statusInfo?.icon;

  return (
    <div
      className={`group overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 shadow-lg shadow-black/20 transition-all hover:border-slate-700 ${
        isProcessing ? "opacity-60" : "opacity-100"
      }`}
    >
      {/* Media */}
      {(wish.imageUrl || wish.videoUrl) && (
        <div className="relative">
          {wish.imageUrl && (
            <div className="relative h-64 w-full bg-slate-900">
              <Image
                src={wish.imageUrl}
                alt="Wish Image"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          )}

          {wish.videoUrl && (
            <video controls className="w-full bg-black">
              <source src={wish.videoUrl} type="video/mp4" />
            </video>
          )}

          {wish.isFeatured && (
            <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-[#FFD700] px-2.5 py-1 text-[11px] font-semibold text-slate-900 shadow-sm">
              <Sparkles size={12} />
              Featured
            </span>
          )}
        </div>
      )}

      <div className="space-y-4 p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-800 text-sm font-semibold text-slate-300">
              {getInitials(displayName)}
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">
                {displayName}
              </h3>
              <div className="flex items-center gap-1 text-xs capitalize text-slate-400">
                <RelationshipIcon size={12} />
                {wish.relationship}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5">
            {!wish.imageUrl && !wish.videoUrl && wish.isFeatured && (
              <span className="flex items-center gap-1 rounded-full bg-[#FFD700]/10 px-2.5 py-1 text-[11px] font-semibold text-[#FFD700]">
                <Sparkles size={12} />
                Featured
              </span>
            )}
            {statusInfo && (
              <span
                className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium ${statusInfo.className}`}
              >
                {StatusIcon && <StatusIcon size={12} />}
                {statusInfo.label}
              </span>
            )}
          </div>
        </div>

        {/* Message */}
        <p className="whitespace-pre-line text-sm leading-relaxed text-slate-300">
          {wish.message}
        </p>

        <div className="text-xs text-slate-500">
          {new Date(wish.createdAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>

        <ReactionBar wishId={wish.$id} />

        {/* Actions */}
        {showActions && (
          <div className="flex flex-wrap items-center gap-2 border-t border-slate-800 pt-4">
            {wish.status === "pending" && (
              <button
                onClick={() => onPublish?.(wish.$id)}
                disabled={isProcessing}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <CheckCircle2 size={14} />
                Publish
              </button>
            )}

            {wish.status === "published" && (
              <>
                <button
                  onClick={() => onHide?.(wish.$id)}
                  disabled={isProcessing}
                  className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <EyeOff size={14} />
                  Hide
                </button>

                <button
                  onClick={() => onFeature?.(wish.$id)}
                  disabled={isProcessing}
                  className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                    wish.isFeatured
                      ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                      : "bg-[#FFD700] text-slate-900 hover:bg-[#FFD700]/90"
                  }`}
                >
                  <Star size={14} fill={wish.isFeatured ? "currentColor" : "none"} />
                  {wish.isFeatured ? "Remove Feature" : "Feature"}
                </button>
              </>
            )}

            <button
              onClick={() => onDelete?.(wish.$id)}
              disabled={isProcessing}
              className="ml-auto flex items-center gap-1.5 rounded-2xl border border-slate-700 px-3.5 py-2 text-xs font-medium text-slate-300 transition-colors hover:border-red-500/50 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isProcessing ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Trash2 size={13} />
              )}
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
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
    className: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  },
  published: {
    label: "Published",
    icon: CheckCircle2,
    className: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  },
  hidden: {
    label: "Hidden",
    icon: EyeOff,
    className: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
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
}: WishCardProps) {
  const displayName = wish.isAnonymous ? "Anonymous" : wish.visitorName;
  const RelationshipIcon = RELATIONSHIP_ICONS[wish.relationship] ?? User;
  const statusInfo = STATUS_CONFIG[wish.status as keyof typeof STATUS_CONFIG];
  const StatusIcon = statusInfo?.icon;

  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Media */}
      {(wish.imageUrl || wish.videoUrl) && (
        <div className="relative">
          {wish.imageUrl && (
            <div className="relative h-64 w-full bg-slate-100">
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
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
              {getInitials(displayName)}
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                {displayName}
              </h3>
              <div className="flex items-center gap-1 text-xs text-slate-500 capitalize">
                <RelationshipIcon size={12} />
                {wish.relationship}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5">
            {!wish.imageUrl && !wish.videoUrl && wish.isFeatured && (
              <span className="flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-1 text-[11px] font-semibold text-yellow-700">
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
        <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700">
          {wish.message}
        </p>

        <div className="text-xs text-slate-400">
          {new Date(wish.createdAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>

        <ReactionBar wishId={wish.$id} />

        {/* Actions */}
        {showActions && (
          <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
            {wish.status === "pending" && (
              <button
                onClick={() => onPublish?.(wish.$id)}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-700"
              >
                <CheckCircle2 size={14} />
                Publish
              </button>
            )}

            {wish.status === "published" && (
              <>
                <button
                  onClick={() => onHide?.(wish.$id)}
                  className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-amber-600"
                >
                  <EyeOff size={14} />
                  Hide
                </button>

                <button
                  onClick={() => onFeature?.(wish.$id)}
                  className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors ${
                    wish.isFeatured
                      ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  <Star size={14} fill={wish.isFeatured ? "currentColor" : "none"} />
                  {wish.isFeatured ? "Remove Feature" : "Feature"}
                </button>
              </>
            )}

            <button
              onClick={() => onDelete?.(wish.$id)}
              className="ml-auto flex items-center gap-1.5 rounded-lg bg-red-50 px-3.5 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100"
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
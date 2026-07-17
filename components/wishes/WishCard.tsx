"use client";

import { useEffect, useRef, useState } from "react";
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
  Maximize2,
  Volume2,
  VolumeX,
  Quote,
} from "lucide-react";

import { Wish, WishRelationship } from "@/types/wish";
import ReactionBar from "./ReactionBar";

interface WishCardProps {
  wish: Wish;
  variant?: "list" | "feed";
  showActions?: boolean;
  onPublish?: (wishId: string) => void;
  onHide?: (wishId: string) => void;
  onDelete?: (wishId: string) => void;
  onFeature?: (wishId: string) => void;
  onMediaClick?: (type: "image" | "video", url: string) => void;
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

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Bigger, bolder type for short wishes; scales down as the message grows. */
function getFeedTextSizeClass(messageLength: number) {
  if (messageLength < 80) return "text-2xl sm:text-3xl";
  if (messageLength < 200) return "text-xl sm:text-2xl";
  return "text-base sm:text-lg";
}

export default function WishCard({
  wish,
  variant = "list",
  showActions = false,
  onPublish,
  onHide,
  onDelete,
  onFeature,
  onMediaClick,
  isProcessing = false,
}: WishCardProps) {
  const displayName = wish.isAnonymous ? "Anonymous" : wish.visitorName;
  const RelationshipIcon = RELATIONSHIP_ICONS[wish.relationship] ?? User;
  const statusInfo = STATUS_CONFIG[wish.status as keyof typeof STATUS_CONFIG];
  const StatusIcon = statusInfo?.icon;
  const isFeed = variant === "feed";
  const hasMedia = Boolean(wish.imageUrl || wish.videoUrl);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaWrapperRef = useRef<HTMLDivElement>(null);
  const [muted, setMuted] = useState(true);

  // Text-only feed cards get a subtle pointer-follow tilt so they don't feel static.
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleTiltMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (hasMedia) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -5, y: px * 5 });
  };

  const resetTilt = () => setTilt({ x: 0, y: 0 });

  // Feed only: auto-play the video while it's scrolled into view, pause otherwise.
  useEffect(() => {
    if (!isFeed || !wish.videoUrl) return;
    const video = videoRef.current;
    const wrapper = mediaWrapperRef.current;
    if (!video || !wrapper) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
          video.play().catch(() => {
            /* autoplay can be blocked until user interacts; ignore */
          });
        } else {
          video.pause();
        }
      },
      { threshold: [0, 0.6, 1] }
    );

    observer.observe(wrapper);
    return () => observer.disconnect();
  }, [isFeed, wish.videoUrl]);

  const header = (
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-800 text-sm font-semibold text-slate-300">
          {getInitials(displayName)}
        </div>
        <div>
          <h3 className="text-base font-semibold text-white">{displayName}</h3>
          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs capitalize text-slate-400">
            <span className="flex items-center gap-1">
              <RelationshipIcon size={12} />
              {wish.relationship}
            </span>
            <span className="text-slate-600">•</span>
            <span className="normal-case text-slate-500">{formatDate(wish.createdAt)}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1.5">
        {!hasMedia && wish.isFeatured && (
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
  );

  const message = (
    <p
      className={`whitespace-pre-line text-sm leading-relaxed text-slate-300 ${
        isFeed ? "line-clamp-4" : ""
      }`}
    >
      {wish.message}
    </p>
  );

  const media = hasMedia && (
    <div
      ref={mediaWrapperRef}
      className={`relative overflow-hidden bg-slate-900 ${
        isFeed ? "min-h-0 flex-1 rounded-2xl" : "h-64 w-full rounded-none"
      }`}
    >
      {wish.imageUrl && (
        <button
          type="button"
          onClick={() => onMediaClick?.("image", wish.imageUrl!)}
          className="group/media relative block h-full w-full cursor-zoom-in"
          aria-label="Preview image"
        >
          <Image
            src={wish.imageUrl}
            alt="Wish Image"
            fill
            sizes={isFeed ? "100vw" : "(max-width: 768px) 100vw, 50vw"}
            className="object-cover transition-transform duration-300 group-hover/media:scale-105"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-200 group-hover/media:bg-black/30 group-hover/media:opacity-100">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900/80 text-white">
              <Maximize2 size={18} />
            </span>
          </div>
        </button>
      )}

      {wish.videoUrl &&
        (isFeed ? (
          <div className="group/media relative h-full w-full">
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              loop
              playsInline
              muted={muted}
              onClick={() => {
                const video = videoRef.current;
                if (!video) return;
                if (video.paused) video.play().catch(() => {});
                else video.pause();
              }}
            >
              <source src={wish.videoUrl} type="video/mp4" />
            </video>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setMuted((m) => !m);
              }}
              aria-label={muted ? "Unmute" : "Mute"}
              className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-900/80 text-slate-200 transition-colors hover:border-[#FFD700]/50 hover:text-[#FFD700]"
            >
              {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onMediaClick?.("video", wish.videoUrl!);
              }}
              aria-label="Preview video fullscreen"
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-900/80 text-slate-200 opacity-0 transition-all duration-200 hover:border-[#FFD700]/50 hover:text-[#FFD700] group-hover/media:opacity-100"
            >
              <Maximize2 size={15} />
            </button>
          </div>
        ) : (
          <div className="group/media relative h-full w-full bg-black">
            <video controls className="h-full w-full bg-black">
              <source src={wish.videoUrl} type="video/mp4" />
            </video>
            <button
              type="button"
              onClick={() => onMediaClick?.("video", wish.videoUrl!)}
              aria-label="Preview video fullscreen"
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-900/80 text-slate-200 opacity-0 transition-all duration-200 hover:border-[#FFD700]/50 hover:text-[#FFD700] group-hover/media:opacity-100"
            >
              <Maximize2 size={15} />
            </button>
          </div>
        ))}

      {wish.isFeatured && (
        <span className="absolute left-3 top-3 z-[1] flex items-center gap-1 rounded-full bg-[#FFD700] px-2.5 py-1 text-[11px] font-semibold text-slate-900 shadow-sm">
          <Sparkles size={12} />
          Featured
        </span>
      )}
    </div>
  );

  const reactions = <ReactionBar wishId={wish.$id} />;

  const actions = showActions && (
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
        {isProcessing ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
        Delete
      </button>
    </div>
  );

  if (isFeed) {
    if (hasMedia) {
      return (
        <div
          className={`flex h-full w-full flex-col overflow-hidden rounded-none border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 shadow-2xl shadow-black/30 sm:rounded-3xl ${
            isProcessing ? "opacity-60" : "opacity-100"
          }`}
        >
          <div className="space-y-3 px-5 pt-5">
            {header}
            {message}
          </div>

          <div className="flex min-h-0 flex-1 flex-col px-5 py-3">{media}</div>

          <div className="px-5 pb-5">{reactions}</div>
        </div>
      );
    }

    // Text-only wish: no media slot to fill, so the message itself becomes
    // the centerpiece — large centered quote treatment with a soft glow and
    // a gentle pointer-follow tilt so the card still feels alive.
    const feedTextSizeClass = getFeedTextSizeClass(wish.message.length);

    return (
      <div
        onMouseMove={handleTiltMove}
        onMouseLeave={resetTilt}
        style={{
          transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        }}
        className={`flex h-full w-full flex-col overflow-hidden rounded-none border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 shadow-2xl shadow-black/30 transition-transform duration-200 ease-out sm:rounded-3xl ${
          isProcessing ? "opacity-60" : "opacity-100"
        }`}
      >
        <div className="px-5 pt-5">{header}</div>

        <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden px-8 py-6 text-center">
          <div className="pointer-events-none absolute -top-10 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-[#FFD700]/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 right-0 h-48 w-48 rounded-full bg-[#FFD700]/5 blur-3xl" />

          <Quote size={28} className="mb-4 text-[#FFD700]/40" />

          <p
            className={`max-h-full overflow-y-auto whitespace-pre-line font-medium leading-relaxed text-slate-100 ${feedTextSizeClass}`}
          >
            {wish.message}
          </p>

          <Quote size={28} className="mt-4 rotate-180 text-[#FFD700]/40" />

          {wish.isFeatured && (
            <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-[#FFD700]/10 px-2.5 py-1 text-[11px] font-semibold text-[#FFD700]">
              <Sparkles size={12} />
              Featured
            </span>
          )}
        </div>

        <div className="flex justify-center px-5 pb-6">{reactions}</div>
      </div>
    );
  }

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 shadow-lg shadow-black/20 transition-all hover:border-slate-700 ${
        isProcessing ? "opacity-60" : "opacity-100"
      }`}
    >
      <div className="space-y-4 p-6">
        {header}
        {message}
      </div>

      {media}

      <div className="space-y-4 p-6 pt-4">
        {reactions}
        {actions}
      </div>
    </div>
  );
}
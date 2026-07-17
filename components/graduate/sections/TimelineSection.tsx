"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { CalendarDays, MapPin, Loader2, AlertCircle, RefreshCw } from "lucide-react";

import { timelineService } from "@/services/timeline";
import { TimelineEvent } from "@/types/timeline";
import { CATEGORY_ACCENT } from "@/lib/timeline-accent";

interface TimelineSectionProps {
  userId: string;
  graduateName: string;
}

export default function TimelineSection({ userId, graduateName }: TimelineSectionProps) {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  const loadEvents = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(false);
      const all = await timelineService.getEvents(userId);
      // getEvents() returns drafts too — a public page must never show those
      const published = all.filter((event) => event.status === "published");
      setEvents(published);
    } catch (err) {
      console.error("Failed to load timeline:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      if (!userId) {
        if (isMounted) setLoading(false);
        return;
      }
      try {
        if (isMounted) {
          setError(false);
          setLoading(true);
        }
        const all = await timelineService.getEvents(userId);
        const published = all.filter((event) => event.status === "published");
        if (isMounted) setEvents(published);
      } catch (err) {
        console.error("Failed to load timeline:", err);
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [userId, retryKey]);

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 shadow-lg shadow-black/20">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-800 px-7 py-6">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FFD700]/10 text-[#FFD700]">
          <CalendarDays size={20} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Graduation Timeline</h2>
          <p className="mt-0.5 text-sm text-slate-400">
            Explore milestones and memorable moments from{" "}
            <span className="font-semibold text-[#FFD700]">{graduateName}</span>&apos;s academic journey.
          </p>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center px-7 py-16">
          <Loader2 className="h-6 w-6 animate-spin text-[#FFD700]" />
        </div>
      ) : error ? (
        <div className="px-7 py-12 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-900/20">
            <AlertCircle size={28} className="text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Couldn&apos;t load the timeline</h3>
          <p className="mt-2 text-sm text-slate-400">Something went wrong. Please try again shortly.</p>
          <button
            type="button"
            onClick={() => setRetryKey((k) => k + 1)}
            className="mx-auto mt-5 flex items-center gap-1.5 rounded-2xl border border-slate-700 px-4 py-2 text-xs font-medium text-slate-300 transition-colors hover:border-[#FFD700]/50 hover:text-[#FFD700]"
          >
            <RefreshCw size={13} />
            Try Again
          </button>
        </div>
      ) : events.length > 0 ? (
        <div className="px-7 py-8">
          <ol className="relative border-l-2 border-slate-800 pl-8">
            {events.map((event) => {
              const accent = CATEGORY_ACCENT[event.category];
              const Icon = accent?.icon;

              return (
                <li key={event.$id} className="group relative mb-10 last:mb-0">
                  {/* Timeline dot */}
                  <span
                    className={`absolute -left-[41px] top-1 flex h-4 w-4 items-center justify-center rounded-full ring-4 ring-slate-950 transition-transform duration-300 group-hover:scale-125 group-hover:shadow-[0_0_10px_rgba(255,215,0,0.5)] ${
                      accent?.dot ?? "bg-slate-600"
                    }`}
                  />

                  <div className="-mx-3 flex flex-col gap-4 rounded-2xl px-3 py-2 transition-colors duration-200 group-hover:bg-slate-800/40 sm:flex-row sm:items-start">
                    {event.image && (
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-slate-800">
                        <Image
                          src={event.image}
                          alt={event.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="80px"
                        />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {accent && (
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full ${accent.bg} px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white transition-all duration-200 group-hover:brightness-110`}
                          >
                            {Icon && <Icon className="h-3 w-3" />}
                            {accent.label}
                          </span>
                        )}
                        <span className="text-xs font-semibold text-slate-500">
                          {new Date(event.date).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>

                      <h3 className="mt-2 text-base font-extrabold tracking-tight text-white transition-colors duration-200 group-hover:text-[#FFD700]">
                        {event.title}
                      </h3>

                      {event.description && (
                        <p className="mt-1 line-clamp-3 text-sm text-slate-400">{event.description}</p>
                      )}

                      {event.location && (
                        <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                          <MapPin className="h-3.5 w-3.5" />
                          {event.location}
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      ) : (
        <div className="px-7 py-12 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800">
            <CalendarDays size={30} className="text-slate-500" />
          </div>
          <h3 className="text-lg font-semibold text-white">No Timeline Yet</h3>
          <p className="mt-2 text-sm text-slate-400">{graduateName} hasn&apos;t published any timeline events yet.</p>
        </div>
      )}
    </div>
  );
}
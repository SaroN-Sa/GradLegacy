"use client";

import { useState, useEffect, useCallback } from "react";
import { timelineService } from "@/services/timeline";
import {
  TimelineEvent,
  CreateTimelineEventData,
  UpdateTimelineEventData,
} from "@/types/timeline";
import TimelineEventCard from "./TimelineEventCard";
import TimelineEventModal from "./TimelineEventModal";
import { Plus } from "lucide-react";

interface TimelineListProps {
  userId: string;
  isOwner?: boolean;
}

export default function TimelineList({ userId, isOwner = true }: TimelineListProps) {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await timelineService.getEvents(userId);
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load timeline events:", err);
      setError("Failed to load timeline events.");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleCreate = async (data: CreateTimelineEventData) => {
    try {
      const newEvent = await timelineService.createEvent(userId, data);
      if (!newEvent) {
        setError("Failed to create timeline event.");
        return null;
      }
      setEvents((prev) =>
        [...prev, newEvent].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        )
      );
      return newEvent;
    } catch (err) {
      console.error("Failed to create timeline event:", err);
      setError("Failed to create timeline event.");
      return null;
    }
  };

  const handleUpdate = async (eventId: string, data: UpdateTimelineEventData) => {
    try {
      const updated = await timelineService.updateEvent(eventId, data);
      if (!updated) {
        setError("Failed to update timeline event.");
        return null;
      }
      setEvents((prev) => prev.map((e) => (e.$id === eventId ? updated : e)));
      return updated;
    } catch (err) {
      console.error("Failed to update timeline event:", err);
      setError("Failed to update timeline event.");
      return null;
    }
  };

  const handleDelete = async (eventId: string) => {
    const confirmed = window.confirm("Delete this timeline event? This cannot be undone.");
    if (!confirmed) return;
    try {
      await timelineService.deleteEvent(eventId);
      setEvents((prev) => prev.filter((e) => e.$id !== eventId));
    } catch (err) {
      console.error("Failed to delete timeline event:", err);
      setError("Failed to delete timeline event.");
    }
  };

  const openCreateForm = () => {
    setEditingEvent(null);
    setIsFormOpen(true);
  };

  const openEditForm = (event: TimelineEvent) => {
    setEditingEvent(event);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingEvent(null);
  };

  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Timeline</h2>
        {isOwner && (
          <button
            onClick={openCreateForm}
            className="flex items-center gap-2 px-4 py-2 rounded-3xl bg-gradient-to-r from-slate-800 to-slate-900 border border-[#FFD700]/30 text-[#FFD700] font-medium hover:border-[#FFD700] transition-colors"
          >
            <Plus size={18} />
            Add Event
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-2xl bg-red-900/20 border border-red-500/30 text-red-300 text-sm">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-2 border-[#FFD700] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : events.length === 0 ? (
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 py-16 px-6 text-center">
          <p className="text-slate-400">No timeline events yet. Add your first milestone.</p>
        </div>
      ) : (
        <div className="relative pl-6 border-l border-slate-800 space-y-6">
          {events.map((event) => (
            <TimelineEventCard
              key={event.$id}
              event={event}
              isOwner={isOwner}
              onEdit={() => openEditForm(event)}
              onDelete={() => handleDelete(event.$id)}
            />
          ))}
        </div>
      )}

      {isFormOpen && (
        <TimelineEventModal
          event={editingEvent}
          onClose={closeForm}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
        />
      )}
    </section>
  );
}
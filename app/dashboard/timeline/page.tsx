"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";

import TimelineForm from "@/components/timeline/TimelineForm";
import TimelineList from "@/components/timeline/TimelineList";

import { timelineService } from "@/services/timeline";
import { authService } from "@/services/auth";

import {
  TimelineEvent,
  CreateTimelineEventData,
  UpdateTimelineEventData,
} from "@/types/timeline";

function DeleteConfirmDialog({
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
          Delete this timeline event?
        </h3>

        <p className="text-sm text-slate-400 mb-6">
          This action cannot be undone. The event will be permanently
          removed from your timeline.
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

export default function TimelinePage() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);

  const [editingEvent, setEditingEvent] =
    useState<TimelineEvent | null>(null);

  const [userId, setUserId] = useState("");

  const [eventPendingDelete, setEventPendingDelete] =
    useState<string | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    initialize();
  }, []);

  async function initialize() {
    try {
      setLoading(true);

      const user = await authService.getCurrentUser();

      if (!user) return;

      setUserId(user.$id);

      const timelineEvents =
        await timelineService.getEvents(user.$id);

      setEvents(timelineEvents);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load your timeline.");
    } finally {
      setLoading(false);
    }
  }

  async function refreshTimeline() {
    if (!userId) return;

    const timelineEvents =
      await timelineService.getEvents(userId);

    setEvents(timelineEvents);
  }

  async function handleCreate(
    data: CreateTimelineEventData
  ): Promise<TimelineEvent | null> {
    if (!userId) return null;

    try {
      setSaving(true);

      const created = await timelineService.createEvent(userId, data);

      await refreshTimeline();

      setShowForm(false);

      toast.success("Timeline event added.");

      return created;
    } catch (error) {
      console.error(error);
      toast.error("Couldn't add that event. Try again.");
      return null;
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(
    eventId: string,
    data: UpdateTimelineEventData
  ): Promise<TimelineEvent | null> {
    try {
      setSaving(true);

      const updated = await timelineService.updateEvent(eventId, data);

      await refreshTimeline();

      setShowForm(false);

      setEditingEvent(null);

      toast.success("Timeline event updated.");

      return updated;
    } catch (error) {
      console.error(error);
      toast.error("Couldn't save your changes. Try again.");
      return null;
    } finally {
      setSaving(false);
    }
  }

  function handleDelete(eventId: string) {
    setEventPendingDelete(eventId);
  }

  function cancelDelete() {
    if (isDeleting) return;
    setEventPendingDelete(null);
  }

  async function confirmDelete() {
    if (!eventPendingDelete) return;

    try {
      setIsDeleting(true);

      await timelineService.deleteEvent(eventPendingDelete);

      await refreshTimeline();

      toast.success("Timeline event deleted.");
    } catch (error) {
      console.error(error);
      toast.error("Couldn't delete that event. Try again.");
    } finally {
      setIsDeleting(false);
      setEventPendingDelete(null);
    }
  }

  function handleEdit(event: TimelineEvent) {
    setEditingEvent(event);

    setShowForm(true);
  }

  function handleCancel() {
    setShowForm(false);

    setEditingEvent(null);
  }

  function handleAddNew() {
    setEditingEvent(null);

    setShowForm(true);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-[#FFD700] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 text-center text-slate-400">
        Please sign in to manage your timeline.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Timeline
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Document the milestones of your journey.
          </p>
        </div>

        <button
          onClick={handleAddNew}
          disabled={saving}
          className="px-4 py-2 rounded-3xl bg-gradient-to-r from-slate-800 to-slate-900 border border-[#FFD700]/30 text-[#FFD700] font-medium hover:border-[#FFD700] transition-colors disabled:opacity-50"
        >
          + Add Event
        </button>
      </div>

      <TimelineList
        events={events}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {showForm && (
        <TimelineForm
          event={editingEvent}
          onClose={handleCancel}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
        />
      )}

      <DeleteConfirmDialog
        open={eventPendingDelete !== null}
        isDeleting={isDeleting}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}
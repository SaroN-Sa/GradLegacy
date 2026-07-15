"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import {
  TimelineEvent,
  TimelineCategory,
  TimelineStatus,
  CreateTimelineEventData,
  UpdateTimelineEventData,
} from "@/types/timeline";
import { validateTimelineEvent, TimelineValidationErrors } from "@/lib/timelineValidation";

interface TimelineEventModalProps {
  event: TimelineEvent | null;
  onClose: () => void;
  onCreate: (data: CreateTimelineEventData) => Promise<TimelineEvent | null>;
  onUpdate: (eventId: string, data: UpdateTimelineEventData) => Promise<TimelineEvent | null>;
}

const CATEGORY_OPTIONS: TimelineCategory[] = [
  "education",
  "internship",
  "achievement",
  "graduation",
  "other",
];

export default function TimelineEventModal({
  event,
  onClose,
  onCreate,
  onUpdate,
}: TimelineEventModalProps) {
  const isEditing = !!event;

  const [title, setTitle] = useState(event?.title ?? "");
  const [description, setDescription] = useState(event?.description ?? "");
  const [date, setDate] = useState(event?.date?.slice(0, 10) ?? "");
  const [category, setCategory] = useState<TimelineCategory>(event?.category ?? "achievement");
  const [location, setLocation] = useState(event?.location ?? "");
  const [image, setImage] = useState(event?.image ?? "");
  const [status, setStatus] = useState<TimelineStatus>(event?.status ?? "draft");

  const [errors, setErrors] = useState<TimelineValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleSubmit = async () => {
    const payload = {
      title,
      description,
      date,
      category,
      location: location || undefined,
      image: image || undefined,
      status,
    };

    const validation = validateTimelineEvent(payload);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    const result = isEditing
      ? await onUpdate(event!.$id, payload)
      : await onCreate(payload as CreateTimelineEventData);

    setIsSubmitting(false);
    if (result) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md h-full bg-gradient-to-b from-slate-900 to-slate-950 border-l border-slate-800 overflow-y-auto animate-in slide-in-from-right duration-300">
        <div className="sticky top-0 flex items-center justify-between px-6 py-5 bg-slate-950/80 backdrop-blur-sm border-b border-slate-800">
          <h3 className="text-lg font-semibold text-white">
            {isEditing ? "Edit Event" : "Add Timeline Event"}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-6 space-y-5">
          <div>
            <label className="block text-sm text-slate-300 mb-1.5">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#FFD700]/60"
              placeholder="e.g. Started internship at..."
            />
            {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#FFD700]/60 resize-none"
              placeholder="Tell the story behind this moment..."
            />
            {errors.description && (
              <p className="text-xs text-red-400 mt-1">{errors.description}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1.5">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#FFD700]/60"
            />
            {errors.date && <p className="text-xs text-red-400 mt-1">{errors.date}</p>}
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1.5">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as TimelineCategory)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#FFD700]/60"
            >
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1.5">Location (optional)</label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#FFD700]/60"
              placeholder="e.g. Addis Ababa, Ethiopia"
            />
            {errors.location && <p className="text-xs text-red-400 mt-1">{errors.location}</p>}
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1.5">Cover Image URL (optional)</label>
            <input
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#FFD700]/60"
              placeholder="https://..."
            />
            {errors.image && <p className="text-xs text-red-400 mt-1">{errors.image}</p>}
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-2">Visibility</label>
            <div className="flex gap-2">
              {(["draft", "published"] as TimelineStatus[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={`flex-1 py-2 rounded-2xl text-sm font-medium border transition-colors ${
                    status === s
                      ? "bg-gradient-to-r from-slate-800 to-slate-900 border-[#FFD700] text-[#FFD700]"
                      : "border-slate-700 text-slate-400 hover:border-slate-600"
                  }`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 flex gap-3 px-6 py-5 bg-slate-950/80 backdrop-blur-sm border-t border-slate-800">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-3xl border border-slate-700 text-slate-300 text-sm font-medium hover:border-slate-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 py-2.5 rounded-3xl bg-gradient-to-r from-slate-800 to-slate-900 border border-[#FFD700]/50 text-[#FFD700] text-sm font-medium hover:border-[#FFD700] transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Add Event"}
          </button>
        </div>
      </div>
    </div>
  );
}
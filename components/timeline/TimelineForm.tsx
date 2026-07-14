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
import {
  validateTimelineEvent,
  TimelineValidationErrors,
} from "@/lib/timelineValidation";
import ImageUpload from "@/components/ImageUpload";

interface TimelineFormProps {
  event: TimelineEvent | null;
  onClose: () => void;
  onCreate: (data: CreateTimelineEventData) => Promise<TimelineEvent | null>;
  onUpdate: (
    eventId: string,
    data: UpdateTimelineEventData
  ) => Promise<TimelineEvent | null>;
}

const CATEGORY_OPTIONS: { value: TimelineCategory; label: string }[] = [
  { value: "education", label: "🎓 Education" },
  { value: "internship", label: "💼 Internship" },
  { value: "achievement", label: "🏆 Achievement" },
  { value: "graduation", label: "🎉 Graduation" },
  { value: "other", label: "📌 Other" },
];

export default function TimelineForm({
  event,
  onClose,
  onCreate,
  onUpdate,
}: TimelineFormProps) {
  const isEditing = !!event;

  const [title, setTitle] = useState(event?.title ?? "");
  const [description, setDescription] = useState(event?.description ?? "");
  const [date, setDate] = useState(event?.date?.slice(0, 10) ?? "");
  const [category, setCategory] = useState<TimelineCategory>(
    event?.category ?? "achievement"
  );
  const [location, setLocation] = useState(event?.location ?? "");
  const [image, setImage] = useState(event?.image ?? "");
  const [status, setStatus] = useState<TimelineStatus>(
    event?.status ?? "draft"
  );

  const [errors, setErrors] = useState<TimelineValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = {
      title,
      description,
      date,
      category,
      location: location || undefined,
      image: image || undefined,
      status,
    };

    const validation = validateTimelineEvent(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const result = isEditing
      ? await onUpdate(event!.$id, formData)
      : await onCreate(formData as CreateTimelineEventData);

    setIsSubmitting(false);

    if (result) onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-md h-full bg-gradient-to-b from-slate-900 to-slate-950 border-l border-slate-800 overflow-y-auto animate-slide-in flex flex-col"
      >
        <div className="sticky top-0 flex items-center justify-between px-6 py-5 bg-slate-950/80 backdrop-blur-sm border-b border-slate-800 z-10">
          <h3 className="text-lg font-semibold text-white">
            {isEditing ? "Edit Event" : "Add Timeline Event"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-6 space-y-5 flex-1">
          {/* Title */}
          <div>
            <label className="block text-sm text-slate-300 mb-1.5">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter event title"
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#FFD700]/60"
            />
            {errors.title && (
              <p className="text-xs text-red-400 mt-1">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-slate-300 mb-1.5">
              Description
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe this milestone..."
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#FFD700]/60 resize-none"
            />
            {errors.description && (
              <p className="text-xs text-red-400 mt-1">
                {errors.description}
              </p>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm text-slate-300 mb-1.5">
              Event Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#FFD700]/60"
            />
            {errors.date && (
              <p className="text-xs text-red-400 mt-1">{errors.date}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm text-slate-300 mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value as TimelineCategory)
              }
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#FFD700]/60"
            >
              {CATEGORY_OPTIONS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-xs text-red-400 mt-1">{errors.category}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm text-slate-300 mb-1.5">
              Location (optional)
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Addis Ababa, Ethiopia"
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#FFD700]/60"
            />
            {errors.location && (
              <p className="text-xs text-red-400 mt-1">{errors.location}</p>
            )}
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-sm text-slate-300 mb-1.5">
              Cover Image (optional)
            </label>

            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0">
                {image ? (
                  <img
                    src={image}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-slate-500 text-center px-2">
                    No image
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <ImageUpload onUpload={(url) => setImage(url)} iconSize={18} />
                {image && (
                  <button
                    type="button"
                    onClick={() => setImage("")}
                    className="text-xs text-slate-400 hover:text-red-400 transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>

            {errors.image && (
              <p className="text-xs text-red-400 mt-1">{errors.image}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm text-slate-300 mb-2">
              Visibility
            </label>
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

        {/* Buttons */}
        <div className="sticky bottom-0 flex gap-3 px-6 py-5 bg-slate-950/80 backdrop-blur-sm border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 py-2.5 rounded-3xl border border-slate-700 text-slate-300 text-sm font-medium hover:border-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-2.5 rounded-3xl bg-gradient-to-r from-slate-800 to-slate-900 border border-[#FFD700]/50 text-[#FFD700] text-sm font-medium hover:border-[#FFD700] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? "Saving..."
              : isEditing
              ? "Save Changes"
              : "Add Event"}
          </button>
        </div>
      </form>
    </div>
  );
}
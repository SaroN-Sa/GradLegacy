// lib/timelineValidation.ts

import {
  CreateTimelineEventData,
  UpdateTimelineEventData,
} from "@/types/timeline";

export interface TimelineValidationErrors {
  title?: string;
  description?: string;
  date?: string;
  category?: string;
  image?: string;
  location?: string;
}

export interface TimelineValidationResult {
  isValid: boolean;
  errors: TimelineValidationErrors;
}

export function validateTimelineEvent(
  data: CreateTimelineEventData | UpdateTimelineEventData
): TimelineValidationResult {
  const errors: TimelineValidationErrors = {};

  // -------------------------
  // Title
  // -------------------------
  if (!data.title?.trim()) {
    errors.title = "Title is required.";
  } else if (data.title.trim().length < 3) {
    errors.title = "Title must be at least 3 characters.";
  } else if (data.title.trim().length > 100) {
    errors.title = "Title cannot exceed 100 characters.";
  }

  // -------------------------
  // Description
  // -------------------------
  if (!data.description?.trim()) {
    errors.description = "Description is required.";
  } else if (data.description.trim().length < 10) {
    errors.description =
      "Description must be at least 10 characters.";
  } else if (data.description.trim().length > 1000) {
    errors.description =
      "Description cannot exceed 1000 characters.";
  }

  // -------------------------
  // Date
  // -------------------------
  if (!data.date) {
    errors.date = "Event date is required.";
  } else if (isNaN(Date.parse(data.date))) {
    errors.date = "Please enter a valid date.";
  }

  // -------------------------
  // Category
  // -------------------------
  if (!data.category) {
    errors.category = "Category is required.";
  }

  // -------------------------
  // Image URL (Optional)
  // -------------------------
  if (data.image) {
    try {
      new URL(data.image);
    } catch {
      errors.image = "Please enter a valid image URL.";
    }
  }

  // -------------------------
  // Location (Optional)
  // -------------------------
  if (data.location && data.location.length > 100) {
    errors.location =
      "Location cannot exceed 100 characters.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
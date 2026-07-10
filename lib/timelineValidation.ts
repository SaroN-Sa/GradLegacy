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

  // Title
  if ("title" in data) {
    if (!data.title?.trim()) {
      errors.title = "Title is required.";
    } else if (data.title.trim().length < 3) {
      errors.title = "Title must be at least 3 characters.";
    } else if (data.title.trim().length > 100) {
      errors.title = "Title cannot exceed 100 characters.";
    }
  }

  // Description
  if ("description" in data) {
    if (!data.description?.trim()) {
      errors.description = "Description is required.";
    } else if (data.description.trim().length < 10) {
      errors.description =
        "Description must be at least 10 characters.";
    } else if (data.description.trim().length > 1000) {
      errors.description =
        "Description cannot exceed 1000 characters.";
    }
  }

  // Date
  if ("date" in data) {
    if (!data.date) {
      errors.date = "Event date is required.";
    } else if (isNaN(Date.parse(data.date))) {
      errors.date = "Invalid event date.";
    }
  }

  // Category
  if ("category" in data) {
    if (!data.category) {
      errors.category = "Category is required.";
    }
  }

  // Image (optional)
  if ("image" in data && data.image) {
    try {
      new URL(data.image);
    } catch {
      errors.image = "Invalid image URL.";
    }
  }

  // Location (optional)
  if ("location" in data && data.location) {
    if (data.location.trim().length > 100) {
      errors.location =
        "Location cannot exceed 100 characters.";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
// types/timeline.ts

// -------------------------
// Timeline Category
// -------------------------
export type TimelineCategory =
  | "education"
  | "internship"
  | "achievement"
  | "graduation"
  | "other";

// -------------------------
// Timeline Status
// -------------------------
export type TimelineStatus =
  | "draft"
  | "published";

// -------------------------
// Timeline Event
// -------------------------
export interface TimelineEvent {
  // Appwrite document ID
  $id: string;

  // Owner of the event
  userId: string;

  // Event information
  title: string;
  description: string;

  // Event date
  date: string;

  // Event category
  category: TimelineCategory;

  // Optional cover image
  image?: string;

  // Optional location
  location?: string;

  // Draft or Published
  status: TimelineStatus;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// -------------------------
// Create Event
// -------------------------
export interface CreateTimelineEventData {
  title: string;
  description: string;
  date: string;
  category: TimelineCategory;
  image?: string;
  location?: string;
  status: TimelineStatus;
}

// -------------------------
// Update Event
// -------------------------
export interface UpdateTimelineEventData
  extends Partial<CreateTimelineEventData> {}
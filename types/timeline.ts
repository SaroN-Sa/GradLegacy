// Timeline categories
export type TimelineCategory =
  | "education"
  | "internship"
  | "achievement"
  | "graduation"
  | "other";

// Timeline visibility status
export type TimelineStatus = "draft" | "published";

// Timeline event interface
export interface TimelineEvent {
  // Appwrite document ID
  $id: string;

  // Graduate who owns this event
  userId: string;

  // Event information
  title: string;
  description: string;

  // When the event happened
  date: string;

  // Event type
  category: TimelineCategory;

  // Optional cover image (Cloudinary URL)
  image?: string;

  // Optional location
  location?: string;

  // Draft or published
  status: TimelineStatus;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// Data used when creating a new event
export interface CreateTimelineEventData {
  title: string;
  description: string;
  date: string;
  category: TimelineCategory;
  image?: string;
  location?: string;
  status: TimelineStatus;
}

// Data used when updating an existing event
export interface UpdateTimelineEventData
  extends Partial<CreateTimelineEventData> {}
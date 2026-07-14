import { databases, DATABASE_ID, ID, Query } from "@/lib/appwrite";

import {
  TimelineEvent,
  CreateTimelineEventData,
  UpdateTimelineEventData,
} from "@/types/timeline";

const timelineCollectionId =
  process.env.NEXT_PUBLIC_APPWRITE_TIMELINE_COLLECTION_ID;

if (!timelineCollectionId) {
  throw new Error(
    "Missing Appwrite environment variable: NEXT_PUBLIC_APPWRITE_TIMELINE_COLLECTION_ID. " +
      "Add it to .env.local and restart the dev server (env changes are not hot-reloaded)."
  );
}

export const TIMELINE_COLLECTION_ID = timelineCollectionId;

export const timelineService = {
  async createEvent(
    userId: string,
    data: CreateTimelineEventData
  ): Promise<TimelineEvent> {
    const document = await databases.createDocument(
      DATABASE_ID,
      TIMELINE_COLLECTION_ID,
      ID.unique(),
      {
        userId,
        title: data.title,
        description: data.description,
        date: data.date,
        category: data.category,
        image: data.image ?? "",
        location: data.location ?? "",
        status: data.status,
      }
    );

    return document as unknown as TimelineEvent;
  },

  async getEvents(userId: string): Promise<TimelineEvent[]> {
    const response = await databases.listDocuments(
      DATABASE_ID,
      TIMELINE_COLLECTION_ID,
      [Query.equal("userId", userId), Query.orderAsc("date")]
    );

    return response.documents as unknown as TimelineEvent[];
  },

  async updateEvent(
    eventId: string,
    data: UpdateTimelineEventData
  ): Promise<TimelineEvent> {
    const document = await databases.updateDocument(
      DATABASE_ID,
      TIMELINE_COLLECTION_ID,
      eventId,
      { ...data }
    );

    return document as unknown as TimelineEvent;
  },

  async deleteEvent(eventId: string): Promise<void> {
    await databases.deleteDocument(
      DATABASE_ID,
      TIMELINE_COLLECTION_ID,
      eventId
    );
  },
};
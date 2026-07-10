import { databases, DATABASE_ID, ID, Query } from "@/lib/appwrite";
import { COLLECTIONS } from "@/lib/constants";

import {
  TimelineEvent,
  CreateTimelineEventData,
  UpdateTimelineEventData,
} from "@/types/timeline";

export const timelineService = {
  async createEvent(
    userId: string,
    data: CreateTimelineEventData
  ): Promise<TimelineEvent> {
    try {
      const now = new Date().toISOString();

      const document = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.TIMELINE_EVENTS,
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

          createdAt: now,

          updatedAt: now,
        }
      );

      return document as unknown as TimelineEvent;
    } catch (error) {
      console.error("Failed to create timeline event:", error);
      throw error;
    }
  },

  async getEvents(userId: string): Promise<TimelineEvent[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.TIMELINE_EVENTS,
        [
          Query.equal("userId", userId),
          Query.orderAsc("date"),
        ]
      );

      return response.documents as unknown as TimelineEvent[];
    } catch (error) {
      console.error("Failed to fetch timeline events:", error);
      throw error;
    }
  },

  async getEvent(eventId: string): Promise<TimelineEvent> {
    try {
      const document = await databases.getDocument(
        DATABASE_ID,
        COLLECTIONS.TIMELINE_EVENTS,
        eventId
      );

      return document as unknown as TimelineEvent;
    } catch (error) {
      console.error("Failed to fetch timeline event:", error);
      throw error;
    }
  },

  async updateEvent(
    eventId: string,
    data: UpdateTimelineEventData
  ): Promise<TimelineEvent> {
    try {
      const document = await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.TIMELINE_EVENTS,
        eventId,
        {
          ...data,
          updatedAt: new Date().toISOString(),
        }
      );

      return document as unknown as TimelineEvent;
    } catch (error) {
      console.error("Failed to update timeline event:", error);
      throw error;
    }
  },

  async deleteEvent(eventId: string): Promise<void> {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        COLLECTIONS.TIMELINE_EVENTS,
        eventId
      );
    } catch (error) {
      console.error("Failed to delete timeline event:", error);
      throw error;
    }
  },
};
import {
  databases,
  DATABASE_ID,
  ID,
  Query,
} from "@/lib/appwrite";

import {
  CreateMedia,
  Media,
  UpdateMedia,
} from "@/types/media";

const COLLECTION_ID = "media";

export const mediaService = {
  async createMedia(data: CreateMedia): Promise<Media> {
    // Ensure all required fields are present
    const appwriteData = {
      userId: data.userId,
      uploadedBy: data.uploadedBy,
      title: data.title || "",
      description: data.description || "",
      type: data.type,
      url: data.url,
      publicId: data.publicId, // Make sure this is being sent
      visibility: data.visibility || "private",
      album: data.album || "",
      featured: data.featured ?? false,
      status: data.status || "active",
    };

    console.log("Creating document with data:", appwriteData);

    const document = await databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID,
      ID.unique(),
      appwriteData
    );

    const response = document as any;
    return {
      ...response,
      source: "graduate",
    } as unknown as Media;
  },

  async getMedia(mediaId: string): Promise<Media> {
    const document = await databases.getDocument(
      DATABASE_ID,
      COLLECTION_ID,
      mediaId
    );

    const response = document as any;
    return {
      ...response,
      source: "graduate",
    } as unknown as Media;
  },

  async getUserMedia(userId: string): Promise<Media[]> {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [
        Query.equal("userId", userId),
        Query.equal("status", "active"),
        Query.orderDesc("$createdAt"),
      ]
    );

    return (response.documents as any[]).map((doc) => ({
      ...doc,
      source: "graduate",
    })) as unknown as Media[];
  },

  async getPublicMedia(userId: string): Promise<Media[]> {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [
        Query.equal("userId", userId),
        Query.equal("visibility", "public"),
        Query.equal("status", "active"),
        Query.orderDesc("$createdAt"),
      ]
    );

    return (response.documents as any[]).map((doc) => ({
      ...doc,
      source: "graduate",
    })) as unknown as Media[];
  },

  async updateMedia(
    mediaId: string,
    data: UpdateMedia
  ): Promise<Media> {
    const document = await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_ID,
      mediaId,
      data
    );

    const response = document as any;
    return {
      ...response,
      source: "graduate",
    } as unknown as Media;
  },

  async deleteMedia(mediaId: string): Promise<void> {
    await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_ID,
      mediaId,
      {
        status: "deleted",
      }
    );
  },

  async toggleVisibility(
    mediaId: string,
    visibility: "private" | "public" | "unlisted"
  ): Promise<Media> {
    const document = await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_ID,
      mediaId,
      {
        visibility,
      }
    );

    const response = document as any;
    return {
      ...response,
      source: "graduate",
    } as unknown as Media;
  },

  async toggleFeatured(
    mediaId: string,
    featured: boolean
  ): Promise<Media> {
    const document = await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_ID,
      mediaId,
      {
        featured,
      }
    );

    const response = document as any;
    return {
      ...response,
      source: "graduate",
    } as unknown as Media;
  },

  async getMediaByType(
    userId: string,
    type: "image" | "video" | "audio"
  ): Promise<Media[]> {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [
        Query.equal("userId", userId),
        Query.equal("type", type),
        Query.equal("status", "active"),
        Query.orderDesc("$createdAt"),
      ]
    );

    return (response.documents as any[]).map((doc) => ({
      ...doc,
      source: "graduate",
    })) as unknown as Media[];
  },
};
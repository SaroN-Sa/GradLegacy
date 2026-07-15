import { databases, DATABASE_ID, ID, Query } from "@/lib/appwrite";

import {
  Wish,
  CreateWishData,
  UpdateWishData,
} from "@/types/wish";

const wishCollectionId =
  process.env.NEXT_PUBLIC_APPWRITE_WISH_COLLECTION_ID;

if (!wishCollectionId) {
  throw new Error(
    "Missing Appwrite environment variable: NEXT_PUBLIC_APPWRITE_WISH_COLLECTION_ID. " +
      "Add it to .env.local and restart the dev server."
  );
}

export const WISH_COLLECTION_ID = wishCollectionId;

export const wishService = {
  async createWish(
    userId: string,
    data: CreateWishData
  ): Promise<Wish> {
    const document = await databases.createDocument(
      DATABASE_ID,
      WISH_COLLECTION_ID,
      ID.unique(),
      {
        userId,
        visitorName: data.visitorName,
        visitorEmail: data.visitorEmail ?? "",
        relationship: data.relationship,
        message: data.message,
        isAnonymous: data.isAnonymous,
        imageUrl: data.imageUrl ?? "",
        videoUrl: data.videoUrl ?? "",
        status: data.status,
        isFeatured: data.isFeatured ?? false,
      }
    );

    return document as unknown as Wish;
  },

  async getWishes(userId: string): Promise<Wish[]> {
    const response = await databases.listDocuments(
      DATABASE_ID,
      WISH_COLLECTION_ID,
      [
        Query.equal("userId", userId),
        Query.orderDesc("$createdAt"),
      ]
    );

    return response.documents as unknown as Wish[];
  },

  async getPublishedWishes(
    userId: string
  ): Promise<Wish[]> {
    const response = await databases.listDocuments(
      DATABASE_ID,
      WISH_COLLECTION_ID,
      [
        Query.equal("userId", userId),
        Query.equal("status", "published"),
        Query.orderDesc("$createdAt"),
      ]
    );

    return response.documents as unknown as Wish[];
  },

  async updateWish(
    wishId: string,
    data: UpdateWishData
  ): Promise<Wish> {
    const document = await databases.updateDocument(
      DATABASE_ID,
      WISH_COLLECTION_ID,
      wishId,
      {
        ...data,
      }
    );

    return document as unknown as Wish;
  },

  async deleteWish(
    wishId: string
  ): Promise<void> {
    await databases.deleteDocument(
      DATABASE_ID,
      WISH_COLLECTION_ID,
      wishId
    );
  },
};
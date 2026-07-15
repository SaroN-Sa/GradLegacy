import { databases, DATABASE_ID, ID, Query } from "@/lib/appwrite";

import {
  Reaction,
  CreateReactionData,
  UpdateReactionData,
} from "@/types/reaction";

const reactionCollectionId =
  process.env.NEXT_PUBLIC_APPWRITE_REACTION_COLLECTION_ID;

if (!reactionCollectionId) {
  throw new Error(
    "Missing Appwrite environment variable: NEXT_PUBLIC_APPWRITE_REACTION_COLLECTION_ID. " +
      "Add it to .env.local and restart the dev server."
  );
}

export const REACTION_COLLECTION_ID = reactionCollectionId;

export const reactionService = {
  async createReaction(
    data: CreateReactionData
  ): Promise<Reaction> {
    const document = await databases.createDocument(
      DATABASE_ID,
      REACTION_COLLECTION_ID,
      ID.unique(),
      {
        wishId: data.wishId,
        guestId: data.guestId,
        reactionType: data.reactionType,
      }
    );

    return document as unknown as Reaction;
  },

  async getWishReactions(
    wishId: string
  ): Promise<Reaction[]> {
    const response = await databases.listDocuments(
      DATABASE_ID,
      REACTION_COLLECTION_ID,
      [
        Query.equal("wishId", wishId),
        Query.orderDesc("$createdAt"),
      ]
    );

    return response.documents as unknown as Reaction[];
  },

  async getGuestReaction(
    wishId: string,
    guestId: string
  ): Promise<Reaction | null> {
    const response = await databases.listDocuments(
      DATABASE_ID,
      REACTION_COLLECTION_ID,
      [
        Query.equal("wishId", wishId),
        Query.equal("guestId", guestId),
      ]
    );

    if (response.documents.length === 0) {
      return null;
    }

    return response.documents[0] as unknown as Reaction;
  },

  async updateReaction(
    reactionId: string,
    data: UpdateReactionData
  ): Promise<Reaction> {
    const document = await databases.updateDocument(
      DATABASE_ID,
      REACTION_COLLECTION_ID,
      reactionId,
      {
        ...data,
      }
    );

    return document as unknown as Reaction;
  },

  async deleteReaction(
    reactionId: string
  ): Promise<void> {
    await databases.deleteDocument(
      DATABASE_ID,
      REACTION_COLLECTION_ID,
      reactionId
    );
  },
};
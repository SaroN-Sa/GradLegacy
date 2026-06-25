import { databases } from "@/lib/appwrite";
import { Query, ID } from "appwrite";

const DATABASE_ID = "6a3d0b9100231432c178";
const COLLECTION_ID = "graduateprofiles";

export const db = {
  createProfile: async (data: any) => {
    return await databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID,
      ID.unique(),
      data
    );
  },

  getProfileByUserId: async (userId: string) => {
    return await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [Query.equal("userId", userId)]
    );
  },

  getProfileByUsername: async (username: string) => {
    return await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [Query.equal("username", username)]
    );
  },

  updateProfile: async (
    documentId: string,
    data: any
  ) => {
    return await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_ID,
      documentId,
      data
    );
  },
};
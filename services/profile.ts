import {
  databases,
  DATABASE_ID,
  COLLECTION_ID,
  ID,
  Query,
} from "@/lib/appwrite-db";
import type { Profile } from "@/types/profile";

export const profileService = {
  async createProfile(data: any): Promise<Profile> {
    return await databases.createDocument<Profile>(
      DATABASE_ID,
      COLLECTION_ID,
      ID.unique(),
      data
    );
  },

  async getProfileByUserId(userId: string): Promise<Profile | null> {
    const res = await databases.listDocuments<Profile>(
      DATABASE_ID,
      COLLECTION_ID,
      [Query.equal("userId", userId)]
    );

    return res.documents?.[0] || null;
  },

  async getProfileByUsername(username: string): Promise<Profile | null> {
    const res = await databases.listDocuments<Profile>(
      DATABASE_ID,
      COLLECTION_ID,
      [Query.equal("username", username)]
    );

    return res.documents?.[0] || null;
  },

  async updateProfile(documentId: string, data: any): Promise<Profile> {
    return await databases.updateDocument<Profile>(
      DATABASE_ID,
      COLLECTION_ID,
      documentId,
      data
    );
  },

  async deleteProfile(documentId: string) {
    return await databases.deleteDocument(
      DATABASE_ID,
      COLLECTION_ID,
      documentId
    );
  },

  async getAllProfiles(): Promise<Profile[]> {
    const res = await databases.listDocuments<Profile>(
      DATABASE_ID,
      COLLECTION_ID
    );

    return res.documents;
  },
};
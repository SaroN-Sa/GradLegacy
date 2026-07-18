import {
  databases,
  DATABASE_ID,
  COLLECTION_ID,
  ID,
  Query,
} from "@/lib/appwrite-db";

export const profileService = {
  async createProfile(data: any) {
    return await databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID,
      ID.unique(),
      data
    );
  },

  async getProfileByUserId(userId: string) {
    const res = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [Query.equal("userId", userId)]
    );

    return res.documents?.[0] || null;
  },

  async getProfileByUsername(username: string) {
    const res = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [Query.equal("username", username)]
    );

    return res.documents?.[0] || null;
  },

  async updateProfile(documentId: string, data: any) {
    return await databases.updateDocument(
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

  async getAllProfiles() {
    const res = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID
    );

    return res.documents;
  },
};
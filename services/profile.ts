import { db } from "@/lib/appwrite-db";

export const profileService = {
  createProfile: async (data: any) => {
    return await db.createProfile(data);
  },

  getProfileByUserId: async (userId: string) => {
    const res = await db.getProfileByUserId(userId);
    return res.documents[0] || null;
  },

  getProfileByUsername: async (username: string) => {
    const res = await db.getProfileByUsername(username);
    return res.documents[0] || null;
  },

  updateProfile: async (id: string, data: any) => {
    return await db.updateProfile(id, data);
  },

  async getMyProfile(userId: string) {
  return await this.getProfileByUserId(userId);
}
};
import { ID } from "appwrite";
import { account } from "@/lib/appwrite";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;

export const authService = {
  async register(
    name: string,
    email: string,
    password: string,
    language?: string
  ) {
    const user = await account.create(
      ID.unique(),
      email,
      password,
      name
    );

    return {
      user,
      language,
    };
  },

  async login(
    email: string,
    password: string
  ) {
    return await account.createEmailPasswordSession(
      email,
      password
    );
  },

  async logout() {
    return await account.deleteSession("current");
  },

  async getCurrentUser() {
    try {
      return await account.get();
    } catch {
      return null;
    }
  },

  async forgotPassword(email: string) {
    return await account.createRecovery(
      email,
      "http://localhost:3000/reset-password"
    );
  },

  async resetPassword(
    userId: string,
    secret: string,
    password: string,
    confirmPassword: string
  ) {
    return await account.updateRecovery(
      userId,
      secret,
      password,
      confirmPassword
    );
  },
};
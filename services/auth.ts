import { ID } from "appwrite";
import { account } from "@/lib/appwrite";

export const authService = {
  async register(
    name: string,
    email: string,
    password: string
  ) {
    return account.create(
      ID.unique(),
      email,
      password,
      name
    );
  },

  async login(
    email: string,
    password: string
  ) {
    return account.createEmailPasswordSession(
      email,
      password
    );
  },

  async logout() {
    return account.deleteSession("current");
  },

  async getCurrentUser() {
    try {
      return await account.get();
    } catch {
      return null;
    }
  },
};
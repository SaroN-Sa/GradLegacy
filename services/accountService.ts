import { account } from "@/lib/appwrite";
import { ID } from "appwrite";

import {
  AccountInfo,
  ChangeEmailData,
  ChangePasswordData,
  SessionInfo,
} from "@/types/account";

export const accountService = {
  /**
   * Get the currently logged-in user.
   */
  async getCurrentAccount(): Promise<AccountInfo> {
    return (await account.get()) as unknown as AccountInfo;
  },

  /**
   * Get the current active session.
   */
  async getCurrentSession() {
    return await account.getSession("current");
  },

  /**
   * Get all active sessions.
   */
  async listSessions(): Promise<SessionInfo[]> {
    const sessions = await account.listSessions();
    return sessions.sessions as unknown as SessionInfo[];
  },

  /**
   * Change the user's email.
   */
  async changeEmail(data: ChangeEmailData) {
    return await account.updateEmail(data.email, data.password);
  },

  /**
   * Change the user's password.
   */
  async changePassword(data: ChangePasswordData) {
    return await account.updatePassword(
      data.newPassword,
      data.currentPassword
    );
  },

  /**
   * Send email verification.
   */
  async sendVerification(url: string) {
    return await account.createVerification(url);
  },

  /**
   * Logout from the current device.
   */
  async logoutCurrentSession() {
    return await account.deleteSession("current");
  },

  /**
   * Logout from all devices.
   */
  async logoutAllSessions() {
    return await account.deleteSessions();
  },

  /**
   * Delete a specific session.
   */
  async deleteSession(sessionId: string) {
    return await account.deleteSession(sessionId);
  },

  /**
   * Delete the currently logged-in account.
   *
   * Note:
   * Appwrite does not allow users to delete their own account directly.
   * This should be handled by an Appwrite Function or an admin endpoint.
   */
  async deleteAccount() {
    throw new Error(
      "Deleting an account must be handled by a secure Appwrite Function."
    );
  },
};
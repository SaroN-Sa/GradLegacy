"use client";

import { useCallback, useEffect, useState } from "react";

import { accountService } from "@/services/accountService";
import { AppwriteException } from "appwrite";

import {
  AccountInfo,
  AccountState,
  ChangeEmailData,
  ChangePasswordData,
  SessionInfo,
} from "@/types/account";

export function useAccount() {
  const [state, setState] = useState<AccountState>({
    account: null,
    sessions: [],
    loading: true,
    error: null,
  });

  const setLoading = (loading: boolean) => {
    setState((prev) => ({ ...prev, loading }));
  };

  const setError = (error: string | null) => {
    setState((prev) => ({ ...prev, error }));
  };

  /**
   * Load current account
   */
  const loadAccount = useCallback(async () => {
    try {
      const account = await accountService.getCurrentAccount();

      setState((prev) => ({
        ...prev,
        account,
      }));
    } catch (error) {
      console.error(error);
      setError("Failed to load account.");
    }
  }, []);

  /**
   * Load active sessions
   */
  const loadSessions = useCallback(async () => {
    try {
      const sessions = await accountService.listSessions();

      setState((prev) => ({
        ...prev,
        sessions,
      }));
    } catch (error) {
      console.error(error);
      setError("Failed to load sessions.");
    }
  }, []);

  /**
   * Refresh everything
   */
  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await Promise.all([
        loadAccount(),
        loadSessions(),
      ]);
    } finally {
      setLoading(false);
    }
  }, [loadAccount, loadSessions]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  /**
   * Change email
   */
  

const changeEmail = async (data: ChangeEmailData) => {
  setLoading(true);

  try {
    await accountService.changeEmail(data);
    await loadAccount();
  } catch (error) {
    if (error instanceof AppwriteException) {
      setError(error.message);
    } else {
      setError("Something went wrong.");
    }
  } finally {
    setLoading(false);
  }
};

  /**
   * Change password
   */
  const changePassword = async (
    data: ChangePasswordData
  ) => {
    setLoading(true);

    try {
      await accountService.changePassword(data);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Send verification email
   */
  const sendVerification = async (url: string) => {
    return accountService.sendVerification(url);
  };

  /**
   * Logout current device
   */
  const logoutCurrentSession = async () => {
    return accountService.logoutCurrentSession();
  };

  /**
   * Logout all devices
   */
  const logoutAllSessions = async () => {
    return accountService.logoutAllSessions();
  };

  /**
   * Delete one session
   */
  const deleteSession = async (sessionId: string) => {
    await accountService.deleteSession(sessionId);
    await loadSessions();
  };

  return {
    ...state,

    refresh,

    changeEmail,
    changePassword,

    sendVerification,

    logoutCurrentSession,
    logoutAllSessions,
    deleteSession,
  };
}
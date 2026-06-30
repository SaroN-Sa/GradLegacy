"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { Models } from "appwrite";
import { authService } from "@/services/auth";

interface UserContextType {
  user: Models.User<Models.Preferences> | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  refreshUser: async () => {},
});

export function UserProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] =
    useState<Models.User<Models.Preferences> | null>(null);

  const [loading, setLoading] =
    useState(true);

  async function refreshUser() {
    try {
      const currentUser =
        await authService.getCurrentUser();

      setUser(currentUser);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        refreshUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
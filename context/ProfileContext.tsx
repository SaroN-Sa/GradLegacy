"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { profileService } from "@/services/profile";
import { useUser } from "./UserContext";

interface ProfileContextType {
  profile: any;
  loading: boolean;
  refreshProfile: () => Promise<void>;
}

const ProfileContext =
  createContext<ProfileContextType>({
    profile: null,
    loading: true,
    refreshProfile: async () => {},
  });

export function ProfileProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = useUser();

  const [profile, setProfile] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  async function refreshProfile() {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const data =
        await profileService.getProfileByUserId(
          user.$id
        );

      setProfile(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshProfile();
  }, [user]);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        loading,
        refreshProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}
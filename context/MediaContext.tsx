"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { authService } from "@/services/auth";
import { mediaService } from "@/services/media";
import { Media } from "@/types/media";

interface MediaContextValue {
  userId: string;
  media: Media[];
  loading: boolean;
  refreshing: boolean;
  refresh: () => Promise<void>;
  deleteMedia: (item: Media) => Promise<void>;
}

const MediaContext = createContext<MediaContextValue | null>(null);

export function MediaProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState("");
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const user = await authService.getCurrentUser();
      if (!user) return;
      setUserId(user.$id);
      const result = await mediaService.getUserMedia(user.$id);
      setMedia(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const refresh = useCallback(async () => {
    if (!userId) return;
    try {
      setRefreshing(true);
      const result = await mediaService.getUserMedia(userId);
      setMedia(result);
    } catch (err) {
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  }, [userId]);

  const deleteMedia = useCallback(
    async (item: Media) => {
      await mediaService.deleteMedia(item.$id);
      await refresh();
    },
    [refresh]
  );

  return (
    <MediaContext.Provider value={{ userId, media, loading, refreshing, refresh, deleteMedia }}>
      {children}
    </MediaContext.Provider>
  );
}

export function useMediaContext() {
  const ctx = useContext(MediaContext);
  if (!ctx) throw new Error("useMediaContext must be used inside a <MediaProvider>");
  return ctx;
}
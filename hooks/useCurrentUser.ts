"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { account } from "@/lib/appwrite";
import { profileService } from "@/services/profile";

interface CurrentUser {
  name: string;
  image?: string;
}

// userId comes from account.get().$id (the Appwrite Auth user),
// which is matched against the `userId` field on your GraduateProfiles
// documents via profileService.getProfileByUserId().

export function useCurrentUser() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        // Throws if there's no valid session (logged out / expired / deleted)
        const accountData = await account.get();

        // ASSUMPTION: the GraduateProfiles document has `fullName` and
        // `profileImage` fields. If your real field names differ, change
        // them here — nothing else needs to change.
        const profile = await profileService.getProfileByUserId(
          accountData.$id
        );

        if (!isMounted) return;

        setUser({
          name: profile?.fullName || accountData.name,
          image: profile?.profileImage,
        });
      } catch (error) {
        console.error("Session check failed:", error);
        router.replace("/login");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [router]);

  return { loading, user };
}